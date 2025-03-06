import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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
import { useUpdateApp } from '@/hooks/api/ai/app/useUpdateApp.hook';
import * as ai from '@/types/cloud/project/ai';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DOCKER_CONFIG } from '@/configuration/docker-command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const UpdateDockerCommand = () => {
  const { app, projectId } = useAppData();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation('components/docker-command');

  const commandRules = z.string().regex(DOCKER_CONFIG.command.pattern, {
    message: t('formDockerCommandErrorPattern'),
  });
  const schema = z.object({
    dockerCommand: commandRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    dockerCommand: app.spec.command.join(' '),
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { updateApp, isPending } = useUpdateApp({
    onError: (err) => {
      toast.toast({
        title: t('updateDockerToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t('updateDockerToastSuccessTitle'),
        description: t('updateDockerToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    const updateAppInfo: ai.app.UpdateInput = {
      command: Array.from(
        new Set(
          formValues.dockerCommand
            .split(' ')
            .filter((cmd: string) => cmd.trim() !== ''),
        ),
      ),
    };
    updateApp({ projectId, appId: app.id, appInfo: updateAppInfo });
  });

  return (
    <RouteModal backUrl="../">
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle data-testid="update-docker-command-modal">
            {t('updateDockerCommandTitle')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <ScrollArea className="mx-2">
              <FormField
                control={form.control}
                name="dockerCommand"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row gap-2">
                      <FormLabel className="mt-2">
                        {t('commandInputLabel')}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4 mt-1" />
                        </PopoverTrigger>
                        <PopoverContent className="text-sm">
                          <p>{t('commandInputHelper')}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormControl>
                      <Input data-testid="command-input-field" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="update-resources-cancel-button"
                  type="button"
                  variant="outline"
                >
                  {t('updateDockerCommandButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="update-resources-submit-button"
                type="submit"
                disabled={isPending}
              >
                {t('updateDockerCommandButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default UpdateDockerCommand;
