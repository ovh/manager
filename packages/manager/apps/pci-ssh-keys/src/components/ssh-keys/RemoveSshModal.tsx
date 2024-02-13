import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useRemoveSsh, useSshKey } from '@/hooks/useSsh';

interface RemoveSshModalProps {
  projectId: string;
  sshId: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (cause: Error) => void;
}

export default function RemoveSshModal({
  projectId,
  sshId,
  onClose,
  onSuccess,
  onError,
}: RemoveSshModalProps) {
  const { t } = useTranslation('common');
  const { data: sshKey, isPending } = useSshKey(projectId || '', sshId || '');
  const { remove, isPending: isPendingRemoveSsh } = useRemoveSsh({
    projectId: `${projectId}`,
    sshId: sshKey?.id || '',
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
    <>
      <OsdsModal
        headline={t('pci_projects_project_sshKeys_remove')}
        onOdsModalClose={onClose}
      >
        <slot name="content">
          {!isPending && !isPendingRemoveSsh && (
            <OsdsText
              slot="label"
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('pci_projects_project_sshKeys_remove_description', {
                name: sshKey?.name,
              })}
            </OsdsText>
          )}
          {(isPending || isPendingRemoveSsh) && (
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          )}
        </slot>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.default}
          onClick={onClose}
        >
          {t('common_cancel')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => remove()}
          {...(isPending || isPendingRemoveSsh ? { disabled: true } : {})}
          data-testid="submitButton"
        >
          {t('common_confirm')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
