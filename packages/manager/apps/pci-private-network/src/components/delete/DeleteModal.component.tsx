import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type TDeleteModal = {
  networkId: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({
  networkId,
  isPending,
  onClose,
  onConfirm,
}: Readonly<TDeleteModal>) {
  const { t } = useTranslation('listing');
  return (
    <OsdsModal
      headline={t('pci_projects_project_network_private_delete_label')}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        <div className="mt-5">
          {isPending ? (
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.md}
              className="block text-center"
            />
          ) : (
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
            >
              {t('pci_projects_project_network_private_delete_confirmation', {
                name: networkId,
              })}
            </OsdsText>
          )}
        </div>
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
      >
        {t('pci_projects_project_network_private_delete_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        disabled={isPending || undefined}
      >
        {t('pci_projects_project_network_private_delete_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
