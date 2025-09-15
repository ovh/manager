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
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetService } from '@/hooks/api/database/service/useGetService.hook';

const DeletionProtection = () => {
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
        variant: 'destructive',
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
      <DialogContent>
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
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="outline">
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

export default DeletionProtection;
