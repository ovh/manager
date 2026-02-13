import { FC, useContext, useEffect, useMemo } from 'react';
import {
  BaseLayout,
  Card,
  OvhSubsidiary,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button, Text } from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TProject } from '@ovh-ux/manager-pci-common';
import { useHidePreloader } from '@/hooks/hidePreloader/useHidePreloader';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import InstanceImageSrc from '../../../../public/assets/instance.png';
import { GUIDES } from './onboarding.constants';
import { useInstances } from '@/data/hooks/instance/useInstances';
import { Spinner } from '@/components/spinner/Spinner.component';
import { useInstanceCreationPolling } from '@/data/hooks/operation/useInstanceCreationPolling';

const Onboarding: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([
    'onboarding',
    'common',
    'creation',
    NAMESPACES.ONBOARDING,
  ]);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser() as {
    ovhSubsidiary: OvhSubsidiary;
  };
  const project = useRouteLoaderData('root') as TProject | undefined;

  const {
    instancesCreationsCount,
    isPending: isPendingInstanceCreation,
  } = useInstanceCreationPolling();

  useHidePreloader();

  const { data, isLoading } = useInstances({
    limit: 20,
    sort: 'name',
    sortOrder: 'asc',
    filters: [],
  });
  const navigateToCreationPage = () => navigate('../new');

  const hasInstances = useMemo(
    () =>
      !!data?.length &&
      data.some((instance) => instance.taskState !== 'deleting'),
    [data],
  );

  useEffect(() => {
    if (hasInstances && !isPendingInstanceCreation && !instancesCreationsCount) {
      navigate('..');
    }
  }, [hasInstances, isPendingInstanceCreation, instancesCreationsCount, navigate]);

  if (isLoading) return <Spinner />;

  return (
    <BaseLayout
      breadcrumb={
        project && <Breadcrumb projectLabel={project.description ?? ''} />
      }
    >
      <main className="mx-auto mt-8 flex flex-col sm:px-10">
        <section
          className="flex max-w-4xl flex-col items-center self-center pt-6 text-center"
          aria-labelledby="onboarding-title"
        >
          <div className="flex justify-center">
            <img
              className="max-h-[150px]"
              src={InstanceImageSrc}
              alt="Instance Onboarding"
            />
          </div>
          <Text preset="heading-1" className="mt-8 text-center">
            {t('common:pci_instances_common_instances_title')}
          </Text>
          <>
            {isPendingInstanceCreation || instancesCreationsCount ? (
              <div className="mt-10 flex flex-col">
                <Text preset="label">
                  {t('creation:pci_instance_onboarding_page_creation_pending')}
                </Text>
                <div className="my-8">
                  <Spinner />
                </div>
              </div>
            ) : (
              <>
                <Text className="mt-10">
                  {t('pci_instances_onboarding_not_created_message')}
                </Text>
                <div className="mt-6">
                  <Text preset="label">
                    {t('pci_instances_onboarding_content_message_1')}
                  </Text>
                </div>
              </>
            )}

            <Text className="mt-4">
              {t('pci_instances_onboarding_content_message_2')}
            </Text>
            <Text className="mt-6">
              {t('pci_instances_onboarding_advice_message')}
            </Text>
          </>
          {!isPendingInstanceCreation && !instancesCreationsCount && (
            <Button size="md" className="mt-8" onClick={navigateToCreationPage}>
              {t('common:pci_instances_common_create_instance')}
            </Button>
          )}
        </section>

        <div className="grid grid-cols-1 gap-6 xs:pt-10 sm:grid-cols-2 sm:pt-20 md:grid-cols-3">
          {GUIDES.map((guide) => (
            <Card
              key={guide.id}
              href={
                guide.links[ovhSubsidiary] ?? (guide.links.DEFAULT as string)
              }
              texts={{
                title: t(`pci_instances_onboarding_${guide.id}_title`),
                description: t(
                  `pci_instances_onboarding_${guide.id}_description`,
                  {
                    defaultValue: '',
                  },
                ),

                category: t(`${NAMESPACES.ONBOARDING}:tutorial`),
              }}
            />
          ))}
        </div>
      </main>
    </BaseLayout>
  );
};

export default Onboarding;
