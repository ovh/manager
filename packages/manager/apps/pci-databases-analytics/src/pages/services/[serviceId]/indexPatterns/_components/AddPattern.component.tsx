import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as database from '@/types/cloud/project/database';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalController } from '@/hooks/useModale';
import { useToast } from '@/components/ui/use-toast';
import { useAddPattern } from '@/hooks/api/database/pattern/useAddPattern.hook';
import { useServiceData } from '../../Service.context';

interface AddPatternModalProps {
  service: database.Service;
  controller: ModalController;
  onSuccess?: (pattern: database.opensearch.Pattern) => void;
  onError?: (error: Error) => void;
}

const AddPattern = ({
  service,
  controller,
  onError,
  onSuccess,
}: AddPatternModalProps) => {
  const { projectId } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const toast = useToast();
  const { addPattern, isPending } = useAddPattern({
    onError: (err) => {
      toast.toast({
        title: t('addPatternToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.details.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (addedPattern) => {
      toast.toast({
        title: t('addPatternToastSuccessTitle'),
        description: t('addPatternToastSuccessDescription', {
          name: addedPattern.pattern,
        }),
      });
      if (onSuccess) {
        onSuccess(addedPattern);
      }
    },
  });
  // define the schema for the form
  const schema = z.object({
    pattern: z
      .string()
      .min(3, {
        message: t('addPatternErrorMinLength', { min: 1 }),
      })
      .max(1024, {
        message: t('addPatternErrorMaxLength', { max: 1024 }),
      })
      .regex(/^[A-Za-z0-9-_.*?]+$/, {
        message: t('addPatternErrorFormat'),
      }),
    maxIndexCount: z.coerce
      .number()
      .int()
      .min(0, {
        message: t('addPatternErrorMin', { min: 0 }),
      })
      .max(9223372036854776000, {
        message: t('addPatternErrorMax', { max: 9223372036854776000 }),
      }),
  });
  // generate a form controller
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      pattern: '',
      maxIndexCount: 0,
    },
  });

  const onSubmit = form.handleSubmit((formValues) => {
    addPattern({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      pattern: {
        pattern: formValues.pattern,
        maxIndexCount: formValues.maxIndexCount || 0,
      },
    });
  });

  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="add-pattern-modal">
            {t('addPatternTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm flex flex-col gap-2">
          <p>{t('addPatternDescription1')}</p>
          <p>{t('addPatternDescription2')}</p>
          <p>{t('addPatternDescriptionExemples')}</p>
          <ul className="list-disc pl-8">
            <li>
              <Trans
                t={t}
                i18nKey={'addPatternDescriptionExemple1'}
                components={{
                  anchor: <strong />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                t={t}
                i18nKey={'addPatternDescriptionExemple2'}
                components={{
                  anchor: <strong />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                t={t}
                i18nKey={'addPatternDescriptionExemple3'}
                components={{
                  anchor: <strong />,
                }}
              ></Trans>
            </li>
            <li>
              <Trans
                t={t}
                i18nKey={'addPatternDescriptionExemple4'}
                components={{
                  anchor: <strong />,
                }}
              ></Trans>
            </li>
          </ul>
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4">
            <FormField
              control={form.control}
              name="pattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('addPatternInputPatternLabel')}</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="add-pattern-pattern-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxIndexCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('addPatternInpuMaxIndexCountLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-testid="add-pattern-maxIndexCount-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  data-testid="add-pattern-cancel-button"
                >
                  {t('addPatternButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                data-testid="add-pattern-submit-button"
              >
                {t('addPatternButtonAdd')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPattern;
