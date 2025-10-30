import { useState } from "react";
import { Folder } from "lucide-react";
import FileIcon from "@/components/fileIcon/FileIcon.component";
import { useObjectBrowser } from "./context";
import { cn } from "@/lib/utils";

// TODO: add folder and parent customizartion
export interface ObjectBrowserListProps<T> {
  className?: string;
  renderFileRow?: (file: T) => React.ReactNode;
  // renderFolderRow?: (prefix: string) => React.ReactNode;
  // renderParentRow?: () => React.ReactNode;
}

export function ObjectBrowserList<T>({
  className,
  renderFileRow,
  // renderFolderRow,
  // renderParentRow,
}: ObjectBrowserListProps<T>) {

  const { prefix, index, setPrefix, onObjectClick, query, contentScrollRef, onDropFiles } = useObjectBrowser<any>();

  const [isDragOver, setIsDragOver] = useState(false);
  const showFolders = !query;
  const folders = showFolders ? [...(index.children.get(prefix) ?? [])].sort() : [];
  const allFilesHere = index.filesUnder.get(prefix) ?? [];
  const lower = query.toLowerCase();
  const files = lower
    ? allFilesHere.filter((f) =>
      String(f.name).toLowerCase().includes(lower)
    )
    : allFilesHere;

  const rows = [
    ...(prefix ? [{ type: "parent" as const }] : []),
    ...folders.map((f) => ({ type: "folder" as const, prefix: f })),
    ...files.map((f) => ({ type: "file" as const, file: f })),
  ];

  // TODO: add missing handlers to context
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!onDropFiles) return;
    e.preventDefault();
    setIsDragOver(true);
    // onDragEnter?.(currentPrefix);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!onDropFiles) return;
    e.preventDefault();
    setIsDragOver(false);
    // onDragLeave?.(currentPrefix);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!onDropFiles) return;
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (files.length > 0) onDropFiles(droppedFiles, prefix);
  };

  // --- Keyboard navigation
  const focusSibling = (el: HTMLElement, dir: 1 | -1) => {
    const container = el.parentElement;
    if (!container) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-row="true"]'));
    const i = items.indexOf(el);
    if (i === -1) return;
    const next = items[i + dir];
    next?.focus();
  };
  const focusEdge = (el: HTMLElement, edge: "first" | "last") => {
    const container = el.parentElement;
    if (!container) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-row="true"]'));
    if (!items.length) return;
    const target = edge === "first" ? items[0] : items[items.length - 1];
    target?.focus();
  };
  const makeRowKeyDown =
    (activate: () => void) =>
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowDown") { e.preventDefault(); focusSibling(e.currentTarget, 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); focusSibling(e.currentTarget, -1); }
        else if (e.key === "Home") { e.preventDefault(); focusEdge(e.currentTarget, "first"); }
        else if (e.key === "End") { e.preventDefault(); focusEdge(e.currentTarget, "last"); }
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      };

  return (
    <div className={cn('flex-1 min-h-0 overflow-auto ', className)} ref={contentScrollRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="list"
      aria-label="Objects list"
    >
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-md text-primary pointer-events-none" role="status">
          Drop files to upload here
        </div>
      )}
      {rows.map((row) => {
        if (row.type === "parent") {
          const parent = index.parent.get(prefix) ?? "";
          return (
            <div
              key=".."
              className="flex items-center gap-2 py-2 px-3 cursor-pointer text-sm hover:bg-muted/50 border-b"
              onClick={() => setPrefix(parent)}
              role="listitem"
              data-row="true"
              tabIndex={0}
              aria-label="Go to parent folder"
              onKeyDown={makeRowKeyDown(() => setPrefix(parent))}
            >
              <Folder className="w-4 h-4 text-yellow-500" aria-hidden="true" />
              ..
            </div>
          );
        }

        if (row.type === "folder") {
          return (
            <div
              key={row.prefix}
              className="flex items-center gap-2 py-2 px-3 cursor-pointer text-sm hover:bg-muted/50 border-b"
              onClick={() => setPrefix(row.prefix)}
              role="listitem"
              data-row="true"
              tabIndex={0}
              aria-label={`Open folder ${row.prefix}`}
              onKeyDown={makeRowKeyDown(() => setPrefix(row.prefix))}
            >
              <Folder className="w-4 h-4 text-yellow-500" aria-hidden="true" />
              {row.prefix}
            </div>
          );
        }

        if (renderFileRow) return (
          <div
            key={row.file.name}
            className="border-b cursor-pointer hover:bg-muted/50"
            onClick={() => onObjectClick(row.file)}
            role="listitem"
            data-row="true"
            tabIndex={0}
            aria-label={`Open file ${String(row.file.name).split("/").pop()}`}
            onKeyDown={makeRowKeyDown(() => onObjectClick(row.file))}
          >
            {renderFileRow(row.file as T)}
          </div>
        );

        return (
          <div
            key={row.file.name}
            className="flex justify-between items-center py-2 px-3 text-sm cursor-pointer hover:bg-muted/50 border-b"
            onClick={() => onObjectClick(row.file)}
            role="listitem"
            data-row="true"
            tabIndex={0}
            aria-label={`Open file ${String(row.file.name).split("/").pop()}`}
            onKeyDown={makeRowKeyDown(() => onObjectClick(row.file))}
          >
            <div className="flex items-center gap-2">
              <FileIcon fileName={row.file.name} className="w-4 h-4" aria-hidden="true" />
              {String(row.file.name).split("/").pop()}
            </div>
          </div>
        );
      })}

      {!rows.length && (
        <div className="text-muted-foreground text-sm text-center py-6" role="status">
          Empty folder
        </div>
      )}
    </div>
  );
}
