import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import {
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useDeleteLifecycle } from '@/data/hooks/lifecycle/useDeleteLifecycle.hook';
import { useGetS3Lifecycle } from '@/data/hooks/s3-storage/useGetS3Lifecycle.hook';
import { useS3Data } from '../../S3.context';

const DeleteLifecycle = () => {
  const { t } = useTranslation(
    'pci-object-storage/storages/s3/lifecycle/delete',
  );
  const { s3 } = useS3Data();
  const toast = useToast();
  const navigate = useNavigate();
  const { projectId, ruleId } = useParams();

  const decodedRuleId = ruleId ? decodeURIComponent(ruleId) : '';

  const lifecycleQuery = useGetS3Lifecycle({
    projectId,
    region: s3?.region,
    name: s3?.name,
  });

  const existingRule = lifecycleQuery.data?.rules?.find(
    (rule) => rule.id === decodedRuleId,
  );

  const { deleteLifecycle, isPending } = useDeleteLifecycle({
    onError: (err) => {
      toast.toast({
        title: t('deleteLifecycleToastErrorTitle'),
        variant: 'critical',
        description: t('deleteLifecycleToastErrorMessage', {
          message: getObjectStoreApiErrorMessage(err),
        }),
      });
      navigate('../');
    },
    onSuccess: () => {
      toast.toast({
        title: t('deleteLifecycleToastSuccessTitle'),
        description: t('deleteLifecycleToastSuccessMessage'),
      });
      navigate('../');
    },
  });

  const handleConfirm = () => {
    if (!projectId || !s3?.region || !s3?.name || !decodedRuleId) return;

    deleteLifecycle({
      projectId,
      region: s3.region,
      name: s3.name,
      ruleId: decodedRuleId,
    });
  };

  if (!existingRule && !lifecycleQuery.isLoading) navigate('./');

  return (
    <RouteModal isLoading={lifecycleQuery.isLoading}>
      <DialogContent variant="warning">
        <DialogHeader>
          <DialogTitle data-testid="delete-lifecycle-modal">
            {t('deleteLifecycleTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>
            <Trans
              i18nKey="deleteLifecycleDescription"
              ns="pci-object-storage/storages/s3/lifecycle/delete"
              values={{ decodedRuleId }}
              components={{
                strong: <strong className="font-semibold" />,
              }}
            />
          </p>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" mode="ghost" disabled={isPending}>
              {t('deleteLifecycleButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            data-testid="delete-lifecycle-confirm-button"
          >
            {t('deleteLifecycleButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteLifecycle;
