"use client";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";
import { dummyPullRequests } from "../utils/constants";
import PullRequestCard from "./pull-request-card";
export type TPrFilter = "all" | "open" | "closed";

const PullRequestList = () => {
  const [prFilter, setPrFilter] = useState<TPrFilter>("all");
  const [prSearch, setPrSearch] = useState("");
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={prFilter}
          onValueChange={(value) => setPrFilter(value as TPrFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="public">Open</TabsTrigger>
            <TabsTrigger value="private">Closed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search pull requests…"
            className="pl-10"
            value={prSearch}
            onChange={(event) => setPrSearch(event.target.value)}
          />
        </div>
      </div>
      <div className="rounded-none border border-border flex flex-col gap-2">
        {dummyPullRequests.map((pr) => (
          <PullRequestCard {...pr} key={pr.id} />
        ))}
      </div>
    </div>
  );
};

export default PullRequestList;
