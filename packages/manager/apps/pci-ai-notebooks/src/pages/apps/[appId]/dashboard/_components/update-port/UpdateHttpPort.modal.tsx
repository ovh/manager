import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import * as ai from '@/types/cloud/project/ai';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useAppData } from '../../../App.context';
import RouteModal from '@/components/route-modal/RouteModal';
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_CONFIG } from '@/configuration/app';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUpdateApp } from '@/hooks/api/ai/app/useUpdateApp.hook';

const UpdateHttpPort = () => {
  const { app, projectId } = useAppData();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('pci-ai-deploy/apps/app/dashboard/update-port');

  const schema = z.object({
    httpPort: z.coerce
      .number()
      .min(APP_CONFIG.port.min)
      .max(APP_CONFIG.port.max),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    httpPort: app.spec.defaultHttpPort,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { updateApp, isPending } = useUpdateApp({
    onError: (err) => {
      toast.toast({
        title: t('updatePortToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t('updatePortToastSuccessTitle'),
        description: t('updatePortToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const updateAppInfo: ai.app.UpdateInput = {
      defaultHttpPort: formValues.httpPort,
    };
    updateApp({ projectId, appId: app.id, appInfo: updateAppInfo });
  });

  return (
    <RouteModal backUrl="../">
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="update-port-modal">
            {t('updatePortTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <p className="mx-2 text-sm">{t('updateHttpPortDesc1')}</p>
            {app.spec.scalingStrategy.automatic?.replicasMin && (
              <p className="mx-2 text-sm">{t('updateHttpPortDesc2')}</p>
            )}
            <FormField
              control={form.control}
              name="httpPort"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center gap-2">
                    <FormLabel className="font-semibold">
                      {t('fieldHttpPortLabel')}
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        {t('httpPortInfo')}
                      </PopoverContent>
                    </Popover>
                  </div>

                  <FormControl>
                    <Input
                      type="number"
                      max={APP_CONFIG.port.max}
                      min={APP_CONFIG.port.min}
                      value={field.value}
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
                  data-testid="update-port-cancel-button"
                  type="button"
                  variant="outline"
                >
                  {t('updatePortButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="update-port-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t('updatePortButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateHttpPort;
