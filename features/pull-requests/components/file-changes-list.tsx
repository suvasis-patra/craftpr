"use client";

import { useState } from "react";
import { PRFileStatus } from "@/lib/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  FilePlus, 
  FileEdit, 
  FileMinus, 
  FileOutput,
  Filter,
  ChevronUp,
  ChevronDown as ExpandAllIcon,
  FileCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import FileDiffItem from "./file-diff-item";

interface FileChangesListProps {
  files: Array<{
    id: string;
    filePath: string;
    patch: string;
    status: PRFileStatus;
    additions: number;
    deletions: number;
  }>;
}

type FilterType = "all" | "added" | "modified" | "deleted" | "renamed";

const filterConfig = {
  all: { label: "All Files", icon: Filter },
  added: { label: "Added", icon: FilePlus },
  modified: { label: "Modified", icon: FileEdit },
  deleted: { label: "Deleted", icon: FileMinus },
  renamed: { label: "Renamed", icon: FileOutput }
};

export default function FileChangesList({ files }: FileChangesListProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const filteredFiles = files.filter(file => {
    if (filter === "all") return true;
    return file.status.toLowerCase() === filter;
  });

  const toggleExpandAll = () => {
    if (expandedFiles.size === filteredFiles.length) {
      setExpandedFiles(new Set());
    } else {
      setExpandedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  };

  const toggleFileExpand = (fileId: string) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <div className="space-y-0">
      {/* Files Changed Summary Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#3c3c3c]">
        <div className="flex items-center gap-3">
          <FileCode className="size-4 text-[#858585]" />
          <span className="text-sm font-medium text-[#d4d4d4]">
            {files.length} {files.length === 1 ? 'file' : 'files'} changed
          </span>
          <span className="text-sm text-[#2ea043] font-medium">
            +{totalAdditions}
          </span>
          <span className="text-sm text-[#f85149] font-medium">
            -{totalDeletions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-[#858585] mr-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#2ea04326] border border-[#2ea04340]" />
              <span>Added</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-[#f8514926] border border-[#f8514940]" />
              <span>Removed</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpandAll}
            className="gap-2 h-8 text-xs text-[#d4d4d4] hover:bg-[#2d2d2d]"
          >
            {expandedFiles.size === filteredFiles.length ? (
              <>
                <ChevronUp className="size-3" />
                Collapse all
              </>
            ) : (
              <>
                <ExpandAllIcon className="size-3" />
                Expand all
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 bg-[#1e1e1e] border-b border-[#3c3c3c]">
        {(Object.keys(filterConfig) as FilterType[]).map((filterType) => {
          const config = filterConfig[filterType];
          const Icon = config.icon;
          const isActive = filter === filterType;
          
          return (
            <Button
              key={filterType}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(filterType)}
              className={cn(
                "gap-2 h-8 text-xs rounded-md",
                isActive 
                  ? "bg-[#2d2d2d] text-[#d4d4d4] border border-[#3c3c3c]" 
                  : "text-[#858585] hover:text-[#d4d4d4] hover:bg-[#2d2d2d]"
              )}
            >
              <Icon className="size-3" />
              {config.label}
            </Button>
          );
        })}
      </div>

      {/* Files List */}
      <div className="divide-y divide-[#3c3c3c]">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FileEdit className="size-12 text-[#858585]/50 mx-auto mb-4" />
            <p className="text-[#858585] text-sm">
              No files found for this filter
            </p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <FileDiffItem
              key={file.id}
              filePath={file.filePath}
              patch={file.patch}
              status={file.status}
              additions={file.additions}
              deletions={file.deletions}
              isExpanded={expandedFiles.has(file.id)}
              onToggle={() => toggleFileExpand(file.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}