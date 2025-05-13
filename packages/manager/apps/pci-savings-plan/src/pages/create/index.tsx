import { Title } from '@ovh-ux/manager-react-components';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreatePlanFormContainer } from '@/components/CreatePlanForm/CreatePlanForm';

const CreateSavingsPlan = () => {
  const { t } = useTranslation('create');

  const { data: project } = useProject();

  const isDiscovery = isDiscoveryProject(project);
  return (
    <div className="max-w-5xl">
      <Title>{t('title')}</Title>
      <PciDiscoveryBanner project={project} />

      <CreatePlanFormContainer isDiscoveryProject={isDiscovery} />
    </div>
  );
};

export default CreateSavingsPlan;
