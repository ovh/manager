import { ShopItem } from '../OrderPopupContent';
import { getOrderURL, ORDER_URLS } from './order.constants';
import { OdsIconWrapper } from '@ovh-ux/ovh-product-icons/index';
import {
  HOSTING_SVG,
  EXCHANGE_SVG,
  OFFICE365_SVG,
} from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

const webShopConfig = (
  navigation: any,
  region: string,
  sub: string,
  features: Record<string, boolean>,
): Array<ShopItem> => [
  features['web:domains'] && ORDER_URLS[region].orderDomain
    ? {
        label: 'item_domains',
        icon: OdsIconWrapper({ name: ODS_ICON_NAME.WORLD_CONCEPT }),
        url: getOrderURL('orderDomain', region, sub),
        external: true,
        tracking: 'web::orders::domain-name::order',
      }
    : null,
  features['web:domains:zone']
    ? {
        label: 'order_item_zone',
        icon: OdsIconWrapper({ name: ODS_ICON_NAME.DNS_ANYCAST_CONCEPT }),
        url: navigation.getURL('web', '#/zone/new'),
        tracking: 'web::orders::dns-zone::order',
      }
    : null,
  features.hosting && ORDER_URLS[region].orderHosting
    ? {
        label: 'item_hostings',
        icon: HOSTING_SVG,
        url: getOrderURL('orderHosting', region, sub),
        external: true,
        tracking: 'web::orders::web-hosting::order',
      }
    : null,
  features['cloud-web'] && ORDER_URLS[region].orderCloudWeb
    ? {
        label: 'order_item_cloudWeb',
        icon: HOSTING_SVG,
        url: getOrderURL('orderCloudWeb', region, sub),
        external: true,
        tracking: 'web::orders::cloud-web::order',
      }
    : null,
  features['email-pro'] && ORDER_URLS[region].orderEmailPro
    ? {
        label: 'order_item_emailPro',
        icon: OdsIconWrapper({ name: ODS_ICON_NAME.ENVELOP_CONCEPT }),
        url: getOrderURL('orderEmailPro', region, sub),
        external: true,
        tracking: 'web::orders::email-pro::order',
      }
    : null,
  features['emails:mxplan:order']
    ? {
        label: 'order_item_mxplan',
        icon: OdsIconWrapper({ name: ODS_ICON_NAME.ENVELOP_CONCEPT }),
        url: navigation.getURL('web', '#/configuration/mx_plan'),
        tracking: 'web::orders::mx-plan::order',
      }
    : null,
  features['exchange:web-dashboard']
    ? {
        label: 'order_item_exchange',
        icon: EXCHANGE_SVG,
        url: navigation.getURL('web', '#/exchange/order'),
        tracking: 'web::orders::email-microsoft-exchange::order',
      }
    : null,
  features.office && ORDER_URLS[region].orderOffice
    ? {
        label: 'order_item_office',
        icon: OFFICE365_SVG,
        url: getOrderURL('orderOffice', region, sub),
        tracking: 'web::orders::licences-office::order',
        external: true,
      }
    : null,
  features['office-reseller'] && ORDER_URLS[region].orderCsp2
    ? {
        label: 'order_item_csp2',
        icon: OFFICE365_SVG,
        url: getOrderURL('orderCsp2', region, sub),
        external: true,
        tracking: 'web::orders::licences-office-reseller::order',
      }
    : null,
  features['cloud-database']
    ? {
        label: 'order_item_cloudDatabase',
        icon: OdsIconWrapper({ name: ODS_ICON_NAME.DATABASE_CONCEPT }),
        url: navigation.getURL('web', '#/order-cloud-db'),
        tracking: 'web::orders::cloud-db::order',
      }
    : null,
];
export default webShopConfig;
