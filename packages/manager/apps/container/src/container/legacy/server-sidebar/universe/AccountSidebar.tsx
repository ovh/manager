import React, { useEffect, useState } from 'react';
import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { Environment } from '@ovh-ux/manager-config';
import { useShell } from '@/context';
import { sanitizeMenu, SidebarMenuItem } from '../sidebarMenu';
import Sidebar from '../Sidebar';
import dedicatedShopConfig from '../order/shop-config/dedicated';
import OrderTrigger from '../order/OrderTrigger';
import { ShopItem } from '../order/OrderPopupContent';
import { features } from './DedicatedSidebar';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import constants from '../../account-sidebar/UsefulLinks/constants';

const kycIndiaFeature = 'identity-documents';
const kycFraudFeature = 'procedures:fraud';
const newAccount = 'new-account';
const newBilling = 'new-billing';
const accountFeatures = [
  kycIndiaFeature,
  kycFraudFeature,
  newAccount,
  newBilling,
];

export default function AccountSidebar() {
  const [menu, setMenu] = useState<SidebarMenuItem>(undefined);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const shell = useShell();
  const reketInstance = useReket();
  const { t, i18n } = useTranslation('sidebar');
  const navigation = shell.getPlugin('navigation');
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const region = environment.getRegion();
  const subsidiary = environment.getUser()?.ovhSubsidiary;
  const isEnterprise = environment.getUser()?.enterprise;

  const getAccountSidebar = async (
    availability: Record<string, boolean> | null,
  ) => {
    const menu: SidebarMenuItem[] = [];

    if (!availability) {
      return menu;
    }

    const isEUOrCA = ['EU', 'CA'].includes(region);
    const isNewAccountAvailable = !!availability['new-account'];
    const isNewBillingAvailable = !!availability['new-billing'];

    menu.push({
      id: 'back-to-home',
      label: t('sidebar_back_home'),
      href: navigation.getURL('hub', '/'),
    });

    menu.push({
      id: 'my-account',
      label: t('sidebar_account'),
      href: navigation.getURL(
        isNewAccountAvailable ? 'new-account' : 'dedicated',
        '/useraccount/dashboard',
      ),
      routeMatcher: new RegExp('^/useraccount'),
    });

    if (availability[kycIndiaFeature]) {
      const { status } = await reketInstance.get(`/me/procedure/identity`);
      if (['required', 'open'].includes(status)) {
        menu.push({
          id: 'my-identity-documents',
          label: t('sidebar_account_identity_documents'),
          href: navigation.getURL(
            isNewAccountAvailable ? 'new-account' : 'dedicated',
            '/identity-documents',
          ),
          routeMatcher: new RegExp('^/identity-documents'),
        });
      }
    }

    if (availability[kycFraudFeature]) {
      const { status } = await reketInstance.get(`/me/procedure/fraud`);
      if (['required', 'open'].includes(status)) {
        menu.push({
          id: 'kyc-documents',
          label: t('sidebar_account_kyc_documents'),
          href: navigation.getURL(
            isNewAccountAvailable ? 'new-account' : 'dedicated',
            '/documents',
          ),
          routeMatcher: new RegExp('^/documents'),
        });
      }
    }

    if (!isEnterprise) {
      menu.push({
        id: 'my-bills',
        label: t('sidebar_billing'),
        href: navigation.getURL(
          isNewBillingAvailable ? 'new-billing' : 'dedicated',
          `${!isNewBillingAvailable ? '/billing' : ''}/history`,
        ),
        routeMatcher: new RegExp(
          '^/billing/(history|payAsYouGo|payments|refunds)',
        ),
      });
    }

    menu.push({
      id: 'my-services',
      label: t('sidebar_billing_services'),
      href: navigation.getURL(
        isNewBillingAvailable ? 'new-billing' : 'dedicated',
        `${!isNewBillingAvailable ? '/billing' : ''}/autorenew${
          isEnterprise ? '/ssh' : '/'
        }`,
      ),
      routeMatcher: new RegExp('^/billing/autorenew', 'i'),
    });

    if (!isEnterprise) {
      menu.push({
        id: 'payment-method',
        label: t('sidebar_billing_payment'),
        href: navigation.getURL(
          isNewBillingAvailable ? 'new-billing' : 'dedicated',
          `${!isNewBillingAvailable ? '/billing' : ''}/payment`,
        ),
        routeMatcher: new RegExp('^/billing/payment[^s]'),
      });
      menu.push({
        id: 'my-orders',
        label: t('sidebar_orders'),
        href: navigation.getURL(
          isNewBillingAvailable ? 'new-billing' : 'dedicated',
          `${!isNewBillingAvailable ? '/billing' : ''}/orders`,
        ),
        routeMatcher: new RegExp('^/billing/orders'),
      });
    }

    if (isEUOrCA) {
      menu.push({
        id: 'my-contacts',
        label: t('sidebar_account_contacts'),
        href: navigation.getURL(
          isNewAccountAvailable ? 'new-account' : 'dedicated',
          '/contacts',
        ),
        routeMatcher: new RegExp('^/contacts'),
      });
    }

    if (availability['carbon-calculator']) {
      menu.push({
        id: 'my-carbon-footprint',
        label: t('sidebar_carbon_footprint'),
        href: navigation.getURL('carbon-calculator', '/'),
        pathMatcher: new RegExp('^/carbon-calculator'),
      });
    }

    menu.push({
      id: 'my-support-tickets',
      label: t('sidebar_assistance_tickets'),
      isExternal: isEUOrCA,
      href: isEUOrCA
        ? constants[region].support.tickets(subsidiary)
        : navigation.getURL('dedicated', '/ticket'),
      routeMatcher: new RegExp('^/(ticket|support)'),
    });

    if (availability.iam) {
      menu.push({
        id: 'iam',
        label: t('sidebar_account_iam'),
        href: navigation.getURL('iam', '/'),
        pathMatcher: new RegExp('^/iam'),
      });
    }
    return menu;
  };

  const { data: availability } = useFeatureAvailability(
    features.concat(accountFeatures),
  );

  const buildMenu = async () =>
    Promise.resolve({
      id: 'my-account-sidebar',
      label: '',
      subItems: [...(await getAccountSidebar(availability))],
    });

  useEffect(() => {
    buildMenu().then((menu) => setMenu(sanitizeMenu(menu)));
  }, [availability, i18n.language]);

  useEffect(() => {
    if (availability) {
      setShopItems(
        dedicatedShopConfig(
          navigation,
          region,
          environment.getUser().ovhSubsidiary,
          availability,
        ),
      );
    }
  }, [availability, i18n.language]);

  return (
    <>
      {!environment.getUser().isTrusted && <OrderTrigger items={shopItems} />}
      <Sidebar menu={menu} />
    </>
  );
}
