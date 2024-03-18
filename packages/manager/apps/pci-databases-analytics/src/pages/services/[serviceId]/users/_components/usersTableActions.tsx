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
import { GenericUser } from '@/api/databases/users';
import { useServiceData } from '../../layout';
import { database } from '@/models/database';
import { useToast } from '@/components/ui/use-toast';

interface UserActionsProps {
  user: GenericUser;
  onDeleteClicked: (user: GenericUser) => void;
  onResetPasswordClicked: (user: GenericUser) => void;
}

const UserActions = ({
  user,
  onDeleteClicked,
  onResetPasswordClicked,
}: UserActionsProps) => {
  const { service } = useServiceData();
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  return (
    <div className="w-full text-right pr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {service.capabilities.users?.update && (
            <DropdownMenuItem
              disabled={
                service.capabilities.users?.update ===
                database.service.capability.StateEnum.disabled
              }
              onClick={() => {
                toast.toast({
                  title: t('tableActionsMenuNotImplementedYet'),
                });
              }}
            >
              {t('tableActionsMenuEdit')}
            </DropdownMenuItem>
          )}
          {service.capabilities.users?.update && (
            <DropdownMenuItem
              disabled={
                service.capabilities.users?.update ===
                database.service.capability.StateEnum.disabled
              }
              onClick={() => onResetPasswordClicked(user)}
            >
              {t('tableActionsMenuResetPassword')}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {service.capabilities.users?.delete && (
            <DropdownMenuItem
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
