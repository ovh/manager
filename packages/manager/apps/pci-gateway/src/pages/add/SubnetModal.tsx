import {
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { AVAILABLE_SUBNET } from '@/pages/add/NetworkStep';
import { useNewGatewayStore } from '@/pages/add/useStore';

export const SubnetModal = ({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element => {
  const store = useNewGatewayStore();
  const { t: tAdd } = useTranslation('add');
  const [state] = useState<{ hasError: boolean }>({
    hasError: false,
  });

  return (
    <PciModal
      onClose={onClose}
      title={tAdd('pci_projects_project_public_gateways_add_modal_title')}
      onCancel={onClose}
      onConfirm={() => {
        onClose();
        store.updateForm.network('new', store.form.network.subnetId);
      }}
      isDisabled={!store.form.newNetwork.name || !store.form.newNetwork.subnet}
      submitText={tAdd(
        'pci_projects_project_public_gateways_add_modal_submit_label',
      )}
      cancelText={tAdd(
        'pci_projects_project_public_gateways_add_modal_cancel_label',
      )}
    >
      <>
        <p>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tAdd('pci_projects_project_public_gateways_add_modal_description')}
          </OsdsText>
        </p>

        <OsdsFormField>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
            slot="label"
          >
            {tAdd(
              'pci_projects_project_public_gateways_add_modal_add_private_network_field_label',
            )}
          </OsdsText>
          <OsdsInput
            value={store.form.newNetwork.name}
            placeholder={tAdd(
              'pci_projects_project_public_gateways_add_modal_add_private_network_field_placeholder',
            )}
            inline
            onOdsValueChange={(event) => {
              store.updateForm.newNetwork(
                event.detail.value,
                store.form.newNetwork.subnet,
              );
            }}
            type={ODS_INPUT_TYPE.text}
            color={
              !state.hasError
                ? ODS_THEME_COLOR_INTENT.primary
                : ODS_THEME_COLOR_INTENT.error
            }
            error={state.hasError}
            className="border"
            style={
              state.hasError
                ? {
                    borderColor: 'var(--ods-color-error-200)',
                  }
                : {}
            }
          />
        </OsdsFormField>
        <OsdsFormField>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
            slot="label"
          >
            {tAdd(
              'pci_projects_project_public_gateways_add_modal_add_private_network_select_label',
            )}
          </OsdsText>
          <OsdsSelect
            value={store.form.newNetwork.subnet}
            inline
            onOdsValueChange={(event) => {
              store.updateForm.newNetwork(
                store.form.newNetwork.name,
                event.detail.value as string,
              );
            }}
          >
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              slot="placeholder"
            >
              {tAdd(
                'pci_projects_project_public_gateways_add_modal_add_private_network_select_label',
              )}
            </OsdsText>
            {AVAILABLE_SUBNET.map((subnet) => (
              <OsdsSelectOption key={subnet} value={subnet}>
                {subnet}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
      </>
    </PciModal>
  );
};
