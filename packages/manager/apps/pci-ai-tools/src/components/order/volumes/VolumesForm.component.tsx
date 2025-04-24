import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Label } from '@datatr-ux/uxlib';
import { OrderVolumes } from '@/types/orderFunnel';
import PublicGitForm from './PublicGitForm.component';
import ContainerForm from './ContainerForm.component';
import OvhLink from '@/components/links/OvhLink.component';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { DataStoresWithContainers } from '@/data/hooks/ai/data/useGetDatastoresWithContainers.hook';

interface VolumesFormProps {
  configuredVolumesList: DataStoresWithContainers[];
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const VolumeForm = React.forwardRef<HTMLInputElement, VolumesFormProps>(
  ({ configuredVolumesList, selectedVolumesList, onChange }, ref) => {
    const { t } = useTranslation('ai-tools/components/volumes');
    const { projectId } = useParams();
    const locale = useLocale();

    return (
      <>
        <Label className="scroll-m-20 text-xl font-bold">
          {t('fieldVolumesLabel')}
        </Label>
        <p>
          {t('fieldVolumeDescription1')}{' '}
          <OvhLink
            application="public-cloud"
            path={`#/pci/projects/${projectId}/ai-ml/dashboard/datastore`}
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
        <div>
          {configuredVolumesList.length > 0 && (
            <>
              <Label className="text-lg font-semibold">
                {t('containerTitle')}
              </Label>
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
        </div>

        <div>
          <Label className="text-lg font-semibold">
            {t('publicGitRepoTitle')}
          </Label>
          <PublicGitForm
            ref={ref}
            selectedVolumesList={selectedVolumesList}
            onChange={(newVolumeList) => {
              onChange(newVolumeList);
            }}
          />
        </div>
      </>
    );
  },
);

VolumeForm.displayName = 'VolumeForm';

export default VolumeForm;
