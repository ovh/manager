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
import { useUnshelveService } from '@/hooks/api/database/service/useUnshelveService.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetService } from '@/hooks/api/database/service/useGetService.hook';

const UnshelveService = () => {
  const { projectId, serviceId } = useParams();
  const serviceQuery = useGetService(projectId, serviceId);
  const navigate = useNavigate();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/unshelve',
  );
  const toast = useToast();

  const { unshelveService, isPending } = useUnshelveService({
    onError: (err) => {
      toast.toast({
        title: t('unshelveServiceToastErrorTitle'),
        variant: 'critical',
        description: getCdbApiErrorMessage(err),
      });
    },
    onUnshelveSuccess: () => {
      toast.toast({
        title: t('unshelveServiceToastSuccessTitle'),
        description: t('unshelveServiceToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const handleSubmit = () => {
    unshelveService({
      serviceId: serviceQuery.data.id,
      projectId,
      engine: serviceQuery.data.engine,
    });
  };

  return (
    <RouteModal isLoading={!serviceQuery.data?.id}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="unshelve-service-modal">
            {t('unshelveServiceTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('unshelveServiceDescription', {
              name: serviceQuery.data?.description,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('unshelveServiceButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            data-testid="unshelve-service-submit-button"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {t('unshelveServiceButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default UnshelveService;
