import { handleWebhookEvents } from "@/features/github/server/webhook-handler";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return await handleWebhookEvents(request);
}
