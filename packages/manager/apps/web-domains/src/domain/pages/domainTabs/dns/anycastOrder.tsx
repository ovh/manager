import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  GuideButton,
  GuideItem,
  HeadersProps,
  Order,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { UserLocales } from '@ovh-ux/manager-config';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import { GUIDES_LIST } from '@/domain/constants/guideLinks';
import { getLanguageKey } from '@/domain/utils/utils';
import DnsZoneOrder from '@/domain/components/AnycastOrder/DnsZoneOrder';
import AnycastOrderComponent from '@/domain/components/AnycastOrder/AnycastOrder';
import { useGetDomainZone } from '@/domain/hooks/data/query';
import Loading from '@/domain/components/Loading/Loading';
import { generateOrderURL } from '@/domain/utils/order';
import { OrderProduct } from '@/domain/types/order';
import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/domain/hooks/generateUrl/useGenerateUrl';

export default function AnycastOrder() {
  const { t, i18n } = useTranslation(['domain', 'web-domains/error']);
  const { serviceName } = useParams<{ serviceName: string }>();
  const { domainZone, isFetchingdomainZone } = useGetDomainZone(serviceName);
  const [dnssecSelected, setDnssecSelected] = useState<boolean>(false);
  const [orderURL, setOrderURL] = useState<string>('');

  const navigate = useNavigate();
  const langCode = getLanguageKey(i18n.language);
  const context = useContext(ShellContext);
  const ovhSubsidiary = context.environment.getUser()
    .ovhSubsidiary as OvhSubsidiary;
  const userLocal = context.environment.getUserLocale() as UserLocales;
  const backUrl = useGenerateUrl(urls.domainTabDns, 'path', { serviceName });
  const region = context.environment.getRegion();
  const orderBaseUrl = getExpressOrderURL(region, ovhSubsidiary);

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: GUIDES_LIST.domains.url[langCode],
      target: '_blank',
      label: t('domain_guide_button_label'),
    },
  ];
  const header: HeadersProps = {
    title: serviceName,
    changelogButton: <ChangelogButton links={changelogLinks} />,
    headerButton: <GuideButton items={guideItems} />,
  };

  if (isFetchingdomainZone) {
    return <Loading />;
  }

  const handleClickOrder = () => {
    const products: OrderProduct[] = [
      {
        planCode: domainZone ? 'anycast' : 'zone',
        dnssec: dnssecSelected,
        zoneName: domainZone ? domainZone.name : serviceName,
        activateZone: !domainZone,
      },
    ];
    const expressOrderURL = generateOrderURL({
      baseURL: orderBaseUrl,
      products,
    });
    setOrderURL(expressOrderURL);
    window.open(expressOrderURL, '_blank', 'noopener,noreferrer');
  };

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={t('title')} appName={'domain'} hideRootLabel />
      }
      header={header}
      backLinkLabel={t('domain_back_to_service_details')}
      onClickReturn={() => {
        navigate(backUrl, { replace: true });
      }}
    >
      <section data-testid='order-component'>
        <Order>
          <Order.Configuration
            isValid={true}
            onConfirm={handleClickOrder}
            onCancel={() => navigate(backUrl, { replace: true })}
          >
            <Text preset={TEXT_PRESET.heading3} className="pb-8">
              {t('domain_dns_tab_button_order_anycast')}
            </Text>
            {!domainZone && (
              <DnsZoneOrder
                dnssecSelected={dnssecSelected}
                setDnssecSelected={setDnssecSelected}
              />
            )}
            <AnycastOrderComponent
              displayTitle={!domainZone}
              subsidiary={ovhSubsidiary}
              userLocal={userLocal}
            />
          </Order.Configuration>
          <Order.Summary
            orderLink={orderURL}
            onFinish={() => navigate(backUrl, { replace: true })}
            productName="Anycast"
            onClickLink={() => {}}
          ></Order.Summary>
        </Order>
      </section>
      <Outlet />
    </BaseLayout>
  );
}
