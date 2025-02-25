import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { DataStoresWithContainers } from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
import { OrderVolumes } from '@/types/orderFunnel';
import PublicGitForm from './PublicGitForm.component';
import ContainerForm from './ContainerForm.component';
import OvhLink from '@/components/links/OvhLink.component';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { Label } from '@/components/ui/label';

interface VolumesFormProps {
  configuredVolumesList: DataStoresWithContainers[];
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const VolumeForm = React.forwardRef<HTMLInputElement, VolumesFormProps>(
  ({ configuredVolumesList, selectedVolumesList, onChange }, ref) => {
    const { t } = useTranslation('components/volumes');
    const { projectId } = useParams();
    const locale = useLocale();

    return (
      <>
        <Label className="scroll-m-20 text-xl font-semibold">
          {t('fieldVolumesLabel')}
        </Label>
        <p>
          {t('fieldVolumeDescription1')}{' '}
          <OvhLink
            application="public-cloud"
            path={`#/pci/projects/${projectId}/ai/dashboard/datastore`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('fieldVolumeDashboardLink')}
            <ArrowRight className="size-4 inline ml-1" />
          </OvhLink>
        </p>
        <p>{t('fieldVolumeDescription2')}</p>
        <A
          href={getGuideUrl(GUIDES.HOW_TO_MANAGE_DATA, locale)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('fieldVolumeLink')}
          <ArrowRight className="size-4 inline ml-1" />
        </A>
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
