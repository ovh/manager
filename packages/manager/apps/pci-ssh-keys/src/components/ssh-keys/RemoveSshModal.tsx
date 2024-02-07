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
import { useRef } from 'react';
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
  const modal = useRef<HTMLOsdsModalElement>(null);
  const { data: sshKey, isPending } = useSshKey(projectId || '', sshId || '');
  const { remove } = useRemoveSsh({
    projectId: `${projectId}`,
    sshId: sshKey?.id || '',
    onError: (err) => {
      modal.current?.close();
      onError(err);
    },
    onSuccess: () => {
      modal.current?.close();
      onSuccess();
    },
  });

  return (
    <>
      <OsdsModal
        headline={t('pci_projects_project_sshKeys_remove')}
        onOdsModalClose={onClose}
        ref={modal}
      >
        <slot name="content">
          {!isPending && (
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
          {isPending && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
        </slot>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.default}
          onClick={() => {
            modal.current?.close();
          }}
        >
          {t('common_cancel')}
        </OsdsButton>
        <OsdsButton
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => remove()}
          data-testid="submitButton"
        >
          {t('common_confirm')}
        </OsdsButton>
      </OsdsModal>
    </>
  );
}
