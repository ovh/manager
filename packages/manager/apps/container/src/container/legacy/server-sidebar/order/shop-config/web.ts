import {
  DomainDNSIcon,
  OVHFontDomain,
  OVHFontHosting,
  OVHFontMail,
  OVHFontDB,
  PartnerPlatformSHIcon,
} from '@ovh-ux/manager-themes';
import { ShopItem } from '../OrderPopupContent';
import { getOrderURL, ORDER_URLS } from './order.constants';

const webShopConfig = (
  navigation: any,
  region: string,
  sub: string,
  features: Record<string, string>,
): Array<ShopItem> => [
  features['web:domains'] && ORDER_URLS[region].orderDomain
    ? {
        label: 'item_domains',
        icon: OVHFontDomain,
        url: getOrderURL('orderDomain', region, sub),
        external: true,
        tracking: 'web::orders::domain-name::order',
      }
    : null,
  features['web:domains:zone']
    ? {
        label: 'order_item_zone',
        icon: DomainDNSIcon,
        url: navigation.getURL('web', '#/zone/new'),
        tracking: 'web::orders::dns-zone::order',
      }
    : null,
  features.hosting && ORDER_URLS[region].orderHosting
    ? {
        label: 'item_hostings',
        icon: OVHFontHosting,
        url: getOrderURL('orderHosting', region, sub),
        external: true,
        tracking: 'web::orders::web-hosting::order',
      }
    : null,
  features['cloud-web'] && ORDER_URLS[region].orderCloudWeb
    ? {
        label: 'order_item_cloudWeb',
        icon: OVHFontHosting,
        url: getOrderURL('orderCloudWeb', region, sub),
        external: true,
        tracking: 'web::orders::cloud-web::order',
      }
    : null,
  features['email-pro'] && ORDER_URLS[region].orderEmailPro
    ? {
        label: 'order_item_emailPro',
        icon: OVHFontMail,
        url: getOrderURL('orderEmailPro', region, sub),
        external: true,
        tracking: 'web::orders::email-pro::order',
      }
    : null,
  features['emails:mxplan:order']
    ? {
        label: 'order_item_mxplan',
        icon: OVHFontMail,
        url: navigation.getURL('web', '#/configuration/mx_plan'),
        tracking: 'web::orders::mx-plan::order',
      }
    : null,
  features['exchange:web-dashboard']
    ? {
        label: 'order_item_exchange',
        icon: 'ms-Icon ms-Icon--ExchangeLogo',
        url: navigation.getURL('web', '#/exchange/order'),
        tracking: 'web::orders::email-microsoft-exchange::order',
      }
    : null,
  features.office && ORDER_URLS[region].orderOffice
    ? {
        label: 'order_item_office',
        icon: 'ms-Icon ms-Icon--OfficeLogo',
        url: getOrderURL('orderOffice', region, sub),
        tracking: 'web::orders::licences-office::order',
        external: true,
      }
    : null,
  features['office-reseller'] && ORDER_URLS[region].orderCsp2
    ? {
        label: 'order_item_csp2',
        icon: 'ms-Icon ms-Icon--OfficeLogo',
        url: getOrderURL('orderCsp2', region, sub),
        external: true,
        tracking: 'web::orders::licences-office-reseller::order',
      }
    : null,
  features['cloud-database']
    ? {
        label: 'order_item_cloudDatabase',
        icon: OVHFontDB,
        url: navigation.getURL('web', '#/order-cloud-db'),
        tracking: 'web::orders::cloud-db::order',
      }
    : null,
  features['web-paas']
    ? {
        label: 'order_item_web_paas',
        icon: PartnerPlatformSHIcon,
        url: navigation.getURL('web', '#/paas/webpaas/new'),
        tracking: 'web::orders::web-paas::order',
      }
    : null,
];

export default webShopConfig;
