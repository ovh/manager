import { CreatePlanFormContainer } from '@/components/CreatePlanForm/CreatePlanForm';
import Errors from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading';
import {
  PciDiscoveryBanner,
  Title,
  isDiscoveryProject,
  useProject,
} from '@ovhcloud/manager-components';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CreateSavingsPlan = () => {
  const { t } = useTranslation('create');
  const { data: project, isLoading, error } = useProject();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }
  if (error) {
    return <Errors error={error} />;
  }

  return (
    <div className="m-10 max-w-4xl">
      <Title>{t('title')}</Title>
      {isDiscoveryProject({ planCode: project?.planCode }) && (
        <PciDiscoveryBanner projectId={project.project_id} />
      )}
      <CreatePlanFormContainer />
    </div>
  );
};

export default CreateSavingsPlan;
