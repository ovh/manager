import { FC, useCallback, useContext, useMemo } from 'react';
import {
  Card,
  OnboardingLayout,
  OvhSubsidiary,
  PageLayout,
} from '@ovh-ux/manager-react-components';
import {
  Navigate,
  useNavigate,
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
import { useInstances } from '@/data/hooks/instances/useInstances';
import { Spinner } from '@/components/spinner/Spinner.component';

const Onboarding: FC = () => {
  const { t } = useTranslation(['onboarding', 'common']);
  const { projectId } = useParams() as { projectId: string };
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser() as {
    ovhSubsidiary: OvhSubsidiary;
  };
  const project = useRouteLoaderData('root') as TProject;
  const navigate = useNavigate();
  useHidePreloader();

  const { data, isLoading } = useInstances(projectId, {
    limit: 10,
    sort: 'name',
    sortOrder: 'asc',
    filters: [],
  });

  const rootUrl = useMemo(() => `/pci/projects/${projectId}/instances`, [
    projectId,
  ]);

  const createInstance = useCallback(() => {
    navigate('../new');
  }, [navigate]);

  if (isLoading) return <Spinner />;

  return data && data.length > 0 ? (
    <Navigate to={rootUrl} />
  ) : (
    <PageLayout>
      {project && <Breadcrumb projectLabel={project.description ?? ''} />}
      <OnboardingLayout
        title={t('common:instances_title')}
        img={{ src: InstanceImageSrc }}
        orderButtonLabel={t('common:create_instance')}
        onOrderButtonClick={createInstance}
        description={
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-8 block"
            >
              {t('not_created_message')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._500}
              className="mt-8 block"
            >
              {t('content_message_1')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-4 block"
            >
              {t('content_message_2')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              className="mt-8 block"
            >
              {t('advice_message')}
            </OsdsText>
          </>
        }
      >
        {GUIDES.map((guide) => (
          <Card
            key={guide.id}
            href={guide.links[ovhSubsidiary] ?? (guide.links.DEFAULT as string)}
            texts={{
              title: t(`${guide.id}_title`),
              description: t(`${guide.id}_description`),
              category: t('guide_title'),
            }}
          />
        ))}
      </OnboardingLayout>
    </PageLayout>
  );
};

export default Onboarding;
