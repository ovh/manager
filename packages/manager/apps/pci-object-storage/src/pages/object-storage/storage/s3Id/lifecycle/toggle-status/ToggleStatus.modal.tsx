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
import storages from '@/types/Storages';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useToggleLifecycleStatus } from '@/data/hooks/lifecycle/useToggleLifecycleStatus.hook';
import { useGetS3Lifecycle } from '@/data/hooks/s3-storage/useGetS3Lifecycle.hook';
import { useS3Data } from '../../S3.context';

const ToggleLifecycleStatus = () => {
  const { t } = useTranslation(
    'pci-object-storage/storages/s3/lifecycle/toggle-status',
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

  const isCurrentlyEnabled =
    existingRule?.status === storages.LifecycleRuleStatusEnum.enabled;
  const willEnable = !isCurrentlyEnabled;

  const { toggleLifecycleStatus, isPending } = useToggleLifecycleStatus({
    onError: (err) => {
      toast.toast({
        title: t(
          willEnable
            ? 'toggleStatusToastErrorTitleEnable'
            : 'toggleStatusToastErrorTitleDisable',
        ),
        variant: 'critical',
        description: t('toggleStatusToastErrorMessage', {
          message: getObjectStoreApiErrorMessage(err),
        }),
      });
      navigate('../');
    },
    onSuccess: () => {
      toast.toast({
        title: t(
          willEnable
            ? 'toggleStatusToastSuccessTitleEnable'
            : 'toggleStatusToastSuccessTitleDisable',
        ),
        description: t(
          willEnable
            ? 'toggleStatusToastSuccessMessageEnable'
            : 'toggleStatusToastSuccessMessageDisable',
        ),
      });
      navigate('../');
    },
  });

  const handleConfirm = () => {
    if (!projectId || !s3?.region || !s3?.name || !decodedRuleId) return;

    toggleLifecycleStatus({
      projectId,
      region: s3.region,
      name: s3.name,
      ruleId: decodedRuleId,
      enable: willEnable,
    });
  };

  if (!existingRule && !lifecycleQuery.isLoading) navigate('./');

  return (
    <RouteModal isLoading={lifecycleQuery.isLoading}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="toggle-lifecycle-status-modal">
            {t(
              willEnable
                ? 'toggleStatusTitleEnable'
                : 'toggleStatusTitleDisable',
            )}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>
            <Trans
              i18nKey={
                willEnable
                  ? 'toggleStatusDescriptionEnable'
                  : 'toggleStatusDescriptionDisable'
              }
              ns="pci-object-storage/storages/s3/lifecycle/toggle-status"
              values={{ ruleName: existingRule?.id }}
              components={{
                strong: <strong className="font-semibold" />,
              }}
            />
          </p>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" mode="ghost" disabled={isPending}>
              {t('toggleStatusButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            data-testid="toggle-lifecycle-status-confirm-button"
          >
            {t(
              willEnable
                ? 'toggleStatusButtonConfirmEnable'
                : 'toggleStatusButtonConfirmDisable',
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ToggleLifecycleStatus;
