import { Input, FieldLabel, FieldDescription } from '@datatr-ux/uxlib';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useMemo } from 'react';
import { FormField } from '@/components/form-field/FormField.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';

const RESTORE_MIN_DAYS = 1;
const RESTORE_MAX_DAYS = 30;
const RESTORE_DEFAULT_DAYS = 7;

interface RestoreS3FormProps {
  formId: string;
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
  formId,
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

  const days = form.watch('days') ?? defaultValues.days;
  const now = new Date();
  const availableUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit, onError)}
      className="flex flex-col gap-2"
    >
      <FormField form={form} name="days">
        {(field) => (
          <>
            <FieldLabel>{t('restoreDaysLabel')}</FieldLabel>
            <Input
              type="number"
              placeholder={String(minDays)}
              {...field}
              min={minDays}
              max={RESTORE_MAX_DAYS}
            />
            <FieldDescription>
              {currentExpireDate
                ? t('restoreDaysDescriptionExtend')
                : t('restoreDaysDescription')}
            </FieldDescription>
            <p className="mt-2">
              {t('restoreAvailableUntil')}{' '}
              <FormattedDate
                date={availableUntil}
                options={{
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }}
              />
            </p>
          </>
        )}
      </FormField>
    </form>
  );
};

export default RestoreS3Form;
