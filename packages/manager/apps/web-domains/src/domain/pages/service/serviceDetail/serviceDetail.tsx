import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  ErrorBanner,
  GuideButton,
  GuideItem,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import appConfig from '@/web-domains.config';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import Loading from '@/domain/components/Loading/Loading';
import ServiceDetailsTabs from '@/domain/components/ServiceDetail/ServiceDetailTabs';
import { urls } from '@/domain/routes/routes.constant';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import { getLanguageKey } from '@/domain/utils/utils';
import { GUIDES_LIST } from '@/domain/constants/guideLinks';

export default function ServiceDetail() {
  const { t, i18n } = useTranslation(['domain', 'web-domains/error']);
  const navigate = useNavigate();
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

  const header: HeadersProps = {
    title: serviceName,
    changelogButton: <ChangelogButton links={changelogLinks} />,
    headerButton: <GuideButton items={guideItems} />,
  };

  const {
    domainResourceError,
    isFetchingDomainResource,
  } = useGetDomainResource(serviceName);

  if (isFetchingDomainResource) {
    return <Loading />;
  }

  if (domainResourceError) {
    return (
      <ErrorBanner
        error={{
          status: 500,
          data: { message: domainResourceError.message },
        }}
      />
    );
  }
  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={t('title')}
          appName={appConfig.rootLabel}
          hideRootLabel
        />
      }
      header={header}
      tabs={<ServiceDetailsTabs />}
      backLinkLabel={t('domain_back_to_service_list')}
      onClickReturn={() => {
        navigate(urls.domainRoot, { replace: true });
      }}
    >
      <section className="grid grid-cols-1 gap-6 items-start lg:grid-cols-2">
        <div className="flex flex-col gap-6"></div>
      </section>
      <Outlet />
    </BaseLayout>
  );
}
