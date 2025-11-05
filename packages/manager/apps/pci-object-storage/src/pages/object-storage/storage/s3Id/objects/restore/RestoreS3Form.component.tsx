import {
  Input,
  DialogFooter,
  DialogClose,
  Button,
  FormDescription,
  FieldLabel,
  Alert,
  AlertDescription,
} from '@datatr-ux/uxlib';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  FormProvider,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useMemo } from 'react';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { FormField } from '@/components/form-field/FormField.component';

const RESTORE_MIN_DAYS = 1;
const RESTORE_MAX_DAYS = 30;
const RESTORE_DEFAULT_DAYS = 7;

interface RestoreS3FormProps {
  onSubmit: SubmitHandler<{
    days: number;
  }>;
  onError: SubmitErrorHandler<{
    days: number;
  }>;
  initialValue?: {
    days: number;
  };
  currentExpireDate?: string;
}
const RestoreS3Form = ({
  onSubmit,
  onError,
  initialValue,
  currentExpireDate,
}: RestoreS3FormProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');

  // Calculate minimum days based on current expiration
  const calculateMinDays = () => {
    if (!currentExpireDate) return RESTORE_MIN_DAYS;

    const now = new Date();
    const expireDate = new Date(currentExpireDate);
    const daysRemaining = Math.ceil(
      (expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return Math.max(RESTORE_MIN_DAYS, daysRemaining);
  };

  const minDays = calculateMinDays();

  const schema = useMemo(
    () =>
      z.object({
        days: z.coerce
          .number({
            required_error: t('restoreDaysRequiredError'),
            invalid_type_error: t('restoreDaysInvalidError'),
          })
          .int({ message: t('restoreDaysIntegerError') })
          .min(minDays, {
            message: currentExpireDate
              ? t('restoreDaysMinErrorExtend', { days: minDays })
              : t('restoreDaysMinError'),
          })
          .max(RESTORE_MAX_DAYS, { message: t('restoreDaysMaxError') })
          .positive({ message: t('restoreDaysPositiveError') }),
      }),
    [minDays, currentExpireDate, t],
  );

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues = useMemo(
    () =>
      initialValue ?? {
        days: currentExpireDate ? minDays : RESTORE_DEFAULT_DAYS,
      },
    [initialValue, currentExpireDate, minDays],
  );

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-2 px-6"
      >
        {currentExpireDate && (
          <Alert>
            <AlertDescription>
              {t('restoreCurrentExpireInfo')}{' '}
              <FormattedDate
                date={new Date(currentExpireDate)}
                options={{
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }}
              />
            </AlertDescription>
          </Alert>
        )}
        <FormField form={form} name="days">
          {(field) => (
            <>
              <FieldLabel>{t('restoreDaysLabel')}</FieldLabel>
              <Input type="number" placeholder={String(minDays)} {...field} />
              <FormDescription>
                {currentExpireDate
                  ? t('restoreDaysDescriptionExtend')
                  : t('restoreDaysDescription')}
              </FormDescription>
            </>
          )}
        </FormField>
        <DialogFooter className="flex justify-end">
          {' '}
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('restoreButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="submit">{t('restoreButtonConfirm')}</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
};

export default RestoreS3Form;
