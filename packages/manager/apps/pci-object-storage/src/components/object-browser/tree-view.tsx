import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardContent, Skeleton } from "@datatr-ux/uxlib";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import FileIcon from "@/components/fileIcon/FileIcon.component";
import { cn } from "@/lib/utils";
import { useObjectBrowser } from "./context";

type FileRow = { name: string;[k: string]: any };

function Row({
  prefix,
  depth,
  selected,
  onPrefixClick,
  onFileClick,
}: {
  prefix: string;
  depth: number;
  selected?: string;
  onPrefixClick?: (p: string) => void;
  onFileClick?: (f: FileRow) => void;
}) {
  const { index } = useObjectBrowser<any>();

  const children = useMemo(
    () => Array.from(index.children.get(prefix) ?? []).sort(),
    [index, prefix]
  );
  const files = useMemo(
    () => (index.filesUnder.get(prefix) ?? []) as FileRow[],
    [index, prefix]
  );

  const isSelected = prefix === selected;
  const hasChildren = children.length > 0 || files.length > 0;

  const [expanded, setExpanded] = useState(
    // root expanded by default
    prefix === "" || isSelected
  );

  // Auto-expand any ancestor of the selected prefix
  useEffect(() => {
    if (!selected) return;
    if (prefix === "") { setExpanded(true); return; }
    if (selected.startsWith(prefix)) setExpanded(true);
  }, [selected, prefix]);

  // Keyboard navigation
  const onRowKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      if (hasChildren && !expanded) {
        e.preventDefault();
        setExpanded(true);
      }
    } else if (e.key === "ArrowLeft") {
      if (hasChildren && expanded) {
        e.preventDefault();
        setExpanded(false);
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (hasChildren) setExpanded(!expanded);
      onPrefixClick?.(prefix);
    }
  };

  return (
    <div>
      <div
        data-prefix={prefix}
        className={cn(
          "flex items-center cursor-pointer hover:text-primary text-sm",
          isSelected && "text-primary"
        )}
        style={{ paddingLeft: `${depth * 1.25}rem` }}
        role="treeitem"
        aria-selected={isSelected || undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        tabIndex={0}
        onKeyDown={onRowKeyDown}
      >
        {/* Chevron */}
        {hasChildren ? (
          expanded ? (
            <ChevronDown
              className="w-4 h-4 mr-1 flex-shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
              aria-hidden="true"
            />
          ) : (
            <ChevronRight
              className="w-4 h-4 mr-1 flex-shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(true);
              }}
              aria-hidden="true"
            />
          )
        ) : (
          <span className="inline-block w-4 h-4 mr-1" />
        )}

        {/* Folder icon + name */}
        <Folder
          className="w-4 h-4 mr-1 text-yellow-500 flex-shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onPrefixClick?.(prefix);
          }}
          aria-hidden="true"
        />

        <span
          className="cursor-pointer"
          role="button"
          aria-label={prefix ? `Open folder ${prefix}` : "Open root folder"}
          onClick={(e) => {
            e.stopPropagation();
            onPrefixClick?.(prefix);
          }}
        >
          {prefix || "(root)"}
        </span>
      </div>

      {/* Sub-folders */}
      {expanded &&
        children.map((child) => (
          <Row
            key={child || "(root)"}
            prefix={child}
            depth={depth + 1}
            selected={selected}
            onPrefixClick={onPrefixClick}
            onFileClick={onFileClick}
          />
        ))}

      {/* Files under this folder */}
      {expanded &&
        files.map((f) => (
          <div
            key={String(f.name)}
            className={cn(
              "flex items-center cursor-pointer hover:text-primary text-sm whitespace-nowrap min-w-fit",
            )}
            style={{ paddingLeft: `${depth * 1.25}rem` }}
            onClick={(e) => {
              e.stopPropagation();
              onFileClick?.(f);
            }}
            role="treeitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFileClick?.(f);
              }
            }}
            aria-label={`Open file ${String(f.name).split("/").pop()}`}
          >
            <span className="inline-block w-4 h-4 mr-1" />
            <FileIcon fileName={String(f.name)} className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{String(f.name).split("/").pop()}</span>
          </div>
        ))}
    </div>
  );
}

export function ObjectBrowserTreeView({
  title = "Object Explorer",
  isLoading,
  className,
}: {
  title?: string;
  isLoading?: boolean;
  className?: string;
}) {
  const { index, selectedPrefix, setPrefix, onObjectClick, treeScrollRef } = useObjectBrowser<any>();

  if (isLoading) {
    return (
      <Card className={cn("h-full flex flex-col flex-1 min-h-0 overflow-auto", className)}>
        <CardHeader className="shrink-0 p-0">
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardContent className="space-y-2 p-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full flex flex-col flex-1 min-h-0 overflow-auto border-none", className)}>
      <CardContent className="flex-1 overflow-auto whitespace-nowrap min-h-0 p-2" ref={treeScrollRef}>
        <Row
          prefix=""
          depth={0}
          selected={selectedPrefix}
          onPrefixClick={setPrefix}
          onFileClick={onObjectClick}
        />
      </CardContent>
    </Card>
  );
}
