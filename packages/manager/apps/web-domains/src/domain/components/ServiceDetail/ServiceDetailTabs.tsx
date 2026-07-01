import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
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
import { useFeatureAvailability, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ServiceDetailTabsProps,
  legacyTabs,
  DEFAULT_TAB,
} from '@/domain/constants/serviceDetail';
import { TDomainResource } from '@/domain/types/domainResource';
import DnsConfigurationTab from '@/domain/pages/domainTabs/dns/dnsConfiguration';
import { useGetEnvironmentData } from '@/common/hooks/environment/data';
import { urls } from '@/domain/routes/routes.constant';
import { AnycastPreviousPages } from '@/domain/enum/navigation.enum';

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
  // The Anycast order tunnel renders in the router Outlet; when on it we keep
  // the originating tab highlighted but must NOT also render the DNS tab's
  // own content panel (see the `dns` TabContent below).
  const isAnycastOrder = !!matchPath(
    `${urls.domainTabOrderAnycast}/*`,
    location.pathname,
  );
  const { data: availability } = useFeatureAvailability([
    'web-domains:zone',
  ]);

  const { region } = useGetEnvironmentData();

  const visibleTabs = ServiceDetailTabsProps.filter(
    (tab) => tab.id !== 'dynhost' || region === 'EU',
  );

  const handleValueChange = async (event: TabsValueChangeEvent) => {
    if (!availability?.['web-domains:zone']) {
      legacyTabs.push('zone');
    }
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
    let tab =
      visibleTabs.find((tabName) =>
        matchPath(`/domain/:serviceName/${tabName.value}/*`, location.pathname),
      )?.value || DEFAULT_TAB;

    // The Anycast order tunnel has its own URL that matches no tab. Keep the
    // tab it was launched from highlighted: DNS servers vs general information.
    if (matchPath(`${urls.domainTabOrderAnycast}/*`, location.pathname)) {
      tab =
        location.state?.from === AnycastPreviousPages.DNS_SERVERS
          ? 'dns'
          : 'information';
    }

    if (location.pathname) {
      setValue(tab);
    }

    // Clear notifications on location change
    clearNotifications();
  }, [location.pathname]);

  return (
    <Tabs defaultValue={value} onValueChange={handleValueChange} value={value}>
      <TabList>
        {visibleTabs.map((tab) => {
          const disabled = tab.rule ? tab.rule(domainResource) : false;
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
                    {t('domain_tab_name_not_supported')}
                  </TooltipContent>
                </Tooltip>
              )}
            </Tab>
          );
        })}
      </TabList>
      <TabContent value="dns">
        {!isAnycastOrder && (
          <DnsConfigurationTab domainResource={domainResource} />
        )}
      </TabContent>
    </Tabs>
  );
}
