import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  ErrorBanner,
  GuideButton,
  GuideItem,
  HeadersProps,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useGetDomainResource } from '@/domain/hooks/data/query';
import appConfig from '@/web-domains.config';
import Loading from '@/domain/components/Loading/Loading';
import ServiceDetailsTabs from '@/domain/components/ServiceDetail/ServiceDetailTabs';
import { urls } from '@/domain/routes/routes.constant';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useLinks } from '@/domain/constants/guideLinks';

export default function ServiceDetail() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const navigate = useNavigate();
  const { serviceName } = useParams<{ serviceName: string }>();
  const { notifications } = useNotifications();
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

  const header: HeadersProps = {
    title: serviceName,
    changelogButton: <ChangelogButton links={changelogLinks} />,
    headerButton: <GuideButton items={guideItems} />,
  };

  const {
    domainResourceError,
    isFetchingDomainResource,
    domainResource,
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
      tabs={<ServiceDetailsTabs domainResource={domainResource} />}
      backLinkLabel={t('domain_back_to_service_list')}
      onClickReturn={() => {
        navigate(urls.domainRoot, { replace: true });
      }}
      message={notifications.length > 0 ? <Notifications /> : null}
    >
      <Outlet />
    </BaseLayout>
  );
}
