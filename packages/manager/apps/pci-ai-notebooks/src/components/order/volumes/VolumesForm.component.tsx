import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataStoresWithContainers } from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
import { OrderVolumes } from '@/types/orderFunnel';
import PublicGitForm from './PublicGitForm.component';
import ContainerForm from './ContainerForm.component';

interface VolumesFormProps {
  configuredVolumesList: DataStoresWithContainers[];
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const VolumeForm = React.forwardRef<HTMLInputElement, VolumesFormProps>(
  ({ configuredVolumesList, selectedVolumesList, onChange }, ref) => {
    const { t } = useTranslation('components/volumes');

    return (
      <>
        {configuredVolumesList.length > 0 && (
          <>
            <h5>{t('containerTitle')}</h5>
            <ContainerForm
              ref={ref}
              configuredVolumesList={configuredVolumesList}
              selectedVolumesList={selectedVolumesList}
              onChange={(newVolumeList) => {
                onChange(newVolumeList);
              }}
            />
          </>
        )}
        <h5>{t('publicGitRepoTitle')}</h5>
        <PublicGitForm
          ref={ref}
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
