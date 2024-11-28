import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useRemoveUser, useUser } from '@/api/hooks/useUser';

interface RemoveUserModalProps {
  projectId: string;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (cause: Error) => void;
}

export default function RemoveUserModal({
  projectId,
  userId,
  onClose,
  onSuccess,
  onError,
}: RemoveUserModalProps) {
  const { t } = useTranslation('common');
  const { data: user, isPending } = useUser(projectId || '', userId);
  const { remove, isPending: isPendingRemoveUser } = useRemoveUser({
    projectId: `${projectId}`,
    userId,
    onError: (err) => {
      onClose();
      onError(err);
    },
    onSuccess: () => {
      onClose();
      onSuccess();
    },
  });

  return (
    <OsdsModal
      headline={t('pci_projects_project_users_delete_title')}
      color={ODS_THEME_COLOR_INTENT.warning}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {!isPending && !isPendingRemoveUser && (
          <OsdsText
            slot="label"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('pci_projects_project_users_delete_content', {
              user: user?.username,
            })}
          </OsdsText>
        )}
        {(isPending || isPendingRemoveUser) && (
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => remove()}
        {...(isPending || isPendingRemoveUser ? { disabled: true } : {})}
        data-testid="submitButton"
      >
        {t('common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
