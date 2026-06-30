import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  GuideButton,
  GuideItem,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import { Outlet, useHref, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import config from '@/web-domains.config';
import { urls } from '@/domain/routes/routes.constant';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import { useLinks } from '@/domain/constants/guideLinks';
import ZoneOrderComponent from '@/domain/components/ZoneOrder/zoneOrderComponent';

export default function ZoneActivatePage() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { serviceName } = useParams<{ serviceName: string }>();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const guideUrls = useLinks(ovhSubsidiary);

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: guideUrls.DOMAINS_LINK,
      target: '_blank',
      label: t('domain_guide_button_label'),
    },
  ];

  const hrefPrevious = useHref(
    `/${config.rootLabel}${urls.domainDetail.replace(
      ':serviceName',
      serviceName,
    )}`,
  );

  const header: HeadersProps = {
    title: serviceName,
    changelogButton: <ChangelogButton links={changelogLinks} />,
    headerButton: <GuideButton items={guideItems} />,
  };

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={serviceName} appName="domain" hideRootLabel />
      }
      header={header}
      hrefPrevious={`/${hrefPrevious}`}
      backLinkLabel={t('domain_back_to_service_details')}
    >
      <section data-testid="order-component">
        <ZoneOrderComponent />
      </section>
      <Outlet />
    </BaseLayout>
  );
}
