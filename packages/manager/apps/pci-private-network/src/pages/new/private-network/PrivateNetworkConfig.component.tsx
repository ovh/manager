import { useEffect, useMemo, useState } from 'react';
import {
  OsdsFormField,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsInput,
  OsdsText,
  OsdsQuantity,
  OsdsButton,
  OsdsIcon,
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
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { VLAN_ID } from '@/pages/new/new.constants';
import useGuideLink from '@/hooks/useGuideLink/useGuideLink';
import useDefaultVlanID from '@/hooks/useDefaultVlanID/useDefaultVlanID';

const PrivateNetworkConfig: React.FC = () => {
  const { t } = useTranslation(['new', 'common']);
  const guides = useGuideLink();
  const {
    setValue,
    unregister,
    setError,
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

  useEffect(() => {
    setValue('defaultVlanId', defaultVlanId);
  }, [defaultVlanId]);

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
            onOdsCheckedChange={(event: CustomEvent) => {
              const value = event.detail.checked;

              if (!value) {
                unregister('vlanId'); // customer does'nt want to define it then reset to default
              } else {
                setValue('vlanId', defaultVlanId);
              }

              setDefineVlanId(value);
            }}
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

          {defineVlanId && (
            <OsdsFormField className="ml-4">
              <OsdsText
                color={ODS_TEXT_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.body}
                size={ODS_TEXT_SIZE._400}
                slot="label"
              >
                {t(
                  'pci_projects_project_network_private_create_configure_vlan',
                )}
              </OsdsText>
              <OsdsQuantity>
                <OsdsButton
                  slot="minus"
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_BUTTON_SIZE.sm}
                  text-align="center"
                >
                  <OsdsIcon
                    name={ODS_ICON_NAME.MINUS}
                    size={ODS_ICON_SIZE.sm}
                    className="mr-2 bg-white"
                  />
                </OsdsButton>
                <OsdsInput
                  data-testid="vlanId"
                  name="vlanId"
                  type={ODS_INPUT_TYPE.number}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  value={vlanId ?? defaultVlanId}
                  onOdsValueChange={({ target }) =>
                    setValue('vlanId', target.value as number, {
                      shouldValidate: true,
                    })
                  }
                  min={VLAN_ID.min}
                  max={VLAN_ID.max}
                />
                <OsdsButton
                  slot="plus"
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_BUTTON_SIZE.sm}
                  text-align="center"
                >
                  <OsdsIcon
                    name={ODS_ICON_NAME.PLUS}
                    size={ODS_ICON_SIZE.xs}
                    className="mr-2 bg-white"
                  />
                </OsdsButton>
              </OsdsQuantity>
              <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="helper">
                {t(
                  'pci_projects_project_network_private_create_configure_vlan_limits',
                )}
              </OsdsText>
            </OsdsFormField>
          )}

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
        </div>
      )}
    </div>
  );
};

export default PrivateNetworkConfig;
