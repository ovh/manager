import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useShell } from '@/context';
import { sanitizeMenu, SidebarMenuItem } from '../sidebarMenu';
import Sidebar from '../Sidebar';
import useServiceLoader from './useServiceLoader';
import OrderTrigger from '../order/OrderTrigger';
import webShopConfig from '../order/shop-config/web';
import { ShopItem } from '../order/OrderPopupContent';
import getIcon from './GetIcon';

export const webFeatures = [
  'web:domains',
  'web:domains:all-dom',
  'web:domains:zone',
  'web-ongoing-operations',
  'web-hosting:websites',
  'hosting',
  'private-database',
  'email-pro',
  'emails:domain',
  'emails:mxplan',
  'emails:mxplan:order',
  'emails:delegate',
  'emails',
  'exchange:web-dashboard',
  'office-reseller',
  'web:microsoft',
  'cloud-web',
  'cloud-database',
  'web-office',
  'zimbra',
];

export default function WebSidebar() {
  const [menu, setMenu] = useState<SidebarMenuItem>(undefined);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const shell = useShell();
  const { loadServices } = useServiceLoader('web');
  const { t, i18n } = useTranslation('sidebar');
  const navigation = shell.getPlugin('navigation');
  const environment = shell.getPlugin('environment').getEnvironment();
  const { ovhSubsidiary, isTrusted } = environment.getUser();
  const region = environment.getRegion();

  const getWebMenu = (features: Record<string, boolean>) => {
    const menu = [];

    if (features['web:domains']) {
      menu.push({
        id: 'domains',
        state: 'app.domain.all',
        label: t('sidebar_domain'),
        icon: getIcon('ovh-font ovh-font-domain'),
        routeMatcher: new RegExp(
          `^(/configuration)?/(domain|all_dom|zone|dns|upload|tracking)`,
        ),
        async loader() {
          const allDom = features['web:domains:all-dom']
            ? await loadServices('/allDom')
            : [];
          const domains = await loadServices('/domain');
          const domainZones = features['web:domains:zone']
            ? await loadServices('/domain/zone')
            : [];

          return [
            {
              id: 'domain_list',
              label: t('sidebar_domain_list'),
              href: navigation.getURL('web', '#/domain'),
              icon: getIcon('oui-icon oui-icon-list'),
              ignoreSearch: true,
            },
            features['web-ongoing-operations'] && {
              id: 'domain_operations',
              label: t('sidebar_domain_operations'),
              href: navigation.getURL('web-ongoing-operations', '#/'),
              routeMatcher: new RegExp('/'),
              icon: getIcon('ovh-font ovh-font-config'),
              ignoreSearch: true,
            },
            ...allDom.map((item) => ({
              ...item,
              href: undefined,
              routeMatcher: new RegExp(`/all_dom/${item.serviceName}`),
              async loader() {
                return loadServices(`/allDom/${item.serviceName}/domain`);
              },
            })),
            ...domains
              .filter(
                (domain) =>
                  !domain.parentName ||
                  !allDom.find(
                    (item) => domain.parentName === item.serviceName,
                  ),
              )
              .map((domain: SidebarMenuItem) => ({
                ...domain,
                icon: getIcon('ovh-font ovh-font-domain'),
              })),
            ...domainZones
              .filter(
                (zone) =>
                  !domains.find((d) => d.serviceName === zone.serviceName),
              )
              .map((zone) => ({
                ...zone,
                icon: getIcon('oui-icon oui-icon-domain-dns'),
              })),
          ];
        },
      });
    }

    if (features['web-hosting:websites']) {
      menu.push({
        id: 'web-hosting-websites',
        label: t('sidebar_web_hosting_websites'),
        icon: getIcon('ovh-font ovh-font-domain'),
        routeMatcher: new RegExp('^/web-hosting/(websites|onboarding)'),
        href: navigation.getURL(
          'web-hosting',
          '#/',
        ),
      });
    }

    if (features.hosting) {
      menu.push({
        id: 'hostings',
        label: t('sidebar_hosting'),
        icon: getIcon('ovh-font ovh-font-hosting'),
        routeMatcher: new RegExp(`^(/configuration)?/hosting`),
        async loader() {
          const hostings = await loadServices('/hosting/web');

          return [
            {
              id: 'hostings-search',
              label: 'Rechercher',
              searchField: '',
            },
            ...hostings.map((service) => ({
              ...service,
              icon: getIcon('ovh-font ovh-font-server'),
            })),
          ];
        },
      });
    }

    if (features['private-database']) {
      menu.push({
        id: 'privateDatabases',
        label: t('sidebar_web_db'),
        icon: getIcon('ovh-font ovh-font-database'),
        routeMatcher: new RegExp(
          `^(/configuration)?/(private_database|order-cloud-db)`,
        ),
        async loader() {
          const databases = await loadServices('/hosting/privateDatabase');

          return [
            {
              id: 'databases-search',
              label: t('sidebar_search'),
              searchField: '',
            },
            ...databases.map((database) => ({
              ...database,
              icon: getIcon('ovh-font ovh-font-database'),
            })),
          ];
        },
      });
    }

    if (features.zimbra) {
      menu.push({
        id: 'zimbra',
        label: t('sidebar_zimbra'),
        icon: getIcon('ovh-font ovh-font-mail'),
        routeMatcher: new RegExp('^/zimbra'),
        href: navigation.getURL('zimbra', '#/'),
      });
    }

    if (features['email-pro']) {
      menu.push({
        id: 'emailPros',
        label: t('sidebar_email_pro'),
        icon: getIcon('ovh-font ovh-font-mail'),
        routeMatcher: new RegExp(`^(/configuration)?/email_pro`),
        async loader() {
          const services = await loadServices('/email/pro');
          return services.map((service) => ({
            ...service,
            icon: getIcon('ovh-font ovh-font-mail'),
          }));
        },
      });
    }

    if (features.emails) {
      menu.push({
        id: 'emails',
        label: t('sidebar_emails'),
        icon: getIcon('ovh-font ovh-font-mail'),
        routeMatcher: new RegExp(
          `^(/configuration)?/(email_domain|email_mxplan|email_delegate|mx_plan)`,
        ),
        async loader() {
          const emailDomains = features['emails:domain']
            ? await loadServices('/email/domain')
            : [];
          const emailMxPlan = features['emails:mxplan']
            ? await loadServices('/email/mxplan')
            : [];
          const delegatedAccount = features['emails:delegate']
            ? await loadServices('/email/domain/delegatedAccount')
            : [];

          return [
            {
              id: 'emails-search',
              label: t('sidebar_search'),
              searchField: '',
            },
            ...emailDomains.map((email) => ({
              icon: getIcon('ovh-font ovh-font-mail'),
              routeMatcher: new RegExp(`/email_domain/${email.serviceName}`),
              ...email,
            })),
            ...emailMxPlan.map((email) => ({
              icon: getIcon('ovh-font ovh-font-mail'),
              ...email,
            })),
            ...delegatedAccount.map((email) => ({
              icon: getIcon('oui-icon oui-icon-arrow-transfer'),
              ...email,
              routeMatcher: new RegExp(`/email_delegate/${email.serviceName}`),
              label: email.label,
              href: navigation.getURL(
                'web',
                `#/email_delegate/${email.serviceName}`,
              ),
            })),
          ];
        },
      });
    }

    if (features['web:microsoft']) {
      menu.push({
        id: 'microsoft',
        label: t('sidebar_microsoft'),
        icon: getIcon('ms-Icon ms-Icon--WindowsLogo'),
        routeMatcher: new RegExp(
          `^(/configuration)?/(exchange|web-office)`,
        ),
        subItems: [
          {
            id: 'exchange-search',
            label: t('sidebar_search'),
            searchField: '',
          },
          features['exchange:web-dashboard'] && {
            id: 'exchange',
            label: t('sidebar_exchange'),
            icon: getIcon('ms-Icon ms-Icon--ExchangeLogo'),
            routeMatcher: new RegExp(`/exchange`),
            async loader() {
              const services = await loadServices('/email/exchange');
              return services.map((service) => ({
                icon: getIcon('ms-Icon ms-Icon--ExchangeLogo'),
                ...service,
              }));
            },
          },
          features['web-office'] && {
            id: 'web-office',
            label: t('sidebar_license_office'),
            icon: getIcon('ms-Icon ms-Icon--OfficeLogo'),
            routeMatcher: new RegExp('^/web-office'),
            async loader() {
              const services = await loadServices('/license/office');
              return [
                {
                  id: 'web_office_list',
                  label: t('sidebar_license_office_list'),
                  href: navigation.getURL('web-office', `#/`),
                  icon: getIcon('oui-icon oui-icon-list'),
                  ignoreSearch: true,
                },
                ...services.map((service) => ({
                  ...service,
                  icon: getIcon('ms-Icon ms-Icon--OfficeLogo'),
                  href: navigation.getURL(
                    'web-office',
                    `#/license/${service.serviceName}`,
                  ),
                })),
              ];
            },
          },
        ],
      });
    } else if (features['exchange:web-dashboard']) {
      menu.push({
        id: 'exchange',
        label: t('sidebar_microsoft_exchange'),
        icon: getIcon('ms-Icon ms-Icon--ExchangeLogo'),
        routeMatcher: new RegExp('/exchange'),
        async loader() {
          const services = await loadServices('/email/exchange');
          return services.map((service) => ({
            ...service,
            icon: getIcon('ms-Icon ms-Icon--ExchangeLogo'),
            routeMatcher: new RegExp(`/exchange/${service.serviceName}`),
          }));
        },
      });
    }

    return menu;
  };

  const { data: availability } = useFeatureAvailability(webFeatures);

  useEffect(() => {
    if (availability) {
      setMenu(
        sanitizeMenu({
          id: 'web-sidebar',
          label: '',
          subItems: [...getWebMenu(availability)],
        }),
      );
      setShopItems(
        webShopConfig(navigation, region, ovhSubsidiary, availability),
      );
    }
  }, [availability, i18n.language]);

  return (
    <>
      {!isTrusted && <OrderTrigger items={shopItems} />}
      <Sidebar menu={menu} />
    </>
  );
}
