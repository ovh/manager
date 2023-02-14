import {
  OVHFontPhone,
  OVHFontDomain,
  OVHFontHashtag,
  OVHFontMail,
  OVHFontMessage,
  OVHFontTelecomEthernet,
  OVHFontPrint,
} from '@ovh-ux/manager-themes';
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
        icon: OVHFontPhone,
        subMenu: [
          {
            label: 'order_item_telephony_voip',
            external: true,
            url: getOrderURL('telephony_voip', region, sub),
            tracking: 'orders::telephony::voip::order',
          },
          {
            label: 'order_item_telephony_siptrunk',
            external: true,
            url: getOrderURL('telephony_siptrunk', region, sub),
            tracking: 'orders::telephony::sip-trunk::order',
          },
          {
            label: 'order_item_telephony_siptrunk_call',
            external: true,
            url: getOrderURL('telephony_siptrunkCall', region, sub),
            tracking: 'orders::telephony::sip-trunk-included::order',
          },
          {
            label: 'order_item_telephony_accessories',
            url: navigation.getURL('telecom', '#/orders/accessories'),
          },
        ],
      }
    : null;

const email = (region: string, sub: string): ShopItem => ({
  label: 'order_item_email',
  icon: OVHFontMail,
  subMenu: [
    {
      label: 'order_item_email_exchange',
      external: true,
      url: getOrderURL('email_exchange', region, sub),
      tracking: 'orders::email::email-microsoft-exchange::order',
    },
    {
      label: 'order_item_email_sharepoint',
      external: true,
      url: getOrderURL('email_sharepoint', region, sub),
      tracking: 'orders::email::microsoft-sharepoint::order',
    },
  ],
});

const office = (region: string, sub: string): ShopItem => ({
  label: 'order_item_office365',
  icon: 'ms-Icon ms-Icon--OfficeLogo',
  subMenu: [
    {
      label: 'order_item_office365_business',
      external: true,
      url: getOrderURL('office365_business', region, sub),
      tracking: 'orders::office365::licences-office::order',
    },
    {
      label: 'order_item_office365_sharepoint',
      external: true,
      url: getOrderURL('office365_sharepoint', region, sub),
      tracking: 'orders::office365::microsoft-sharepoint::order',
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
        icon: OVHFontMessage,
        subMenu: [
          features['sms:order']
            ? {
                label: 'order_item_sms',
                url: navigation.getURL('telecom', '#/sms/order'),
              }
            : null,
          features['sms:hlr']
            ? {
                label: 'order_item_sms_hlr',
                external: true,
                url: getOrderURL('smsHlr', region, sub),
                tracking: 'orders::sms::hlr::order',
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
        icon: OVHFontHashtag,
        url: navigation.getURL('telecom', '#/orders/orders/alias'),
      }
    : null,
  {
    label: 'order_item_domain',
    icon: OVHFontDomain,
    external: true,
    url: getOrderURL('domain', region, sub),
    tracking: 'orders::domain-name::order',
  },
  features.pack
    ? {
        label: 'order_item_internet',
        icon: OVHFontTelecomEthernet,
        subMenu: [
          {
            label: 'order_item_internet_xdsl',
            url: getOrderURL('internet_xdsl', region, sub),
            external: true,
            tracking: 'orders::xdsl::order',
          },
          {
            label: 'order_item_internet_fiber',
            external: true,
            url: getOrderURL('internet_fiber', region, sub),
            tracking: 'orders::fibre::order',
          },
          {
            label: 'order_item_internet_sdsl',
            external: true,
            url: getOrderURL('internet_sdsl', region, sub),
            tracking: 'orders::sdsl::order',
          },
          {
            label: 'order_item_internet_adsl_creation',
            external: true,
            url: getOrderURL('internet_adsl_creation', region, sub),
            tracking: 'orders::adsl-new::order',
          },
          {
            label: 'order_item_internet_otb',
            external: true,
            url: getOrderURL('internet_otb', region, sub),
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
        icon: OVHFontPrint,
        external: true,
        url: getOrderURL('faxOrder', region, sub),
      }
    : null,
];

export default telecomShopConfig;
