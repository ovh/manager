import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import { ExternalLink } from 'lucide-react';
import RouteModal from '@/components/route-modal/RouteModal';
import { useS3Data } from '../../S3.context';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useCreateStorageJob } from '@/data/hooks/storage-job/useCreateStorageJob.hook';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';

const StorageJobModal = () => {
  const { t } = useTranslation(
    'pci-object-storage/storages/s3/replication/storage-job',
  );
  const { s3, s3Query } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const locale = useLocale();
  const hasReplicationRules = (s3?.replication?.rules?.length ?? 0) > 0;

  const { createStorageJob, isPending } = useCreateStorageJob({
    onError: (err) => {
      toast.toast({
        title: t('storageJobToastErrorTitle'),
        variant: 'critical',
        description: t('storageJobToastErrorMessage', {
          message: getObjectStoreApiErrorMessage(err),
        }),
      });
      navigate('../');
    },
    onSuccess: () => {
      toast.toast({
        title: t('storageJobToastSuccessTitle'),
        description: t('storageJobToastSuccessMessage'),
      });
      navigate('../');
    },
  });

  const handleConfirm = () => {
    if (!projectId || !s3?.region || !s3?.name) return;

    createStorageJob({
      projectId,
      region: s3.region,
      name: s3.name,
    });
  };

  return (
    <RouteModal isLoading={s3Query.isLoading}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="storage-job-modal" >
            {t('storageJobTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            {t('storageJobDescription')}{' '}
            <A
              href={getGuideUrl(GUIDES.STORAGE_ASYNC_REPLICATION, locale)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="inline-flex items-center gap-1">
                {t('storageJobDescriptionLink')}
                <ExternalLink className="size-4" />
              </span>
            </A>
          </DialogDescription>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" mode="ghost" disabled={isPending}>
              {t('storageJobButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || !hasReplicationRules}
            data-testid="storage-job-confirm-button"
          >
            {t('storageJobButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default StorageJobModal;
