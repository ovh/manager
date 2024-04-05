import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Instance } from '@/interface';

type EditInstanceModalProps = {
  selectedIp: string;
  instances: Instance[];
  selectedInstanceId: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSelectChange: (event) => void;
};

export default function EditInstanceModal({
  selectedIp,
  instances,
  selectedInstanceId,
  isPending,
  onSelectChange,
  onClose,
  onConfirm,
}: Readonly<EditInstanceModalProps>) {
  const { t } = useTranslation('edit');

  return (
    <OsdsModal
      headline={t('pci_additional_ips_failoverips_edit')}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
          />
        ) : (
          <div className="mt-5">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('pci_additional_ips_failoverips_edit_description', {
                serviceName: selectedIp,
              })}
            </OsdsText>
            <OsdsSelect
              className="mt-5"
              value={selectedInstanceId}
              onOdsValueChange={onSelectChange}
            >
              <span slot="placeholder">
                {t('pci_additional_ips_failoverips_edit_select_instance')}
              </span>

              {instances.map(({ id, name }) => (
                <OsdsSelectOption key={id} value={id}>
                  {name}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('pci_additional_ips_failoverips_edit_cancel_label')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        {...(isPending || !selectedInstanceId ? { disabled: true } : {})}
        data-testid="submitButton"
      >
        {t('pci_additional_ips_failoverips_edit_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
