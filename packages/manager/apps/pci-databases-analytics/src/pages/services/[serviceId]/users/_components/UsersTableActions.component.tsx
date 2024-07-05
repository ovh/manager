import { MoreHorizontal } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { GenericUser } from '@/data/api/database/user.api';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';

interface UserActionsProps {
  user: GenericUser;
  onDeleteClicked: (user: GenericUser) => void;
  onResetPasswordClicked: (user: GenericUser) => void;
  onEditClicked: (user: GenericUser) => void;
}

const UserActions = ({
  user,
  onDeleteClicked,
  onResetPasswordClicked,
  onEditClicked,
}: UserActionsProps) => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  return (
    <div className="w-full text-right pr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="menu" size="menu" data-testid="user-action-trigger">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" data-testid="user-action-content">
          {service.capabilities.users?.update && (
            <DropdownMenuItem
              data-testid="user-action-edit-button"
              variant="primary"
              disabled={
                service.capabilities.users?.update ===
                database.service.capability.StateEnum.disabled
              }
              onClick={() => onEditClicked(user)}
            >
              {t('tableActionsMenuEdit')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            data-testid="user-action-reset-password-button"
            variant="primary"
            disabled={
              service.capabilities.userCredentialsReset?.create ===
              database.service.capability.StateEnum.disabled
            }
            onClick={() => onResetPasswordClicked(user)}
          >
            {t('tableActionsMenuResetPassword')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {service.capabilities.users?.delete && (
            <DropdownMenuItem
              data-testid="user-action-delete-button"
              variant="destructive"
              disabled={
                service.capabilities.users?.delete ===
                database.service.capability.StateEnum.disabled
              }
              onClick={() => onDeleteClicked(user)}
            >
              {t('tableActionsMenuDelete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserActions;
