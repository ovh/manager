import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  const isEnterprise = environment.getUser()?.enterprise;

  const getAccountSidebar = async (availability: Record<string, string> | null) => {
    const menu: SidebarMenuItem[] = [];

    if (!availability) {
      return menu;
    }

    menu.push({
      id: 'back-to-home',
      label: t('sidebar_back_home'),
      href: navigation.getURL('hub', '/'),
    });

    menu.push({
      id: 'my-account',
      label: t('sidebar_account'),
      href: navigation.getURL('dedicated', '/useraccount/dashboard'),
      routeMatcher: new RegExp('^/useraccount'),
    });

    const featureAvailability = await reketInstance.get(
      `/feature/identity-documents/availability`,
      {
        requestType: 'aapi',
      },
    );
    if (featureAvailability['identity-documents']) {
      const { status } = await reketInstance.get(`/me/procedure/identity`);
      if (['required','open'].includes(status)) {
        menu.push({
          id: 'my-identity-documents',
          label: t('sidebar_account_identity_documents'),
          href: navigation.getURL('dedicated', '/identity-documents'),
          routeMatcher: new RegExp('^/identity-documents'),
        });
      }
    }

    if (!isEnterprise) {
      menu.push({
        id: 'my-bills',
        label: t('sidebar_billing'),
        href: navigation.getURL(
          'dedicated',
          region === 'US' ? '/billing/payAsYouGo' : '/billing/history',
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
        'dedicated',
        `/billing/autorenew${isEnterprise ? '/ssh' : '/'}`,
      ),
      routeMatcher: new RegExp('^/billing/autorenew', 'i'),
    });

    if (!isEnterprise) {
      menu.push({
        id: 'payment-method',
        label: t('sidebar_billing_payment'),
        href: navigation.getURL('dedicated', '/billing/payment'),
        routeMatcher: new RegExp('^/billing/payment[^s]'),
      });
      menu.push({
        id: 'my-orders',
        label: t('sidebar_orders'),
        href: navigation.getURL('dedicated', '/billing/orders'),
        routeMatcher: new RegExp('^/billing/orders'),
      });
    }

    if (['EU', 'CA'].includes(region)) {
      menu.push({
        id: 'my-contacts',
        label: t('sidebar_account_contacts'),
        href: navigation.getURL('dedicated', '/contacts'),
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
      href: navigation.getURL(
        'dedicated',
        region === 'US' ? '/ticket' : '/support',
      ),
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

  const getFeatures = (): Promise<Record<string, string>> =>
    reketInstance.get(`/feature/${features.join(',')}/availability`, {
      requestType: 'aapi',
    });

  const { data: availability } = useQuery({
    queryKey: ['sidebar-dedicated-availability'],
    queryFn: getFeatures,
  });

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
