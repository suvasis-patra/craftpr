import { TGithubRepo } from "./types";

function getRepoVisibility(isPrivate?: boolean): TGithubRepo["visibility"] {
  if (isPrivate) {
    return "private";
  }

  return "public";
}

export function mapRepo(repo: {
  id: number | bigint;
  name: string;
  full_name: string;
  private?: boolean;
  default_branch?: string;
  updated_at?: string | null;
  language?: string | null;
  stargazers_count?: number | null;
}): TGithubRepo {
  return {
    id: String(repo.id),
    name: repo.name,
    fullName: repo.full_name,
    visibility: getRepoVisibility(repo.private),
    defaultBranch: repo.default_branch ?? "main",
    updatedAt: repo.updated_at ?? new Date().toISOString(),
    language: repo.language ?? null,
    stars: repo.stargazers_count ?? 0,
  };
}
