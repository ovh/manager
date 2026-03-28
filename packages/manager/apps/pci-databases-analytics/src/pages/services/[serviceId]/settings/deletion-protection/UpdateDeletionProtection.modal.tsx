import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import { useEditService } from '@/data/hooks/database/service/useEditService.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal.component';
import { useGetService } from '@/data/hooks/database/service/useGetService.hook';

const UpdateDeletionProtection = () => {
  const { projectId, serviceId } = useParams();
  const serviceQuery = useGetService(projectId, serviceId);
  const navigate = useNavigate();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/deletionProtection',
  );
  const toast = useToast();

  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('updateServiceToastErrorTitle'),
        variant: 'critical',
        description: getCdbApiErrorMessage(err),
      });
    },
    onEditSuccess: () => {
      toast.toast({
        title: t('updateServiceToastSuccessTitle'),
        description: t('updateServiceToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const handleSubmit = () => {
    editService({
      serviceId: serviceQuery.data.id,
      projectId,
      engine: serviceQuery.data.engine,
      data: {
        deletionProtection: !serviceQuery.data.deletionProtection,
      },
    });
  };

  return (
    <RouteModal isLoading={!serviceQuery.data?.id}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="deletion-protection-modal">
            {t('deletionProtectionTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deletionProtectionDescription')}
          </DialogDescription>
          <p>
            {serviceQuery.data?.deletionProtection
              ? t('deactivateProtection')
              : t('activateProtection')}
          </p>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('deletionProtectionButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            data-testid="deletion-protection-submit-button"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {serviceQuery.data?.deletionProtection
              ? t('deactivateDeletionProtection')
              : t('activateDeletionProtection')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateDeletionProtection;
