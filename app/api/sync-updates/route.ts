import { getServerSession } from "@/features/auth/actions";
import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
  }

  const userId = session.user.id;
  const channel = `sync-status:${userId}`;

  const encoder = new TextEncoder();
  const redisSubscriber = new Redis(process.env.UPSTASH_REDIS_URL!, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
    connectTimeout: 10_000,
    keepAlive: 10_000,
    retryStrategy: (times) => {
      return Math.min(times * 200, 2_000);
    },
  });

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let heartbeat: NodeJS.Timeout | null = null;

      const send = (data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
          );
        } catch (error) {
          console.error("SSE: Failed to send data:", error);
        }
      };

      const cleanup = async () => {
        if (closed) return;
        closed = true;
        if (heartbeat) {
          clearInterval(heartbeat);
          heartbeat = null;
        }

        redisSubscriber.removeAllListeners("message");
        redisSubscriber.removeAllListeners("error");
        redisSubscriber.removeAllListeners("reconnecting");
        redisSubscriber.removeAllListeners("ready");

        try {
          if (redisSubscriber.status === "ready") {
            await redisSubscriber.unsubscribe(channel);
          }
        } catch (error) {
          console.error("SSE: Redis unsubscribe error:", error);
        }

        try {
          if (redisSubscriber.status !== "end") {
            await redisSubscriber.quit();
          }
        } catch (error) {
          console.error("SSE: Redis quit error:", error);

          redisSubscriber.disconnect();
        }

        try {
          controller.close();
        } catch {
          // Already closed
        }
      };

      const handleMessage = (receivedChannel: string, message: string) => {
        if (closed) return;

        if (receivedChannel !== channel) {
          return;
        }

        try {
          const data = JSON.parse(message);
          send(data);
        } catch {
          send({
            type: "sync",
            message,
          });
        }
      };

      const handleRedisError = (error: Error) => {
        console.error("SSE: Redis error:", error);
      };

      const handleRedisReconnecting = (delay: number) => {
        if (closed) return;
      };

      const handleRedisReady = () => {
        if (closed) return;
      };
      redisSubscriber.on("message", handleMessage);
      redisSubscriber.on("error", handleRedisError);
      redisSubscriber.on("reconnecting", handleRedisReconnecting);
      redisSubscriber.on("ready", handleRedisReady);

      try {
        await redisSubscriber.connect();
        await redisSubscriber.subscribe(channel);
        send({
          type: "connected",
        });
        heartbeat = setInterval(() => {
          if (closed) {
            if (heartbeat) {
              clearInterval(heartbeat);
              heartbeat = null;
            }
            return;
          }
          try {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          } catch (error) {
            cleanup();
          }
        }, 20_000);

        request.signal.addEventListener(
          "abort",
          () => {
            cleanup();
          },
          { once: true },
        );
      } catch (error) {
        if (!closed) {
          send({
            type: "error",
            error: "Failed to establish SSE connection",
          });
          await cleanup();
        }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Content-Encoding": "none",
    },
  });
}
