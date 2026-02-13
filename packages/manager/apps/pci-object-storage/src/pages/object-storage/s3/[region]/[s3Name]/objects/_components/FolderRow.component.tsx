import { Folder } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VIRTUALIZED_BROWSER } from '@/components/virtualized-browser/virtualized-browser.constants';

interface FolderRowProps {
  item: {
    type: 'folder';
    key: string;
    name: string;
  };
  onOpenFolder: (prefix: string) => void;
}

const FolderRow = ({ item, onOpenFolder }: FolderRowProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const handleOpen = () => onOpenFolder(item.key);

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
      aria-label={t('openFolder', { name: item.name })}
      className="py-2 px-3 grid grid-cols-[minmax(0,1fr)] cursor-pointer hover:bg-primary-50 border-b focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
      style={{ height: VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT }}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Folder className="w-4 h-4 text-yellow-500" />
        <span className="truncate">{item.name}</span>
      </div>
    </div>
  );
};

export { FolderRow };
