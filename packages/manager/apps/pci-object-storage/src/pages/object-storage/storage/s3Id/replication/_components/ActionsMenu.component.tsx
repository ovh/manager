import { MoreVertical, Edit, Trash, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  DropdownMenuSeparator,
} from '@datatr-ux/uxlib';
import storages from '@/types/Storages';

type ActionsMenuProps = {
  replication: storages.ReplicationRule;
  onEdit: (replication: storages.ReplicationRule) => void;
  onDelete: (replication: storages.ReplicationRule) => void;
};

export function ActionsMenu({
  replication,
  onEdit,
  onDelete,
}: Readonly<ActionsMenuProps>) {
  const { t } = useTranslation('pci-object-storage/replication');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="menu" size="menu">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(replication)}>
          {t('actionEdit')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(replication)}
        >
          {t('actionDelete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
