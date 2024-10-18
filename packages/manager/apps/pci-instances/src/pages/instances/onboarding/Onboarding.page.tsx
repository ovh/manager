import { FC, useContext } from 'react';
import {
  Card,
  OnboardingLayout,
  OvhSubsidiary,
  PageLayout,
} from '@ovh-ux/manager-react-components';
import {
  Navigate,
  useHref,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TProject } from '@ovh-ux/manager-pci-common';
import { useHidePreloader } from '@/hooks/hidePreloader/useHidePreloader';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import InstanceImageSrc from '../../../../public/assets/instance.png';
import { GUIDES } from './onboarding.constants';
import { useInstances } from '@/data/hooks/instance/useInstances';
import { Spinner } from '@/components/spinner/Spinner.component';

const Onboarding: FC = () => {
  const { t } = useTranslation(['onboarding', 'common']);
  const { projectId } = useParams() as { projectId: string };
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser() as {
    ovhSubsidiary: OvhSubsidiary;
  };
  const project = useRouteLoaderData('root') as TProject;
  const createInstanceHref = useHref('../new');
  useHidePreloader();

  const { data, isLoading } = useInstances(projectId, {
    limit: 10,
    sort: 'name',
    sortOrder: 'asc',
    filters: [],
  });

  if (isLoading) return <Spinner />;

  return data && data.length > 0 ? (
    <Navigate to={'..'} />
  ) : (
    <PageLayout>
      {project && <Breadcrumb projectLabel={project.description ?? ''} />}
      <OnboardingLayout
        title={t('common:pci_instances_common_instances_title')}
        img={{ src: InstanceImageSrc }}
        orderButtonLabel={t('common:pci_instances_common_create_instance')}
        orderHref={createInstanceHref}
        description={
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-8 block"
            >
              {t('pci_instances_onboarding_not_created_message')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              className="mt-8 block"
            >
              {t('pci_instances_onboarding_content_message_1')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-4 block"
            >
              {t('pci_instances_onboarding_content_message_2')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-8 block"
            >
              {t('pci_instances_onboarding_advice_message')}
            </OsdsText>
          </>
        }
      >
        {GUIDES.map((guide) => (
          <Card
            key={guide.id}
            href={guide.links[ovhSubsidiary] ?? (guide.links.DEFAULT as string)}
            texts={{
              title: t(`pci_instances_onboarding_${guide.id}_title`),
              description: t(
                `pci_instances_onboarding_${guide.id}_description`,
              ),
              category: t('pci_instances_onboarding_guide_title'),
            }}
          />
        ))}
      </OnboardingLayout>
    </PageLayout>
  );
};

export default Onboarding;
