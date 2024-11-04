import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  OdsBreadcrumbAttributeItem,
} from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  OnboardingLayout,
  RedirectionGuard,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { Suspense, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useAllLoadBalancers } from '@/api/hook/useLoadBalancer';
import { GUIDES, ONBOARDING_TRACKING_PREFIX } from './constant';
import { useGetPrivateNetworks } from '@/api/hook/useNetwork';

export default function OnBoardingPage() {
  const { t } = useTranslation(['onboarding', 'load-balancer']);
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);
  const urlProject = useProjectUrl('public-cloud');
  const navigate = useNavigate();

  const context = useContext(ShellContext);
  const { tracking } = context.shell;
  const { ovhSubsidiary } = context.environment.getUser();

  const {
    data: privateNetworks,
    isPending: isPrivateNetworksPending,
  } = useGetPrivateNetworks(projectId);
  const { data: allLoadBalancer, isPending } = useAllLoadBalancers(projectId);

  const tileItems = GUIDES.map((guide) => ({
    id: guide.title,
    href: guide.links[ovhSubsidiary] || guide.links.DEFAULT,
    texts: {
      category: t('onboarding_guide_title'),
      description: t(guide.description),
      title: t(guide.title),
    },
  }));

  const breadcrumbItems: OdsBreadcrumbAttributeItem[] = [
    {
      href: urlProject,
      label: project?.description,
    },
    {
      label: t('octavia_load_balancers', { ns: 'load-balancer' }),
    },
  ];

  return (
    <RedirectionGuard
      isLoading={isPending || isPrivateNetworksPending}
      route={`/pci/projects/${projectId}/octavia-load-balancer`}
      condition={allLoadBalancer?.length > 0}
    >
      {project && <OsdsBreadcrumb items={breadcrumbItems} />}
      <OnboardingLayout
        title={t('octavia_load_balancer_onboarding_title')}
        description={
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-8 block"
            >
              {t('octavia_load_balancer_onboarding_description_1')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-6 block"
            >
              {t('octavia_load_balancer_onboarding_description_3')}
            </OsdsText>
          </>
        }
        orderButtonLabel={t('octavia_load_balancer_onboarding_cta')}
        onOrderButtonClick={() => {
          if (privateNetworks?.length) {
            navigate(`/pci/projects/${projectId}/octavia-load-balancer/create`);
          } else {
            navigate(`./no-private-network`);
          }
          tracking?.trackClick({
            name: `${ONBOARDING_TRACKING_PREFIX}::add`,
            type: 'navigation',
          });
        }}
      >
        {tileItems.map((tile) => (
          <Card key={tile.id} href={tile.href} texts={tile.texts} />
        ))}
      </OnboardingLayout>
      <Suspense>
        <Outlet />
      </Suspense>
    </RedirectionGuard>
  );
}
