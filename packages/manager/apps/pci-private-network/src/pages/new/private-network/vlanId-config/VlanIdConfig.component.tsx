import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_SIZE,
  ODS_INPUT_TYPE,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsText,
  OsdsQuantity,
  OsdsButton,
  OsdsIcon,
  OsdsInput,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { VLAN_ID } from '@/pages/new/new.constants';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { getDefaultCIDR } from '@/utils/utils';
import useDefaultVlanID from '@/hooks/useDefaultVlanID/useDefaultVlanID';

const VlanIdConfig: React.FC = () => {
  const { t } = useTranslation('new');
  const { setValue, watch } = useFormContext<NewPrivateNetworkForm>();
  const vlanId = watch('vlanId');
  const { defaultVlanId } = useDefaultVlanID();

  const onChangeVlanId = ({ target }) => {
    const id = target.value as number;
    const cidr = getDefaultCIDR(id);
    setValue('vlanId', id, {
      shouldValidate: true,
    });
    setValue('subnet.cidr', cidr);
  };

  return (
    <OsdsFormField className="ml-4">
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        slot="label"
      >
        {t('pci_projects_project_network_private_create_configure_vlan')}
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
          onOdsValueChange={onChangeVlanId}
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
        {t('pci_projects_project_network_private_create_configure_vlan_limits')}
      </OsdsText>
    </OsdsFormField>
  );
};

export default VlanIdConfig;
