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
import { useEffect, useRef } from 'react';
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
  const { t } = useTranslation('failover-ips-edit');

  const selectRef = useRef(null);

  /**
   * Workaround to solve ods select width on mobile
   * TODO: solve on ods side
   */
  useEffect(() => {
    if (
      selectRef.current &&
      !selectRef.current.shadowRoot.querySelector('style')
    ) {
      const style = document.createElement('style');
      style.innerHTML =
        '.ocdk-surface--is-open-below.ocdk-surface--open {max-width: 100%;}';
      selectRef.current.shadowRoot.appendChild(style);
    }
  }, [selectRef.current]);

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
            data-testid="editInstanceModal-spinner"
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
              ref={selectRef}
              className="mt-5"
              value={selectedInstanceId}
              onOdsValueChange={onSelectChange}
              data-testid="editInstanceModal-select_instances"
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
        data-testid="editInstanceModal-button_cancel"
      >
        {t('pci_additional_ips_failoverips_edit_cancel_label')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        {...(isPending || !selectedInstanceId ? { disabled: true } : {})}
        data-testid="editInstanceModal-button_submit"
      >
        {t('pci_additional_ips_failoverips_edit_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
