import {
  PciDiscoveryBanner,
  Title,
  isDiscoveryProject,
  useProject,
} from '@ovhcloud/manager-components';
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { CreatePlanFormContainer } from '@/components/CreatePlanForm/CreatePlanForm';
import Loading from '@/components/Loading/Loading';

const CreateSavingsPlan = () => {
  const { t } = useTranslation('create');
  const { data: project, isLoading } = useProject();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="m-10 max-w-4xl">
      <Suspense fallback={<Loading />}>
        <Breadcrumb />
      </Suspense>
      <Title>{t('title')}</Title>
      {isDiscoveryProject({ planCode: project?.planCode }) && (
        <PciDiscoveryBanner projectId={project.project_id} />
      )}
      <CreatePlanFormContainer />
    </div>
  );
};

export default CreateSavingsPlan;
