import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Icon,
  ICON_NAME,
  Tab,
  TabContent,
  TabList,
  Tabs,
  TabsValueChangeEvent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ServiceDetailTabsProps,
  legacyTabs,
} from '@/domain/constants/serviceDetail';
import { TDomainResource } from '@/domain/types/domainResource';
import DnsConfigurationTab from '@/domain/pages/domainTabs/dns/dnsConfiguration';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { isServiceInCreation } from '@/domain/utils/helpers';
import { useGetServiceInformation } from '@/common/hooks/data/query';

interface ServiceDetailsTabsProps {
  readonly domainResource: TDomainResource;
}

export default function ServiceDetailsTabs({
  domainResource,
}: ServiceDetailsTabsProps) {
  const { t } = useTranslation(['domain']);
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const { serviceName } = useParams<{ serviceName: string }>();
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { serviceInfo } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  const handleValueChange = async (event: TabsValueChangeEvent) => {
    if (legacyTabs.includes(event.value)) {
      const fetchedUrl = (await shell.navigation?.getURL(
        'web',
        `/domain/${serviceName}/${event.value}`,
        {},
      )) as string;
      window.location.href = fetchedUrl;
    } else {
      navigate(`${event.value}`, { replace: true });
      setValue(event.value);
    }
  };

  useEffect(() => {
    const tab =
      ServiceDetailTabsProps.find((tabName) =>
        location.pathname.endsWith(tabName.value),
      )?.value || 'information';
    if (location.pathname) {
      setValue(tab);
    }

    // Clear notifications on location change
    clearNotifications();
  }, [location.pathname]);

  return (
    <Tabs defaultValue={value} onValueChange={handleValueChange} value={value}>
      <TabList>
        {ServiceDetailTabsProps.map((tab) => {
          const disabled = tab.rule
            ? tab.rule(domainResource, isServiceInCreation(serviceInfo))
            : false;
          return (
            <Tab
              key={tab.id}
              value={tab.value}
              data-testid={tab.id}
              disabled={disabled}
              className="flex items-center gap-x-4"
            >
              {t(tab.name)}
              {disabled && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name={ICON_NAME.circleInfo} />
                  </TooltipTrigger>
                  <TooltipContent>
                    {t(
                      isServiceInCreation(serviceInfo)
                        ? 'domain_tab_name_service_in_creation'
                        : 'domain_tab_name_not_supported',
                    )}
                  </TooltipContent>
                </Tooltip>
              )}
            </Tab>
          );
        })}
      </TabList>
      <TabContent value="dns">
        <DnsConfigurationTab domainResource={domainResource} />
      </TabContent>
    </Tabs>
  );
}
