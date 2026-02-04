import { MoreHorizontal } from 'lucide-react';
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
  lifecycle: storages.LifecycleRule;
  onEdit: (lifecycle: storages.LifecycleRule) => void;
  onDelete: (lifecycle: storages.LifecycleRule) => void;
  onToggleStatus: (lifecycle: storages.LifecycleRule) => void;
};

export function ActionsMenu({
  lifecycle,
  onEdit,
  onDelete,
  onToggleStatus,
}: Readonly<ActionsMenuProps>) {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  const isEnabled = lifecycle.status === 'enabled';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        data-testid={`lifecycle-actions-menu-${lifecycle.id}`}
      >
        <Button variant="menu" size="menu">
          <span className="sr-only">{t('openMenu')}</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onEdit(lifecycle)}
          data-testid={`lifecycle-edit-${lifecycle.id}`}
        >
          {t('actionEdit')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onToggleStatus(lifecycle)}
          data-testid={`lifecycle-toggle-status-${lifecycle.id}`}
        >
          {t(isEnabled ? 'actionDisable' : 'actionEnable')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="critical"
          onClick={() => onDelete(lifecycle)}
          data-testid={`lifecycle-delete-${lifecycle.id}`}
        >
          {t('actionDelete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
