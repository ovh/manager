import {
  PciDiscoveryBanner,
  Title,
  isDiscoveryProject,
  useProject,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreatePlanFormContainer } from '@/components/CreatePlanForm/CreatePlanForm';

const CreateSavingsPlan = () => {
  const { t } = useTranslation('create');

  const { data: project } = useProject();

  const isDiscovery = isDiscoveryProject({ planCode: project?.planCode });
  return (
    <div className="max-w-4xl">
      <Title>{t('title')}</Title>
      {isDiscovery && <PciDiscoveryBanner projectId={project.project_id} />}

      <CreatePlanFormContainer isDiscoveryProject={isDiscovery} />
    </div>
  );
};

export default CreateSavingsPlan;
