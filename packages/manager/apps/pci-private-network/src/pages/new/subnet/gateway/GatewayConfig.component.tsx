import { useFormContext } from 'react-hook-form';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_SIZE,
  ODS_CHECKBOX_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import GatewayCreation from './creation/GatewayCreation.component';

const GatewayConfig: React.FC = () => {
  const { t } = useTranslation(['new', 'common']);
  const { setValue, watch } = useFormContext<NewPrivateNetworkForm>();
  const gatewayIp = watch('subnet.enableGatewayIp');
  const onLocalZone = watch('isLocalZone');

  return (
    <>
      <OsdsText
        level={ODS_TEXT_LEVEL.subheading}
        color={ODS_TEXT_COLOR_INTENT.primary}
        hue={ODS_TEXT_COLOR_HUE._800}
      >
        {t('pci_projects_project_network_private_gateway_options')}
      </OsdsText>
      <OsdsCheckbox
        checked={gatewayIp}
        onOdsCheckedChange={(event: CustomEvent) =>
          setValue('subnet.enableGatewayIp', event.detail.checked)
        }
      >
        <OsdsCheckboxButton
          size={ODS_CHECKBOX_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          <OsdsText
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            slot="end"
          >
            {t(
              'pci_projects_project_network_private_create_announce_first_address',
            )}
          </OsdsText>
        </OsdsCheckboxButton>
      </OsdsCheckbox>
      {!onLocalZone && <GatewayCreation />}
    </>
  );
};

export default GatewayConfig;
