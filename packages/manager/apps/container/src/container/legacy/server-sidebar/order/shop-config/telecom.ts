import { OdsIconWrapper, TELEPHONY_SVG, OFFICE365_SVG, TELECOMETHERNET_SVG, HEADSET_SVG } from '@ovh-ux/ovh-product-icons/index';
import { OdsIconName } from '@ovhcloud/ods-core';
import { ShopItem } from '../OrderPopupContent';
import { getOrderURL } from './order.constants';

const telephony = (
  navigation: any,
  region: string,
  sub: string,
  features: Record<string, string>,
): ShopItem =>
  features.telephony
    ? {
        label: 'item_telephony',
        icon: TELEPHONY_SVG,
        subMenu: [
          {
            label: 'order_item_telephony_voip',
            external: true,
            url: getOrderURL('telephony_voip', region, sub),
            tracking: 'telecom::orders::voip-pricing::order',
          },
          {
            label: 'order_item_telephony_siptrunk',
            external: true,
            url: getOrderURL('telephony_siptrunk', region, sub),
            tracking: 'telecom::orders::sip-trunk::order',
          },
          {
            label: 'order_item_telephony_siptrunk_call',
            external: true,
            url: getOrderURL('telephony_siptrunkCall', region, sub),
            tracking: 'telecom::orders::sip-trunk-included::order',
          },
          {
            label: 'order_item_telephony_accessories',
            url: navigation.getURL('telecom', '#/orders/accessories'),
            tracking: 'telecom::orders::telephony-accessories::order',
          },
        ],
      }
    : null;

const email = (region: string, sub: string): ShopItem => ({
  label: 'order_item_email',
  icon: OdsIconWrapper({ name: OdsIconName.ENVELOP_CONCEPT }),
  subMenu: [
    {
      label: 'order_item_email_exchange',
      external: true,
      url: getOrderURL('email_exchange', region, sub),
      tracking: 'telecom::orders::hosted-exchange::order',
    },
    {
      label: 'order_item_email_sharepoint',
      external: true,
      url: getOrderURL('email_sharepoint', region, sub),
      tracking: 'telecom::orders::microsoft-sharepoint::order',
    },
  ],
});

const office = (region: string, sub: string): ShopItem => ({
  label: 'order_item_office365',
  icon: OFFICE365_SVG,
  subMenu: [
    {
      label: 'order_item_office365_business',
      external: true,
      url: getOrderURL('office365_business', region, sub),
      tracking: 'telecom::orders::office-365-business::order',
    },
    {
      label: 'order_item_office365_sharepoint',
      external: true,
      url: getOrderURL('office365_sharepoint', region, sub),
      tracking: 'telecom::orders::microsoft-sharepoint::order',
    },
  ],
});

const sms = (
  navigation: any,
  region: string,
  sub: string,
  features: Record<string, string>,
): ShopItem =>
  features.sms
    ? {
        label: 'item_sms',
        icon: OdsIconWrapper({ name: OdsIconName.SMS_CONCEPT }),
        subMenu: [
          features['sms:order']
            ? {
                label: 'order_item_sms',
                url: navigation.getURL('telecom', '#/sms/order'),
                tracking: 'telecom::orders::sms::order',
              }
            : null,
          features['sms:hlr']
            ? {
                label: 'order_item_sms_hlr',
                external: true,
                url: getOrderURL('smsHlr', region, sub),
                tracking: 'telecom::orders::sms-hlr::order',
              }
            : null,
        ],
      }
    : null;

const telecomShopConfig = (
  navigation: any,
  region: string,
  sub: string,
  features: Record<string, string>,
): Array<ShopItem> => [
  features.telephony
    ? {
        label: 'order_item_number',
        icon: OdsIconWrapper({ name: OdsIconName.HASHTAG_CONCEPT }),
        url: navigation.getURL('telecom', '#/orders/orders/alias'),
        tracking: 'telecom::orders::number::order',
      }
    : null,
  {
    label: 'order_item_domain',
    icon: OdsIconWrapper({ name: OdsIconName.WORLD_CONCEPT }),
    external: true,
    url: getOrderURL('domain', region, sub),
    tracking: 'telecom::orders::domain-name::order',
  },
  features.pack
    ? {
        label: 'order_item_internet',
        icon: TELECOMETHERNET_SVG,
        subMenu: [
          {
            label: 'order_item_internet_xdsl',
            url: getOrderURL('internet_xdsl', region, sub),
            external: true,
            tracking: 'telecom::orders::xdsl::order',
          },
          {
            label: 'order_item_internet_fiber',
            external: true,
            url: getOrderURL('internet_fiber', region, sub),
            tracking: 'telecom::orders::fibre::order',
          },
          {
            label: 'order_item_internet_sdsl',
            external: true,
            url: getOrderURL('internet_sdsl', region, sub),
            tracking: 'telecom::orders::sdsl::order',
          },
          {
            label: 'order_item_internet_adsl_creation',
            external: true,
            url: getOrderURL('internet_adsl_creation', region, sub),
            tracking: 'telecom::orders::adsl-new::order',
          },
          {
            label: 'order_item_internet_otb',
            external: true,
            url: getOrderURL('internet_otb', region, sub),
            tracking: 'telecom::orders::overthebox::order',
          },
        ],
      }
    : null,
  telephony(navigation, region, sub, features),
  email(region, sub),
  office(region, sub),
  sms(navigation, region, sub, features),
  features.fax
    ? {
        label: 'item_fax',
        icon: OdsIconWrapper({ name: OdsIconName.PRINTER_CONCEPT }),
        external: true,
        url: getOrderURL('faxOrder', region, sub),
        tracking: 'telecom::orders::freefax::order',
      }
    : null,
  {
    label: 'item_headset',
    icon: HEADSET_SVG,
    external: true,
    url: getOrderURL('telephony_accessory_order', region, sub),
    tracking: 'telecom::orders::telephony-accessories::order',
  },
];

export default telecomShopConfig;
