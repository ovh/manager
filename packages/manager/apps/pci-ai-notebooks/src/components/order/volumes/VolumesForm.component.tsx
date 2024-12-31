import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DataStoresWithContainers } from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
import { OrderVolumes } from '@/types/orderFunnel';
import OvhLink from '@/components/links/OvhLink.component';
import PublicGitForm from './PublicGitForm.component';
import ContainerForm from './ContainerForm.component';

interface VolumesFormProps {
  configuredVolumesList: DataStoresWithContainers[];
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const VolumeForm = React.forwardRef<HTMLInputElement, VolumesFormProps>(
  ({ configuredVolumesList, selectedVolumesList, onChange }) => {
    const { t } = useTranslation('pci-ai-notebooks/components/volumes');
    const { projectId } = useParams();

    return (
      <>
        <h5>{t('containerTitle')}</h5>
        {configuredVolumesList.length > 0 ? (
          <ContainerForm
            configuredVolumesList={configuredVolumesList}
            selectedVolumesList={selectedVolumesList}
            onChange={(newVolumeList) => {
              onChange(newVolumeList);
            }}
          />
        ) : (
          <div data-testid="no-datastore-info-container">
            <p>{t('noContainerDescription')}</p>
            <div className="flex flex-col gap-2 mt-2">
              <OvhLink
                data-testid="dashboard-datastore-link"
                application="public-cloud"
                path={`#/pci/projects/${projectId}/ai-dashboard`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('datastoreLinkLabel')}
              </OvhLink>
              <OvhLink
                data-testid="object-storage-link"
                application="public-cloud"
                path={`#/pci/projects/${projectId}/storages/objects`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('objectStorageLinkLabel')}
              </OvhLink>
            </div>
          </div>
        )}
        <h5>{t('publicGitRepoTitle')}</h5>
        <PublicGitForm
          selectedVolumesList={selectedVolumesList}
          onChange={(newVolumeList) => {
            onChange(newVolumeList);
          }}
        />
      </>
    );
  },
);

VolumeForm.displayName = 'VolumeForm';

export default VolumeForm;
