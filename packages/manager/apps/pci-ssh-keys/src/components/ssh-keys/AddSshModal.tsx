import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
  OsdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  OdsInputValueChangeEvent,
  OdsTextAreaValueChangeEvent,
  OsdsTextareaCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { useAddSsh } from '@/api/hooks/useSsh';

interface AddSshModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (cause: Error) => void;
}

export default function AddSshModal({
  projectId,
  onClose,
  onSuccess,
  onError,
}: AddSshModalProps) {
  const { t } = useTranslation('common');
  const { add, isPending } = useAddSsh({
    projectId: `${projectId}`,
    onError: (err) => {
      onClose();
      onError(err);
    },
    onSuccess: () => {
      onClose();
      onSuccess();
    },
  });
  const [name, setName] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [formErrors, setFormErrors] = useState({
    missingName: false,
    missingKey: false,
  });

  const handleInputNameChange = useCallback(
    (event: OdsInputValueChangeEvent) => {
      setName(`${event.detail.value}`);
      setFormErrors((errors) => ({
        ...errors,
        missingName: !event.detail.value,
      }));
    },
    [setName],
  );
  const handleInputPublicKeyChange = useCallback(
    (event: OsdsTextareaCustomEvent<OdsTextAreaValueChangeEvent>) => {
      setPublicKey(`${event.detail.value}`);
      setFormErrors((errors) => ({
        ...errors,
        missingKey: !event.detail.value,
      }));
    },
    [setPublicKey],
  );

  return (
    <OsdsModal
      headline={t('pci_projects_project_sshKeys_add_title')}
      data-testid="addSshModal-modal"
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {!isPending && (
          <>
            <OsdsFormField
              className="mb-8"
              color={
                formErrors.missingName
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.primary
              }
              error={
                formErrors.missingName ? t('common_field_error_required') : ''
              }
            >
              <OsdsText
                slot="label"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('pci_projects_project_sshKeys_add_name')}
              </OsdsText>
              <OsdsInput
                type={ODS_INPUT_TYPE.text}
                color={
                  formErrors.missingName
                    ? ODS_THEME_COLOR_INTENT.error
                    : ODS_THEME_COLOR_INTENT.primary
                }
                {...{ error: formErrors.missingName ? true : undefined }}
                required
                onOdsValueChange={handleInputNameChange}
                onOdsInputFocus={() => {
                  setFormErrors((errors) => ({
                    ...errors,
                    missingName: false,
                  }));
                }}
                onOdsInputBlur={() =>
                  setFormErrors((errors) => ({
                    ...errors,
                    missingName: !name,
                  }))
                }
                ariaLabel={t('pci_projects_project_sshKeys_add_name')}
                data-testid="sshKeyName"
              />
            </OsdsFormField>
            <OsdsFormField
              color={
                formErrors.missingKey
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.primary
              }
              error={
                formErrors.missingKey
                  ? `${t('common_field_error_required')} ${t(
                      'pci_projects_project_sshKeys_add_infos',
                    )}`
                  : ''
              }
            >
              <OsdsText
                slot="label"
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('pci_projects_project_sshKeys_add_key')}
              </OsdsText>
              <OsdsTextarea
                {...{ error: formErrors.missingKey ? true : undefined }}
                required
                onOdsValueChange={handleInputPublicKeyChange}
                onOdsBlur={() =>
                  setFormErrors((errors) => ({
                    ...errors,
                    missingKey: !publicKey,
                  }))
                }
                onOdsFocus={() => {
                  setFormErrors((errors) => ({
                    ...errors,
                    missingKey: false,
                  }));
                }}
                ariaLabel={t('pci_projects_project_sshKeys_add_key')}
                data-testid="sshPublicKey"
                rows={5}
                placeholder={t(
                  'pci_projects_project_sshKeys_add_key_description',
                )}
              />
              <OsdsText slot="helper" color={ODS_THEME_COLOR_INTENT.text}>
                {t('pci_projects_project_sshKeys_add_infos')}
              </OsdsText>
            </OsdsFormField>
          </>
        )}
        {isPending && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('pci_projects_project_sshKeys_add_cancel_label')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          // @TODO remove this condition when ODS disabled button issue is fixed
          if (publicKey) {
            add({ name, publicKey });
          }
        }}
        data-testid="submitButton"
        {...(isPending || !name || !publicKey ? { disabled: true } : {})}
      >
        {t('pci_projects_project_sshKeys_add_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
