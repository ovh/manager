import { GUIDES_LIST } from '@/domain/constants/guideLinks';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import { getLanguageKey } from '@/domain/utils/utils';
import {
  BaseLayout,
  ChangelogButton,
  GuideButton,
  GuideItem,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref, useParams } from 'react-router-dom';
import config from '@/web-domains.config';
import { urls } from '@/domain/routes/routes.constant';
import WebHostingOrderComponent from '@/domain/components/WebHostingOrder/webHostingOrderComponent';
import BreadcrumbWebHostingOrder from './breadcrumb';

export default function WebHostingOrderPage() {
  const { t, i18n } = useTranslation(['domain', 'web-domains/error']);

  const { serviceName } = useParams<{ serviceName: string }>();
  const langCode = getLanguageKey(i18n.language);

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: GUIDES_LIST.domains.url[langCode],
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
      breadcrumb={<BreadcrumbWebHostingOrder serviceName={serviceName} />}
      header={header}
      hrefPrevious={`/${hrefPrevious}`}
      backLinkLabel={t('domain_back_to_service_details')}
    >
      <section data-testid="order-component">
        <WebHostingOrderComponent />
      </section>
      <Outlet />
    </BaseLayout>
  );
}
