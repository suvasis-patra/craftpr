import { openrouter } from "@/features/ai/utils/client";
import { REVIEW_MODEL, SYSTEM_PROMPT } from "@/features/ai/utils/constants";
import { getGithubApp } from "@/features/github/server/github-app";
import { generateText } from "ai";

function buildRepoContext(repoContextSnippets: string[]) {
  if (repoContextSnippets.length === 0) return "";
  const repoContext = repoContextSnippets.join("\n\n---\n\n");

  return ` Related code from the repository (for context only, not part of the change): ${repoContext}`;
}

export async function generateAIReview({
  repoContextSnippets,
  repoName,
  prTitle,
  contextSnippets,
}: {
  repoName: string;
  prTitle: string;
  contextSnippets: string[];
  repoContextSnippets: string[];
}) {
  const context = contextSnippets.join("\n\n--\n\n");
  const repoContext = buildRepoContext(repoContextSnippets);
  const { text } = await generateText({
    model: openrouter(REVIEW_MODEL),
    system: SYSTEM_PROMPT,
    prompt: `Repository: ${repoName}
  Pull request title: ${prTitle}
  
  Code changes:
  
  ${context}${repoContext}`,
  });

  return text;
}

export async function postAiReviewToGithub({
  installationId,
  repoFullName,
  prNumber,
  body,
}: {
  installationId: number;
  repoFullName: string;
  prNumber: number;
  body: string;
}) {
  const app = getGithubApp();
  const [owner, repo] = repoFullName.split("/");
  const octokit = await app.getInstallationOctokit(installationId);
  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    { repo, owner, issue_number: prNumber, body },
  );
}
