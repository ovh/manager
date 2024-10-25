import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  OsdsFormField,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_SIZE,
  ODS_INPUT_TYPE,
  ODS_CHECKBOX_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { DEFAULT_CIDR } from '@/pages/new/new.constants';
import GatewayConfig from './gateway/GatewayConfig.component';

const SubnetConfig: React.FC = () => {
  const { t } = useTranslation(['common', 'new']);
  const {
    setValue,
    watch,
    formState: {
      touchedFields: { subnet: touched },
      errors: { subnet: error },
    },
  } = useFormContext<NewPrivateNetworkForm>();
  const defaultVlanId = watch('defaultVlanId');
  const vlanId = watch('vlanId');
  const dhcp = watch('subnet.enableDhcp');
  const cidr = watch('subnet.cidr');

  const cidrHasError = useMemo(() => touched?.cidr && !!error?.cidr, [
    touched?.cidr,
    error?.cidr,
  ]);

  useEffect(() => {
    const id = vlanId || defaultVlanId;
    const defaultCIDR = DEFAULT_CIDR.replace('{vlanId}', `${id % 255}`);
    setValue('subnet.cidr', defaultCIDR, {
      shouldValidate: true,
      shouldTouch: true,
    });
  }, [defaultVlanId, vlanId]);

  return (
    <div className="flex flex-col gap-6 my-8">
      <Subtitle>
        {t('new:pci_projects_project_network_private_create_subnet')}
      </Subtitle>
      <OsdsText
        level={ODS_TEXT_LEVEL.subheading}
        color={ODS_TEXT_COLOR_INTENT.primary}
        hue={ODS_TEXT_COLOR_HUE._800}
      >
        {t(
          'new:pci_projects_project_network_private_create_dhcp_address_distribution_options',
        )}
      </OsdsText>
      <OsdsFormField>
        <OsdsText color={ODS_TEXT_COLOR_INTENT.text} slot="label">
          {t(
            'new:pci_projects_project_network_private_create_configure_address',
          )}
        </OsdsText>

        <OsdsInput
          data-testid="private-network-cidr"
          className="md:w-2/5"
          name="cidr"
          type={ODS_INPUT_TYPE.text}
          color={
            cidrHasError
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.primary
          }
          value={cidr}
          onOdsValueChange={({ target }) =>
            setValue('subnet.cidr', target.value as string, {
              shouldValidate: true,
              shouldTouch: true,
            })
          }
          error={cidrHasError}
        />
        {cidrHasError && (
          <OsdsText color={ODS_THEME_COLOR_INTENT.error} slot="helper">
            {t('new:pci_projects_network_cidr')}
          </OsdsText>
        )}
      </OsdsFormField>
      <OsdsCheckbox
        checked={dhcp}
        onOdsCheckedChange={(event: CustomEvent) =>
          setValue('subnet.enableDhcp', event.detail.checked)
        }
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
              {t('new:pci_projects_project_network_private_create_enable_dhcp')}
            </OsdsText>
          </span>
        </OsdsCheckboxButton>
      </OsdsCheckbox>
      <GatewayConfig />
    </div>
  );
};

export default SubnetConfig;
