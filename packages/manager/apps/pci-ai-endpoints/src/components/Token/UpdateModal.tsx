import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { OsdsModal, OsdsDatepicker } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  Text,
  Badge,
  Textarea,
  Input,
} from '@ovhcloud/ods-react';
import getLocaleForDatePicker from '@/components/utils/getLocaleForDatepicker';

type UpdateModalProps = {
  onClose: () => void;
  initialValues: {
    tokenName: string;
    description: string;
    expirationDate?: Date;
  };
  onSubmit: (payload: {
    tokenName: string;
    description: string;
    expirationDate: Date;
  }) => void;
  infiniteDate: Date;
};

type FormValues = {
  tokenName: string;
  description: string;
  expirationDate: Date;
  isChecked: boolean;
};

export default function UpdateModal({
  onClose,
  initialValues,
  onSubmit,
  infiniteDate,
}: UpdateModalProps) {
  const { t } = useTranslation('token');
  const localDatePicker = getLocaleForDatePicker();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isExpirationDefined =
    initialValues.expirationDate &&
    initialValues.expirationDate.getTime() !== infiniteDate.getTime();

  const { control, handleSubmit, watch, setValue, reset } = useForm<FormValues>(
    {
      defaultValues: {
        tokenName: initialValues.tokenName,
        description: initialValues.description,
        expirationDate: initialValues.expirationDate || infiniteDate,
        isChecked: !!isExpirationDefined,
      },
      mode: 'onChange',
    },
  );

  useEffect(() => {
    reset({
      tokenName: initialValues.tokenName,
      description: initialValues.description,
      expirationDate: initialValues.expirationDate || infiniteDate,
      isChecked: !!(
        initialValues.expirationDate &&
        initialValues.expirationDate.getTime() !== infiniteDate.getTime()
      ),
    });
  }, [initialValues, infiniteDate, reset]);

  const isChecked = watch('isChecked'); // getValue
  const expirationDate = watch('expirationDate'); // getValue

  useEffect(() => {
    if (!isChecked) {
      setValue('expirationDate', infiniteDate);
    }
  }, [isChecked, infiniteDate, setValue]);

  const displayChipValue = useMemo(() => {
    return expirationDate.getTime() === infiniteDate.getTime()
      ? t('ai_endpoints_token_expiration')
      : expirationDate.toLocaleDateString();
  }, [expirationDate, infiniteDate, t]);

  const modalHeadline = t('ai_endpoints_token_update');
  const actionLabel = t('ai_endpoints_token_udpate_confirm');
  const checkboxLabel = t('ai_endpoints_token_expiration_date_update');

  const onFormSubmit = (data: FormValues) => {
    onSubmit({
      tokenName: data.tokenName,
      description: data.description,
      expirationDate: data.expirationDate,
    });
    onClose();
  };

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={onClose}
      headline={modalHeadline}
    >
      <FormField>
        <Text preset="paragraph" className="mt-6">
          {t('ai_endpoints_token_name')}
        </Text>
        <Controller
          control={control}
          name="tokenName"
          render={({ field: { value } }) => (
            <Input
              aria-label="token-name-input"
              color={ODS_THEME_COLOR_INTENT.primary}
              type="text"
              value={value || ''}
              disabled
              className="max-w-[23.125rem] mt-2"
            />
          )}
        />
      </FormField>
      <FormField>
        <Text preset="paragraph" className="flex mt-6">
          {t('ai_endpoints_token_description')}
        </Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Textarea
              aria-label={t('ai_endpoints_token_description')}
              rows={5}
              placeholder={t('ai_endpoints_token_description_placeholder')}
              className="mt-2"
              value={value || ''}
              onChange={(event) => {
                onChange(event.target.value);
              }}
              onBlur={onBlur}
              ref={ref}
            />
          )}
        />
      </FormField>
      <FormField className="mt-2">
        <Text preset="paragraph" className="mt-6">
          <span className="pr-4">{t('ai_endpoints_token_expires')}</span>
          <Badge
            className="inline-flex max-w-fit justify-center"
            color="information"
          >
            {displayChipValue}
          </Badge>
        </Text>
      </FormField>
      <FormField>
        <Controller
          control={control}
          name="isChecked"
          render={({ field: { value, onChange } }) => (
            <Checkbox
              checked={value}
              onCheckedChange={(e) => onChange(e.checked)}
              className="mt-2 -ml-2 max-w-fit"
            >
              <CheckboxControl />
              <CheckboxLabel>
                <Text>{checkboxLabel}</Text>
              </CheckboxLabel>
            </Checkbox>
          )}
        />
      </FormField>
      {isChecked && (
        <FormField>
          <Controller
            control={control}
            name="expirationDate"
            render={({ field }) => (
              <OsdsDatepicker
                onOdsDatepickerValueChange={(e) =>
                  field.onChange(e.detail.value || infiniteDate)
                }
                minDate={tomorrow}
                locale={localDatePicker}
                className="max-w-[294px] mt-4"
                value={
                  field.value.getTime() === infiniteDate.getTime()
                    ? undefined
                    : field.value
                }
              />
            )}
          />
        </FormField>
      )}
      <Button slot="actions" onClick={handleSubmit(onFormSubmit)}>
        {actionLabel}
      </Button>
    </OsdsModal>
  );
}
