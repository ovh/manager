import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useDataSync } from '@/hooks/api/ai/notebook/datasync/useDataSync.hook';
import { useNotebookData } from '../../Notebook.context';
import DataSyncModal from '@/components/dataSync/DataSync.component';

const DataSync = () => {
  const { volumeId } = useParams();
  const [volume, setVolume] = useState<ai.volume.VolumeStatus>();
  const { notebook, projectId } = useNotebookData();
  const { t } = useTranslation(
    'pci-ai-notebooks/notebooks/notebook/containers',
  );
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!volumeId) return;
    const volumeToSync: ai.volume.VolumeStatus = notebook.status.volumes.find(
      (vol: ai.volume.VolumeStatus) => vol.id === volumeId,
    );
    if (volumeId && !volumeToSync) navigate('../');
    setVolume(volumeToSync);
  }, [volumeId]);

  const { dataSync, isPending } = useDataSync({
    onError: (err) => {
      toast.toast({
        title: t('dataSyncToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      const toastdesc: string = volume
        ? t('dataSyncMountPathToastSuccessDescription', {
            name: volume.mountPath,
            interpolation: { escapeValue: false },
          })
        : t('dataSyncGlobalToastSuccessDescription');
      toast.toast({
        title: t('dataSyncToastSuccessTitle'),
        description: toastdesc,
      });
      navigate('../');
    },
  });

  const syncData = (dir: ai.volume.DataSyncEnum) => {
    const dataSyncValues: ai.volume.DataSyncSpec = {
      direction: dir,
    };
    if (volume) dataSyncValues.volume = volume.id;
    dataSync({
      projectId,
      notebookId: notebook.id,
      dataSyncSpec: dataSyncValues,
    });
  };

  return (
    <DataSyncModal
      onSubmitSync={(direction) => syncData(direction)}
      volume={volume}
      pending={isPending}
    />
  );
};

export default DataSync;
