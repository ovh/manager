import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Environment } from '@ovh-ux/manager-config';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useShell } from '@/context';
import { sanitizeMenu, SidebarMenuItem } from '../sidebarMenu';
import Sidebar from '../Sidebar';
import dedicatedShopConfig from '../order/shop-config/dedicated';
import OrderTrigger from '../order/OrderTrigger';
import { ShopItem } from '../order/OrderPopupContent';
import { features } from './DedicatedSidebar';
import constants from '../../account-sidebar/UsefulLinks/constants';
import { useProcedureStatus } from '@/hooks/procedure/useProcedure';
import { Procedures } from '@/types/procedure';

const kycIndiaFeature = 'identity-documents';
const kycFraudFeature = 'procedures:fraud';
const accountFeatures = [
  kycIndiaFeature,
  kycFraudFeature,
];

export default function AccountSidebar() {
  const [menu, setMenu] = useState<SidebarMenuItem>(undefined);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const shell = useShell();
  const { t, i18n } = useTranslation('sidebar');
  const navigation = shell.getPlugin('navigation');
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const region = environment.getRegion();
  const subsidiary = environment.getUser()?.ovhSubsidiary;
  const isEnterprise = environment.getUser()?.enterprise;

  const { data: availability } = useFeatureAvailability(
    features.concat(accountFeatures),
  );
  // In order to not wait too long before displaying the menu entries, we will not retry the retrieval of KYC
  // procedures statuses
  const {
    data: kycIndiaProcedure,
    status: fetchKycIndiaProcedureStatus,
  } = useProcedureStatus(Procedures.INDIA, {
    enabled: availability?.[kycIndiaFeature] || false,
    retry: 0,
  });
  const {
    data: kycFraudProcedure,
    status: fetchKycFraudProcedureStatus,
  } = useProcedureStatus(Procedures.FRAUD, {
    enabled: availability?.[kycFraudFeature] || false,
    retry: 0,
  });

  const getAccountSidebar = () => {
    const menu: SidebarMenuItem[] = [];

    if (!availability) {
      return menu;
    }

    const isEUOrCA = ['EU', 'CA'].includes(region);

    menu.push({
      id: 'back-to-home',
      label: t('sidebar_back_home'),
      href: navigation.getURL('hub', '/'),
    });

    menu.push({
      id: 'my-account',
      label: t('sidebar_account'),
      href: navigation.getURL('account',
        '/useraccount/dashboard',
      ),
      routeMatcher: new RegExp('^/useraccount'),
    });
    if (
      availability[kycIndiaFeature] &&
      ['required', 'open'].includes(kycIndiaProcedure?.status)
    ) {
      menu.push({
        id: 'my-identity-documents',
        label: t('sidebar_account_identity_documents'),
        href: navigation.getURL('account',
          '/identity-documents',
        ),
        routeMatcher: new RegExp('^/identity-documents'),
      });
    }

    if (
      availability[kycFraudFeature] &&
      ['required', 'open'].includes(kycFraudProcedure?.status)
    ) {
      menu.push({
        id: 'kyc-documents',
        label: t('sidebar_account_kyc_documents'),
        href: navigation.getURL('account',
          '/documents',
        ),
        routeMatcher: new RegExp('^/documents'),
      });
    }

    if (!isEnterprise) {
      menu.push({
        id: 'my-bills',
        label: t('sidebar_billing'),
        href: navigation.getURL('billing', '/history',
        ),
        routeMatcher: new RegExp(
          '^/billing/(history|payAsYouGo|payments|refunds)',
        ),
      });
    }

    menu.push({
      id: 'my-services',
      label: t('sidebar_billing_services'),
      href: navigation.getURL('billing', `/autorenew${
          isEnterprise ? '/ssh' : '/'
        }`,
      ),
      routeMatcher: new RegExp('^/billing/autorenew', 'i'),
    });

    if (!isEnterprise) {
      menu.push({
        id: 'payment-method',
        label: t('sidebar_billing_payment'),
        href: navigation.getURL('billing', '/payment',
        ),
        routeMatcher: new RegExp('^/billing/payment[^s]'),
      });
      menu.push({
        id: 'my-orders',
        label: t('sidebar_orders'),
        href: navigation.getURL('billing', '/orders',
        ),
        routeMatcher: new RegExp('^/billing/orders'),
      });
    }

    if (isEUOrCA) {
      menu.push({
        id: 'my-contacts',
        label: t('sidebar_account_contacts'),
        href: navigation.getURL('account',
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

    if (availability['identity-access-management']) {
      menu.push({
        id: 'iam',
        label: t('sidebar_security_identity_operations'),
        pathMatcher: new RegExp('^/(iam|identity-access-management)'),
        ignoreSearch: true,
        subItems: [
          {
            id:'iam-identities',
            href: navigation.getURL('iam', '#/identities'),
            label: t('sidebar_security_identity_operations_iam_identities'),
            pathMatcher: new RegExp('^/iam/identities'),
            ignoreSearch: true,
          },
          {
            id:'iam-policies',
            href: navigation.getURL('iam', '#/policies'),
            label: t('sidebar_security_identity_operations_iam_policies'),
            pathMatcher: new RegExp('^/iam/policies'),
            ignoreSearch: true,
          },
          {
            id:'iam-api-keys',
            href: navigation.getURL('iam', '#/api-keys'),
            label: t('sidebar_security_identity_operations_iam_api-keys'),
            pathMatcher: new RegExp('^/iam/api-keys'),
            ignoreSearch: true,
          },
          availability['identity-access-management:tag-management'] && {
            id:'iam-tag-management',
            href: navigation.getURL('identity-access-management', '#/tag-manager'),
            label: t('sidebar_security_identity_operations_iam_tag-management'),
            pathMatcher: new RegExp('^/identity-access-management/tag-manager'),
            ignoreSearch: true,
          },
          availability['identity-access-management:logs'] && {
            id:'iam-logs',
            href: navigation.getURL('iam', '#/logs'),
            label: t('sidebar_security_identity_operations_iam_logs'),
            pathMatcher: new RegExp('^/iam/logs'),
            ignoreSearch: true,
            badge: 'beta'
          },
        ].filter(Boolean)
      });
    }
    return menu;
  };

  useEffect(() => {
    if (
      availability &&
      (!availability[kycIndiaFeature] ||
        fetchKycIndiaProcedureStatus !== 'pending') &&
      (!availability[kycFraudFeature] ||
        fetchKycFraudProcedureStatus !== 'pending')
    ) {
      setMenu(
        sanitizeMenu({
          id: 'my-account-sidebar',
          label: '',
          subItems: [...getAccountSidebar()],
        }),
      );
      setShopItems(
        dedicatedShopConfig(
          navigation,
          region,
          environment.getUser().ovhSubsidiary,
          availability,
        ),
      );
    }
  }, [
    availability,
    i18n.language,
    fetchKycIndiaProcedureStatus,
    fetchKycFraudProcedureStatus,
  ]);

  return (
    <>
      {!environment.getUser().isTrusted && <OrderTrigger items={shopItems} />}
      <Sidebar menu={menu} />
    </>
  );
}
