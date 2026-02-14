import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from '@datatr-ux/uxlib';
import { GenericUser } from '@/data/api/database/user.api';
import { useServiceData } from '../../Service.context';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

interface UsersTableActionsProps {
  user: GenericUser;
  onDeleteClicked: (user: GenericUser) => void;
  onResetPasswordClicked: (user: GenericUser) => void;
  onEditClicked: (user: GenericUser) => void;
  onViewCertificatesClicked: (user: GenericUser) => void;
  onShowAccessTokenClicked: (user: GenericUser) => void;
}

const UsersTableActions = ({
  user,
  onDeleteClicked,
  onResetPasswordClicked,
  onEditClicked,
  onShowAccessTokenClicked,
  onViewCertificatesClicked,
}: UsersTableActionsProps) => {
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
              disabled={isCapabilityDisabled(service, 'users', 'update')}
              onClick={() => onEditClicked(user)}
            >
              {t('tableActionsMenuEdit')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            data-testid="user-action-reset-password-button"
            variant="primary"
            disabled={isCapabilityDisabled(
              service,
              'userCredentialsReset',
              'create',
            )}
            onClick={() => onResetPasswordClicked(user)}
          >
            {t('tableActionsMenuResetPassword')}
          </DropdownMenuItem>
          {service.capabilities.userAccess?.read && (
            <>
              <DropdownMenuItem
                data-testid="user-action-view-certificate-button"
                variant="primary"
                disabled={isCapabilityDisabled(service, 'userAccess', 'read')}
                onClick={() => onViewCertificatesClicked(user)}
              >
                {t('tableActionsMenuViewCertificate')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="user-action-show-access-key"
                variant="primary"
                disabled={isCapabilityDisabled(service, 'userAccess', 'read')}
                onClick={() => onShowAccessTokenClicked(user)}
              >
                {t('tableActionsMenuShowAccessKey')}
              </DropdownMenuItem>
            </>
          )}

          {service.capabilities.users?.delete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="user-action-delete-button"
                variant="critical"
                disabled={isCapabilityDisabled(service, 'users', 'delete')}
                onClick={() => onDeleteClicked(user)}
              >
                {t('tableActionsMenuDelete')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UsersTableActions;
