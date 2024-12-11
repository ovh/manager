import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import DNSCustom from './dnsCustom/DNSCustom.component';

enum DNSResolver {
  public = 'Public',
  local = 'local',
  custom = 'custom',
}

const DNSServer: React.FC = () => {
  const { t } = useTranslation('new');
  const { setValue, unregister } = useFormContext<NewPrivateNetworkForm>();
  const [dnsResolver, setDnsResolver] = useState<DNSResolver>(
    DNSResolver.public,
  );

  const onSelectDnsServer = ({ detail }) => {
    const value = detail.newValue;
    setDnsResolver(value);
    setValue('subnet.dnsNameServers', []);

    if (value === DNSResolver.custom) {
      unregister('subnet.useDefaultPublicDNSResolver');
    } else {
      setValue(
        'subnet.useDefaultPublicDNSResolver',
        value === DNSResolver.public,
        {
          shouldValidate: true,
        },
      );
    }
  };

  return (
    <div>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_TEXT_COLOR_INTENT.primary}
        hue={ODS_TEXT_COLOR_HUE._800}
        size={ODS_TEXT_SIZE._200}
      >
        {t('pci_projects_project_network_private_dns_server')}
      </OsdsText>
      <div className="my-4">
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('pci_projects_project_network_private_dns_server_description')}
        </OsdsText>
      </div>
      <OsdsRadioGroup
        value={dnsResolver}
        className="flex flex-col gap-4"
        onOdsValueChange={onSelectDnsServer}
      >
        <OsdsRadio value={DNSResolver.public}>
          <OsdsRadioButton
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_RADIO_BUTTON_SIZE.xs}
          >
            <span slot="end">
              <OsdsText
                className="flex"
                size={ODS_TEXT_SIZE._400}
                color={ODS_TEXT_COLOR_INTENT.text}
              >
                {t('pci_projects_project_network_private_dns_server_public')}
                <OsdsTooltip className="ml-4 flex items-center">
                  <OsdsIcon
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_ICON_SIZE.xxs}
                    name={ODS_ICON_NAME.HELP}
                  />
                  <OsdsTooltipContent slot="tooltip-content">
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_TEXT_SIZE._100}
                    >
                      {t(
                        'pci_projects_project_network_private_dns_server_public_description',
                      )}
                    </OsdsText>
                  </OsdsTooltipContent>
                </OsdsTooltip>
              </OsdsText>
            </span>
          </OsdsRadioButton>
        </OsdsRadio>
        <OsdsRadio value={DNSResolver.local}>
          <OsdsRadioButton
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_RADIO_BUTTON_SIZE.xs}
          >
            <span slot="end">
              <OsdsText
                className="flex"
                size={ODS_TEXT_SIZE._400}
                color={ODS_TEXT_COLOR_INTENT.text}
              >
                {t('pci_projects_project_network_private_dns_server_local')}
                <OsdsTooltip className="ml-4 flex items-center">
                  <OsdsIcon
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_ICON_SIZE.xxs}
                    name={ODS_ICON_NAME.HELP}
                  />
                  <OsdsTooltipContent slot="tooltip-content">
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_TEXT_SIZE._100}
                    >
                      {t(
                        'pci_projects_project_network_private_dns_server_local_description',
                      )}
                    </OsdsText>
                  </OsdsTooltipContent>
                </OsdsTooltip>
              </OsdsText>
            </span>
          </OsdsRadioButton>
        </OsdsRadio>
        <OsdsRadio value={DNSResolver.custom}>
          <OsdsRadioButton
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_RADIO_BUTTON_SIZE.xs}
          >
            <span slot="end">
              <OsdsText
                className="flex"
                size={ODS_TEXT_SIZE._400}
                color={ODS_TEXT_COLOR_INTENT.text}
              >
                {t('pci_projects_project_network_private_dns_server_custom')}
                <OsdsTooltip className="ml-4 flex items-center">
                  <OsdsIcon
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_ICON_SIZE.xxs}
                    name={ODS_ICON_NAME.HELP}
                  />
                  <OsdsTooltipContent slot="tooltip-content">
                    <OsdsText
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_TEXT_SIZE._100}
                    >
                      {t(
                        'pci_projects_project_network_private_dns_server_custom_description',
                      )}
                    </OsdsText>
                  </OsdsTooltipContent>
                </OsdsTooltip>
              </OsdsText>
            </span>
          </OsdsRadioButton>
        </OsdsRadio>
      </OsdsRadioGroup>
      {dnsResolver === DNSResolver.custom && <DNSCustom />}
    </div>
  );
};

export default DNSServer;
