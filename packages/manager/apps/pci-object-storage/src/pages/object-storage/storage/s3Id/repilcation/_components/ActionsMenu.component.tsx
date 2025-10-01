import { MoreVertical, Edit, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
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
        <Button variant="ghost" size="sm">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(replication)}>
          <Edit className="mr-2 size-4" />
          {t('actionEdit')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(replication)}>
          <Trash className="mr-2 size-4" />
          {t('actionDelete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
