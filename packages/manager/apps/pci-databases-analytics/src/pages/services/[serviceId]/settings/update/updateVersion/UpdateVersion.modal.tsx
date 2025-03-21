import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
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
import VersionSelector from '@/components/order/engine/EngineTileVersion.component';
import * as database from '@/types/cloud/project/database';
import { Engine } from '@/types/orderFunnel';
import { useServiceData } from '@/pages/services/[serviceId]/Service.context';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useGetAvailabilities } from '@/hooks/api/database/availability/useGetAvailabilities.hook';
import { useUpdateTree } from '../_components/useUpdateTree';
import RouteModal from '@/components/route-modal/RouteModal';

const UpdateVersion = () => {
  const { service, projectId } = useServiceData();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.version,
  );
  const { editService, isPending } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('updateVersionToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onEditSuccess: (updatedService) => {
      toast.toast({
        title: t('updateVersionToastSuccessTitle'),
        description: t('updateVersionToastSuccessDescription', {
          newVersion: updatedService.version,
        }),
      });
      navigate('../');
    },
  });

  const listVersions =
    useUpdateTree(availabilitiesQuery.data)?.find(
      (e: Engine) => e.name === service.engine,
    )?.versions || [];

  const schema = z.object({
    version: z
      .string()
      .min(1)
      .refine((newVersion) => newVersion !== service.version, {
        message: t('updateVersionErrorSimilar'),
      }),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      version: service.version,
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    editService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        version: formValues.version,
      },
    });
  });

  return (
    <RouteModal isLoading={!listVersions}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle data-testid="update-version-modal">
                {t('updateVersionTitle')}
              </DialogTitle>
            </DialogHeader>
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('updateVersionInputLabel')}</FormLabel>
                  <FormControl>
                    <VersionSelector
                      isEngineSelected
                      versions={listVersions}
                      selectedVersion={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end mt-2">
              <DialogClose asChild>
                <Button
                  data-testid="update-version-cancel-button"
                  type="button"
                  mode="outline"
                >
                  {t('updateVersionCancelButton')}
                </Button>
              </DialogClose>
              <Button
                data-testid="update-version-submit-button"
                disabled={isPending}
              >
                {t('updateVersionSubmitButton')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateVersion;
