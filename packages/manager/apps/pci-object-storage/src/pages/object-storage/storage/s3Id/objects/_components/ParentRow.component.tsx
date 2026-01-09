import { FolderUp } from 'lucide-react';
import { VIRTUALIZED_BROWSER } from '@/components/virtualized-browser/virtualized-browser.constants';

export function getParentPrefix(prefix: string): string {
  const parts = prefix.split('/').filter(Boolean);
  if (parts.length <= 1) return '';
  return `${parts.slice(0, -1).join('/')}/`;
}

interface ParentRowProps {
  prefix: string;
  onOpenFolder: (prefix: string) => void;
}

export function ParentRow({ prefix, onOpenFolder }: ParentRowProps) {
  const handleOpen = () => onOpenFolder(getParentPrefix(prefix));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="py-2 px-3 grid grid-cols-[minmax(0,1fr)] cursor-pointer hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
      style={{ height: VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT }}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-2 font-medium">
        <FolderUp className="w-4 h-4 text-yellow-500" />
        ..
      </div>
    </div>
  );
}
