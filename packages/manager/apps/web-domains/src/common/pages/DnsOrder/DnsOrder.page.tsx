import { useContext, useState } from 'react';
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
import {
  Outlet,
  useHref,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { getExpressOrderURL } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { UserLocales } from '@ovh-ux/manager-config';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import DnsZoneOrder from '@/domain/components/AnycastOrder/DnsZoneOrder';
import DnsOrderCard from '@/common/components/DnsOrderCard/DnsOrderCard';
import {
  useGetDomainResource,
  useGetDomainZone,
} from '@/domain/hooks/data/query';
import Loading from '@/common/components/Loading/Loading';
import { generateOrderUrl } from '@/domain/utils/order';
import { OrderProduct } from '@/domain/types/order';
import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import config from '@/web-domains.config';
import { BreadcrumbAnyCast } from '@/domain/pages/domainTabs/dns/breadcrumb';
import { AnycastPreviousPages } from '@/domain/enum/navigation.enum';
import { useLinks } from '@/domain/constants/guideLinks';

const getPageToRedirectTo = (
  from: AnycastPreviousPages | undefined,
  isZoneActivation: boolean,
) => {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  if (isZoneActivation) {
    return { url: urls.domainTabZone, title: t('domain_back_to_zone') };
  }

  return from === AnycastPreviousPages.DNS_SERVERS
    ? { url: urls.domainTabDns, title: t('domain_back_to_dns_servers') }
    : { url: urls.domainTabInformation, title: t('domain_back_to_service_details') }
}

export default function DnsOrderPage() {
  //TODO
  // Vérifier que la checbox Ancast est bien fonctionnelle
  // Breadcrumb à fixer

  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { serviceName } = useParams<{ serviceName: string }>();
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName,
  );
  const { domainZone, isFetchingDomainZone } = useGetDomainZone(
    serviceName,
    true,
  );
  const [dnssecSelected, setDnssecSelected] = useState<boolean>(false);
  const location = useLocation();
  const isZoneActivation = location.pathname.endsWith('/zone/activate');
  const [anycastSelected, setAnycastSelected] = useState<boolean>(!isZoneActivation);
  const [orderURL, setOrderURL] = useState<string>('');

  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const userLocal = context.environment.getUserLocale() as UserLocales;
  const backUrl = useGenerateUrl(urls.domainTabDns, 'path', { serviceName });
  const from = location.state?.from;
  const pageToRedirectTo = getPageToRedirectTo(from, isZoneActivation);


  const hrefPrevious = useHref(
    `/${config.rootLabel}${pageToRedirectTo.url.replace(
      ':serviceName',
      serviceName,
    )}`,
  );

  const guideUrls = useLinks(ovhSubsidiary);

  const region = context.environment.getRegion();
  const orderBaseUrl = getExpressOrderURL(region, ovhSubsidiary);
  const onCheckBoxChange = () => {
    setDnssecSelected(!dnssecSelected);
  };
  const onAnycastCheckBoxChange = () => {
    setAnycastSelected(!anycastSelected);
  };
  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: guideUrls.DOMAINS_LINK,
      target: '_blank',
      label: t('domain_guide_button_label'),
    },
  ];
  const header: HeadersProps = {
    title: serviceName,
    changelogButton: <ChangelogButton links={changelogLinks} />,
    headerButton: <GuideButton items={guideItems} />,
  };

  if (isFetchingDomainZone || isFetchingDomainResource) {
    return <Loading />;
  }

  const handleClickOrder = () => {
    const products: OrderProduct[] = [
      {
        planCode: domainZone ? 'anycast' : 'zone',
        dnssec: dnssecSelected,
        zoneName: serviceName,
        activateZone: !domainZone,
        anycast: anycastSelected,
      },
    ];
    const expressOrderURL = generateOrderUrl({
      baseUrl: orderBaseUrl,
      products,
    });
    setOrderURL(expressOrderURL);
    window.open(expressOrderURL, '_blank', 'noopener,noreferrer');
  };

  return (
    <BaseLayout
      breadcrumb={isZoneActivation ? <Breadcrumb rootLabel={serviceName} appName="domain" hideRootLabel /> : <BreadcrumbAnyCast serviceName={serviceName} />}
      header={header}
      hrefPrevious={`/${hrefPrevious}`}
      backLinkLabel={pageToRedirectTo.title}
    >
      <section data-testid="order-component">
        <Order>
          <Order.Configuration
            isValid={true}
            onConfirm={handleClickOrder}
            onCancel={() => navigate(backUrl, { replace: true })}
          >

            <Text preset={TEXT_PRESET.heading3} className="pb-8">
              {isZoneActivation ? t('domain_tab_DNS_anycast_order_activate_zone') : t('domain_tab_DNS_anycast_order')}
            </Text>
            {!domainZone && (
              <DnsZoneOrder
                isZoneActivation={isZoneActivation}
                dnssecSelected={dnssecSelected}
                onDnssecSelectedChange={onCheckBoxChange}
                dnssecSupported={
                  domainResource?.currentState?.dnsConfiguration
                    ?.dnssecSupported
                }
              />
            )}
            <DnsOrderCard
              isZoneActivation={isZoneActivation}
              displayTitle={!domainZone}
              subsidiary={ovhSubsidiary as OvhSubsidiary}
              userLocal={userLocal}
              anycastSelected={anycastSelected}
              onAnycastCheckBoxChange={onAnycastCheckBoxChange}
            />
          </Order.Configuration>
          <Order.Summary
            orderLink={orderURL}
            onFinish={() => navigate(backUrl, { replace: true })}
            productName="Anycast"
          ></Order.Summary>
        </Order>
      </section>
      <Outlet />
    </BaseLayout >
  );
}
