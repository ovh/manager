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
import { ORDER_URLS } from './order.constants';

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
            url: ORDER_URLS[region].telephony_voip[sub],
            tracking: 'orders::telephony::voip::order',
          },
          {
            label: 'order_item_telephony_siptrunk',
            external: true,
            url: ORDER_URLS[region].telephony_siptrunk[sub],
            tracking: 'orders::telephony::sip-trunk::order',
          },
          {
            label: 'order_item_telephony_siptrunk_call',
            external: true,
            url: ORDER_URLS[region].telephony_siptrunkCall[sub],
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
      url: ORDER_URLS[region].email_exchange[sub],
      tracking: 'orders::email::email-microsoft-exchange::order',
    },
    {
      label: 'order_item_email_sharepoint',
      external: true,
      url: ORDER_URLS[region].email_sharepoint[sub],
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
      url: ORDER_URLS[region].office365_business[sub],
      tracking: 'orders::office365::licences-office::order',
    },
    {
      label: 'order_item_office365_sharepoint',
      external: true,
      url: ORDER_URLS[region].office365_sharepoint[sub],
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
                url: ORDER_URLS[region].smsHlr[sub],
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
    url: ORDER_URLS[region].domain[sub],
    tracking: 'orders::domain-name::order',
  },
  features.pack
    ? {
        label: 'order_item_internet',
        icon: OVHFontTelecomEthernet,
        subMenu: [
          {
            label: 'order_item_internet_xdsl',
            url: ORDER_URLS[region].internet_xdsl[sub],
            external: true,
            tracking: 'orders::xdsl::order',
          },
          {
            label: 'order_item_internet_fiber',
            external: true,
            url: ORDER_URLS[region].internet_fiber[sub],
            tracking: 'orders::fibre::order',
          },
          {
            label: 'order_item_internet_sdsl',
            external: true,
            url: ORDER_URLS[region].internet_sdsl[sub],
            tracking: 'orders::sdsl::order',
          },
          {
            label: 'order_item_internet_adsl_creation',
            external: true,
            url: ORDER_URLS[region].internet_adsl_creation[sub],
            tracking: 'orders::adsl-new::order',
          },
          {
            label: 'order_item_internet_otb',
            external: true,
            url: ORDER_URLS[region].internet_otb[sub],
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
        url: ORDER_URLS[region].faxOrder[sub],
      }
    : null,
];

export default telecomShopConfig;
