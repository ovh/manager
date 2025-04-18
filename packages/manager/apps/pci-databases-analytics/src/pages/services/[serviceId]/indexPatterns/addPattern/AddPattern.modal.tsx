import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import { useAddPattern } from '@/hooks/api/database/pattern/useAddPattern.hook';
import { useServiceData } from '../../Service.context';
import { PATTERN_CREATION } from './pattern.constants';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import RouteModal from '@/components/route-modal/RouteModal';

const AddPattern = () => {
  const { projectId } = useServiceData();
  const { service } = useServiceData();
  const navigate = useNavigate();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/indexPatterns',
  );
  const toast = useToast();
  const { addPattern, isPending } = useAddPattern({
    onError: (err) => {
      toast.toast({
        title: t('addPatternToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: (addedPattern) => {
      toast.toast({
        title: t('addPatternToastSuccessTitle'),
        description: t('addPatternToastSuccessDescription', {
          name: addedPattern.pattern,
        }),
      });
      navigate('../');
    },
  });
  // define the schema for the form
  const schema = z.object({
    pattern: z
      .string()
      .min(PATTERN_CREATION.pattern.min, {
        message: t('addPatternErrorMinLength', {
          min: PATTERN_CREATION.pattern.min,
        }),
      })
      .max(PATTERN_CREATION.pattern.max, {
        message: t('addPatternErrorMaxLength', {
          max: PATTERN_CREATION.pattern.max,
        }),
      })
      .regex(PATTERN_CREATION.pattern.pattern, {
        message: t('addPatternErrorFormat'),
      }),
    maxIndexCount: z.coerce
      .number()
      .int()
      .min(PATTERN_CREATION.maxIndexCount.min, {
        message: t('addPatternErrorMin', {
          min: PATTERN_CREATION.maxIndexCount.min,
        }),
      })
      .max(PATTERN_CREATION.maxIndexCount.max, {
        message: t('addPatternErrorMax', {
          max: PATTERN_CREATION.maxIndexCount.max,
        }),
      })
      .step(1),
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
    <RouteModal isLoading={!service}>
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
                  mode="outline"
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
    </RouteModal>
  );
};

export default AddPattern;
