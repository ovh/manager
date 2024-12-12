import { useMemo, useState } from 'react';
import {
  OsdsFormField,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsInput,
  OsdsText,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import { Links, Subtitle } from '@ovh-ux/manager-react-components';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_SIZE,
  ODS_INPUT_TYPE,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import useGuideLink from '@/hooks/useGuideLink/useGuideLink';
import useDefaultVlanID from '@/hooks/useDefaultVlanID/useDefaultVlanID';
import VlanIdConfig from './vlanId-config/VlanIdConfig.component';

const PrivateNetworkConfig: React.FC = () => {
  const { t } = useTranslation(['new', 'common']);
  const guides = useGuideLink();
  const {
    setValue,
    unregister,
    formState: {
      touchedFields: { name: touched },
      errors: { name: error },
    },
    watch,
  } = useFormContext<NewPrivateNetworkForm>();

  const onLocalZone = watch('isLocalZone');
  const vlanId = watch('vlanId');
  const name = watch('name');

  const { defaultVlanId, notAvailableIds } = useDefaultVlanID();
  const [defineVlanId, setDefineVlanId] = useState<boolean>(false);

  const hasError = useMemo(() => touched && !!error, [touched, error]);

  const onDefineVlanId = (event: CustomEvent) => {
    const value = event.detail.checked;

    if (!value) {
      unregister('vlanId'); // customer doesn't want to define it then reset to default
    } else {
      setValue('vlanId', defaultVlanId);
    }

    setDefineVlanId(value);
  };

  return (
    <div className="flex flex-col gap-6 my-8">
      <Subtitle>
        {t('pci_projects_project_network_private_create_configure')}
      </Subtitle>
      <OsdsFormField
        data-testid="private-network-name-error"
        error={hasError ? t('common:common_field_error_required') : ''}
      >
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
          {t('pci_projects_project_network_private_create_name')}
        </OsdsText>

        <OsdsInput
          className="md:w-2/5"
          name="privateNetworkName"
          data-testid="private-network-name"
          type={ODS_INPUT_TYPE.text}
          color={
            hasError
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.primary
          }
          onOdsInputBlur={() => {
            if (!name) {
              setValue('name', '', {
                shouldValidate: true,
                shouldTouch: true,
              });
            }
          }}
          onOdsValueChange={({ target }) =>
            setValue('name', target.value as string, {
              shouldValidate: true,
              shouldTouch: true,
            })
          }
          error={hasError}
        />
      </OsdsFormField>

      {!onLocalZone && (
        <div className="flex flex-col gap-5">
          <OsdsText
            level={ODS_TEXT_LEVEL.subheading}
            color={ODS_TEXT_COLOR_INTENT.primary}
            hue={ODS_TEXT_COLOR_HUE._800}
          >
            {t('pci_projects_project_network_private_create_layer_2_options')}
          </OsdsText>
          <OsdsCheckbox
            data-testid="define-vlan"
            onOdsCheckedChange={onDefineVlanId}
          >
            <OsdsCheckboxButton
              size={ODS_CHECKBOX_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              <span slot="end">
                <OsdsText
                  color={ODS_TEXT_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._400}
                >
                  {t(
                    'pci_projects_project_network_private_create_configure_choose_vlan',
                  )}
                </OsdsText>
              </span>
            </OsdsCheckboxButton>
          </OsdsCheckbox>

          <OsdsText
            className="block ml-4"
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
          >
            {t('pci_projects_project_network_private_create_vlan_tip')}
            <Links
              label={t('common:common_find_out_more_here')}
              href={guides.VLAN}
              target={OdsHTMLAnchorElementTarget._blank}
            />
          </OsdsText>

          {vlanId === 0 && defineVlanId && (
            <OsdsMessage className="my-4" type={ODS_MESSAGE_TYPE.warning}>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
              >
                {t(
                  'pci_projects_project_network_private_create_vlan_id_warning',
                )}
              </OsdsText>
            </OsdsMessage>
          )}

          {defineVlanId && <VlanIdConfig />}

          {notAvailableIds?.includes(vlanId) && defineVlanId && (
            <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.warning}>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
              >
                {t(
                  'new:pci_projects_project_network_private_create_configure_vlan_taken',
                )}
              </OsdsText>
            </OsdsMessage>
          )}
        </div>
      )}
    </div>
  );
};

export default PrivateNetworkConfig;
