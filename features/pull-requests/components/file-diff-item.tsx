"use client";

import { useState, useMemo } from "react";
import { Diff, Hunk, parseDiff } from "react-diff-view";
import { PRFileStatus } from "@/lib/generated/prisma/enums";
import {
  ChevronDown,
  ChevronRight,
  FilePlus,
  FileEdit,
  FileMinus,
  FileOutput,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Simple diff viewer as fallback when react-diff-view fails
function SimpleDiffViewer({ patch }: { patch: string }) {
  if (!patch || typeof patch !== 'string') {
    return <div className="p-4 text-muted-foreground text-sm">No patch data available</div>;
  }
  
  const lines = patch.split('\n');
  let lineNumber = 0;
  
  return (
    <div className="font-mono text-xs bg-[#1e1e1e]">
      <div className="flex">
        {/* Line numbers column */}
        <div className="w-12 text-right pr-3 text-[#858585] select-none border-r border-[#3c3c3c] bg-[#1e1e1e]">
          {lines.map((line, i) => {
            if (line.startsWith('@@')) {
              lineNumber = parseInt(line.match(/\+(\d+)/)?.[1] || '0') - 1;
              return <div key={i} className="px-2 py-0.5 text-[#6a6a6a]">...</div>;
            }
            if (line.startsWith('+') || line.startsWith('-') || line.startsWith(' ')) {
              lineNumber++;
              return <div key={i} className="px-2 py-0.5">{lineNumber}</div>;
            }
            return <div key={i} className="px-2 py-0.5"> </div>;
          })}
        </div>
        
        {/* Code content column */}
        <div className="flex-1 pl-2">
          {lines.map((line, i) => {
            let lineClass = 'text-[#d4d4d4]';
            let prefix = '';
            
            if (line.startsWith('+')) {
              lineClass = 'bg-[#2ea04326] text-[#d4d4d4]';
              prefix = '+';
            } else if (line.startsWith('-')) {
              lineClass = 'bg-[#f8514926] text-[#d4d4d4]';
              prefix = '-';
            } else if (line.startsWith('@@')) {
              lineClass = 'bg-[#58a6ff26] text-[#58a6ff] font-semibold';
              prefix = '';
            } else if (line.startsWith(' ')) {
              lineClass = 'text-[#d4d4d4]';
              prefix = ' ';
            }
            
            const content = line.startsWith('+') || line.startsWith('-') || line.startsWith(' ') 
              ? line.substring(1) 
              : line;
            
            return (
              <div key={i} className={cn('flex px-2 py-0.5', lineClass)}>
                <span className="w-4 shrink-0 opacity-60 text-[#6a6a6a]">{prefix}</span>
                <span className="flex-1">{content || '\u00A0'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface FileDiffItemProps {
  filePath: string;
  patch: string;
  status: PRFileStatus;
  additions: number;
  deletions: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const statusConfig = {
  [PRFileStatus.ADDED]: {
    icon: FilePlus,
    label: "ADDED",
    className: "text-green-600 dark:text-green-400",
  },
  [PRFileStatus.MODIFIED]: {
    icon: FileEdit,
    label: "MODIFIED",
    className: "text-yellow-600 dark:text-yellow-400",
  },
  [PRFileStatus.DELETED]: {
    icon: FileMinus,
    label: "DELETED",
    className: "text-red-600 dark:text-red-400",
  },
  [PRFileStatus.RENAMED]: {
    icon: FileOutput,
    label: "RENAMED",
    className: "text-blue-600 dark:text-blue-400",
  },
};

export default function FileDiffItem({
  filePath,
  patch,
  status,
  additions,
  deletions,
  isExpanded = false,
  onToggle,
}: FileDiffItemProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  
  // Safe config access with fallback
  const config = useMemo(() => {
    return statusConfig[status] || statusConfig[PRFileStatus.MODIFIED];
  }, [status]);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle?.();
  };

  // Parse the diff for react-diff-view with extensive safety checks
  const diff = useMemo(() => {
    // Safety check for patch data
    if (!patch || typeof patch !== 'string' || patch.trim() === '') {
      return null;
    }
    
    try {
      const parsed = parseDiff(patch);
      // Check if the parsed result is valid
      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
        return null;
      }
      return parsed;
    } catch (error) {
      console.error("Failed to parse diff:", error);
      return null;
    }
  }, [patch]);

  // Always use simple fallback for now to avoid react-diff-view issues
  const useSimpleFallback = true;

  return (
    <div className="border-b border-[#3c3c3c] last:border-b-0">
      {/* File Tab */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 hover:bg-[#2d2d2d] transition-colors cursor-pointer border-l-2",
          expanded ? "bg-[#252526] border-l-[#2ea043]" : "border-l-transparent"
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Expand/Collapse Icon */}
          <div className="shrink-0">
            {expanded ? (
              <ChevronDown className="size-4 text-[#858585]" />
            ) : (
              <ChevronRight className="size-4 text-[#858585]" />
            )}
          </div>

          {/* File Path */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#d4d4d4] truncate">
              {filePath}
            </p>
          </div>

          {/* Changes Count */}
          <div className="flex items-center gap-2 text-xs text-[#858585] shrink-0">
            <span className="text-[#2ea043] font-medium">
              +{additions}
            </span>
            <span className="text-[#f85149] font-medium">
              -{deletions}
            </span>
          </div>
        </div>
      </div>

      {/* File Path and Diff Content */}
      {expanded && (
        <div className="bg-[#1e1e1e]">
          {/* File Path Display */}
          <div className="px-4 py-2 bg-[#252526] border-b border-[#3c3c3c]">
            <p className="text-xs text-[#858585] font-mono">{filePath}</p>
          </div>
          
          {/* Diff Content */}
          <div className="overflow-x-auto">
            {useSimpleFallback ? (
              <SimpleDiffViewer patch={patch} />
            ) : (
              <div className="overflow-x-auto">
                {diff?.map((file, i) => (
                  <Diff
                    key={i}
                    viewType="unified"
                    diffType={file.type}
                    hunks={file.hunks}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
