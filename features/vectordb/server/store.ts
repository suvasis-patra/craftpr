import { TCodeChunk } from "@/features/repo-sync/utils/type";
import { getPineconeIndex } from "../utils/client";
import { UPSERT_BATCH_SIZE } from "@/features/repo-sync/utils/constants";

export async function storeChunksToVectorStore(
  chunks: TCodeChunk[],
  namespace: string,
) {
  const index = getPineconeIndex();
  for (let start = 0; start < chunks.length; start += UPSERT_BATCH_SIZE) {
    const batch = chunks.slice(start, start + UPSERT_BATCH_SIZE);
    const records = batch.map((chunk) => ({
      id: chunk.id,
      filePath: chunk.filePath,
      text: chunk.content,
    }));
    await index.namespace(namespace).upsertRecords({ records });
  }
}

export async function deleteRepoNamespace(namespace: string) {
  const index = getPineconeIndex();
  await index.deleteNamespace(namespace);
}
