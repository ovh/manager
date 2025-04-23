import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Input,
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useToast,
} from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';
import { useRenameServiceForm } from './useRenameServiceForm';

interface RenameServiceProps {
  service: database.Service;
  onSuccess?: (service: database.Service) => void;
  onError?: (error: Error) => void;
}

const RenameService = ({ service, onError, onSuccess }: RenameServiceProps) => {
  // import translations
  const { projectId } = useParams();
  const track = useTrackAction();
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const toast = useToast();
  const form = useRenameServiceForm(service);
  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('renameServiceToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onEditSuccess: (renamedService) => {
      toast.toast({
        title: t('renameServiceToastSuccessTitle'),
        description: t('renameServiceToastSuccessDescription', {
          newName: renamedService.description,
        }),
      });
      if (onSuccess) {
        onSuccess(renamedService);
      }
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    track(TRACKING.renameService.confirm(service.engine));
    editService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        description: formValues.description,
      },
    });
  });

  return (
    <RouteModal isLoading={!service?.id}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="rename-service-modal">
            {t('renameServiceTitle')}
          </DialogTitle>
          <DialogDescription>{t('renameServiceDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('renameServiceNameInputLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="rename-service-input"
                      placeholder="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="rename-service-cancel-button"
                  type="button"
                  mode="outline"
                  onClick={() =>
                    track(TRACKING.renameService.cancel(service.engine))
                  }
                >
                  {t('renameServiceButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="rename-service-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t('renameServiceNameSubmit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default RenameService;
