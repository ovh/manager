import { useTranslation } from 'react-i18next';
import { ArrowUpRightFromSquare, Info } from 'lucide-react';
import { useNotebookData } from '../Notebook.context';
import A from '@/components/links/A.component';
import { Button } from '@/components/ui/button';
import VolumesList from './_components/VolumesListTable.component';
import * as ai from '@/types/cloud/project/ai';
import DataSync from './_components/DataSync.component';
import { useModale } from '@/hooks/useModale';
import { isDataSyncNotebook } from '@/lib/notebookHelper';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-notebooks/notebooks/notebook/attached-data"
    />
  );
}

const AttachedData = () => {
  const { notebook, notebookQuery } = useNotebookData();
  const { t } = useTranslation(
    'pci-ai-notebooks/notebooks/notebook/attached-data',
  );
  const volumeInfoLink = 'https://docs.ovh.com/gb/en/publiccloud/ai/data/';
  const dataSyncModale = useModale('datasyncglobal');
  return (
    <>
      <h4>{t('attachedDataTitle')}</h4>
      <p>{t('attachedDataDescription')}</p>
      <A href={volumeInfoLink} target="_blank" rel="noopener noreferrer">
        <div className="flex flex-row gap-1 items-center">
          <p>{t('attachedDataInfoLink')}</p>
          <ArrowUpRightFromSquare className="size-4" />
        </div>
      </A>
      {!isDataSyncNotebook(notebook.status.state) && (
        <div className="flex flex-row items-center gap-2">
          <Info className="size-4" />
          <p>{t('synchDataButtonHelper')}</p>
        </div>
      )}
      <div className="flex flex-row gap-3 mt-2">
        <Button
          data-testid="general-data-sync-button"
          size="sm"
          type="button"
          className="text-base"
          onClick={() => dataSyncModale.open()}
          disabled={!isDataSyncNotebook(notebook.status.state)}
        >
          {t('synchroniseDataButton')}
        </Button>
      </div>
      <VolumesList
        volumes={notebook.spec.volumes.filter(
          (vol: ai.volume.Volume) => vol.dataStore.internal === false,
        )}
      />
      <DataSync
        controller={dataSyncModale.controller}
        onSuccess={() => {
          dataSyncModale.close();
          notebookQuery.refetch();
        }}
      />
    </>
  );
};

export default AttachedData;
