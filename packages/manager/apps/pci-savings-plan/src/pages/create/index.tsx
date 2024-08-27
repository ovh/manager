import {
  PciDiscoveryBanner,
  Title,
  isDiscoveryProject,
  useProject,
} from '@ovhcloud/manager-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreatePlanFormContainer } from '@/components/CreatePlanForm/CreatePlanForm';

const CreateSavingsPlan = () => {
  const { t } = useTranslation('create');

  const { data: project } = useProject();

  return (
    <div className="max-w-4xl">
      <Title>{t('title')}</Title>
      {isDiscoveryProject({ planCode: project?.planCode }) && (
        <PciDiscoveryBanner projectId={project.project_id} />
      )}

      <CreatePlanFormContainer />
    </div>
  );
};

export default CreateSavingsPlan;
