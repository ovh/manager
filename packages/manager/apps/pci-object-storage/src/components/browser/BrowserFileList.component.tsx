import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import FileIcon from '@/components/file-icon/FileIcon.component';
import { useBrowser } from './BrowserRoot.component';

export interface BrowserFileListProps<T extends { name: string }> {
  className?: string;
  renderFileRow?: (file: T) => React.ReactNode;
}

enum RowType {
  parent = 'parent',
  folder = 'folder',
  file = 'file',
}
type Row<T> =
  | { type: RowType.parent }
  | { type: RowType.folder; prefix: string }
  | { type: RowType.file; file: T };

const BrowserFileList = <T extends { name: string }>({
  className,
  renderFileRow,
}: BrowserFileListProps<T>) => {
  const {
    prefix,
    setPrefix,
    index,
    onObjectClick,
    onDropFiles,
    contentScrollRef,
    getObjectKey,
  } = useBrowser<T>();

  const [isDragOver, setIsDragOver] = useState(false);

  const folders: string[] = [...(index.children.get(prefix) ?? [])].sort();
  const files: T[] = index.filesUnder.get(prefix) ?? [];

  const rows: Row<T>[] = [
    ...(prefix ? [{ type: RowType.parent as const }] : []),
    ...folders.map((f): Row<T> => ({ type: RowType.folder, prefix: f })),
    ...files.map((f): Row<T> => ({ type: RowType.file, file: f })),
  ];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!onDropFiles) return;
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDropFiles(droppedFiles, prefix);
  };

  return (
    <div
      className={cn('flex-1 min-h-0 overflow-auto relative', className)}
      ref={contentScrollRef}
      onDragOver={(e) => {
        if (onDropFiles) {
          e.preventDefault();
          setIsDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (onDropFiles) {
          e.preventDefault();
          setIsDragOver(false);
        }
      }}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-md text-primary pointer-events-none">
          Drop files to upload here
        </div>
      )}

      {rows.map((row) => {
        switch (row.type) {
          case 'parent': {
            const parent = index.parent.get(prefix) ?? '';
            return (
              <div
                key=".."
                className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-muted/50 border-b"
                onClick={() => setPrefix(parent)}
              >
                <Folder className="w-4 h-4 text-yellow-500" /> ..
              </div>
            );
          }

          case 'folder':
            return (
              <div
                key={row.prefix}
                className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-muted/50 border-b"
                onClick={() => setPrefix(row.prefix)}
              >
                <Folder className="w-4 h-4 text-yellow-500" />{' '}
                {row.prefix.replace(prefix, '')}
              </div>
            );

          case 'file': {
            const reactKey = getObjectKey?.(row.file) ?? row.file.name;
            return renderFileRow ? (
              <div
                key={reactKey}
                className="border-b cursor-pointer hover:bg-muted/50"
                onClick={() => onObjectClick?.(row.file)}
              >
                {renderFileRow(row.file)}
              </div>
            ) : (
              <div
                key={reactKey}
                className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-muted/50 border-b"
                onClick={() => onObjectClick?.(row.file)}
              >
                <FileIcon fileName={row.file.name} className="w-4 h-4" />
                {row.file.name.split('/').pop()}
              </div>
            );
          }

          default:
            return <></>;
        }
      })}

      {!rows.length && (
        <div className="text-center text-muted-foreground py-6">
          Empty bucket
        </div>
      )}
    </div>
  );
};

export { BrowserFileList };
