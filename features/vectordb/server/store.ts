import { TCodeChunk } from "@/features/repo-sync/utils/type";
import { getPineconeIndex } from "../utils/client";
import { UPSERT_BATCH_SIZE } from "@/features/repo-sync/utils/constants";
import { CONTEXT_RESULTS } from "../utils/constants";

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

export async function getContext({
  namespace,
  query,
}: {
  namespace: string;
  query: string;
}) {
  const index = getPineconeIndex();
  const response = await index.namespace(namespace).searchRecords({
    query: { topK: CONTEXT_RESULTS, inputs: { text: query } },
  });
  const snippets: string[] = [];
  for (const hit of response.result.hits) {
    const fields = hit.fields as { text?: string; filePath?: string };
    if (!fields.text) {
      continue;
    }

    snippets.push(`File: ${fields.filePath}\n${fields.text}`);
  }
  return snippets;
}
