import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useAppData } from '../../App.context';
import DataSyncModal from '@/components/dataSync/DataSync.component';
import { useDataSync } from '@/data/hooks/ai/app/datasync/useDataSync.hook';

const DataSync = () => {
  const { volumeId } = useParams();
  const [volume, setVolume] = useState<ai.volume.VolumeStatus>();
  const { app, projectId } = useAppData();
  const { t } = useTranslation('ai-tools/components/containers');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!volumeId) return;
    const volumeToSync: ai.volume.VolumeStatus = app.status.volumes.find(
      (vol: ai.volume.VolumeStatus) => vol.id === volumeId,
    );
    if (volumeId && !volumeToSync) navigate('../');
    setVolume(volumeToSync);
  }, [volumeId]);

  const { dataSync, isPending } = useDataSync({
    onError: (err) => {
      toast.toast({
        title: t('containerToastErrorTitle'),
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
        title: t('containerToastSuccessTitle'),
        description: toastdesc,
      });
      navigate('../');
    },
  });

  const syncData = (dir: ai.volume.DataSyncEnum) => {
    const dataSyncValues: Omit<ai.volume.DataSyncSpec, 'manual'> = {
      direction: dir,
    };
    if (volume) dataSyncValues.volume = volume.id;
    dataSync({
      projectId,
      appId: app.id,
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
