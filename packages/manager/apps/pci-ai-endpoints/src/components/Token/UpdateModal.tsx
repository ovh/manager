import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  OsdsModal,
  OsdsButton,
  OsdsFormField,
  OsdsText,
  OsdsInput,
  OsdsTextarea,
  OsdsDatepicker,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_CHIP_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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
      <OsdsFormField>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-6"
          slot="label"
        >
          {t('ai_endpoints_token_name')}
        </OsdsText>
        <Controller
          control={control}
          name="tokenName"
          render={({ field: { value } }) => (
            <OsdsInput
              ariaLabel="token-name-input"
              color={ODS_THEME_COLOR_INTENT.primary}
              type={ODS_INPUT_TYPE.text}
              value={value || ''}
              disabled
              className="max-w-[23.125rem] mt-2"
            />
          )}
        />
      </OsdsFormField>
      <OsdsFormField>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="flex mt-6"
          slot="label"
        >
          {t('ai_endpoints_token_description')}
        </OsdsText>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <OsdsTextarea
              ariaLabel={t('ai_endpoints_token_description')}
              rows={5}
              placeholder={t('ai_endpoints_token_description_placeholder')}
              className="mt-2"
              value={value || ''}
              onOdsValueChange={(e: CustomEvent<{ value?: string }>) => {
                const newVal =
                  e.detail?.value ??
                  ((e.target as unknown) as HTMLTextAreaElement)?.value ??
                  '';
                onChange(newVal);
              }}
              onBlur={onBlur}
              ref={ref}
            />
          )}
        />
      </OsdsFormField>
      <OsdsFormField>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-6"
          slot="label"
        >
          <span className="pr-4">{t('ai_endpoints_token_expires')}</span>
          <OsdsChip
            className="inline-flex max-w-fit justify-center"
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_CHIP_SIZE.sm}
          >
            {displayChipValue}
          </OsdsChip>
        </OsdsText>
      </OsdsFormField>
      <OsdsFormField>
        <Controller
          control={control}
          name="isChecked"
          render={({ field: { value, onChange } }) => (
            <OsdsCheckbox
              checked={value}
              onOdsCheckedChange={(e) => onChange(e.detail.checked)}
              className="mt-2 -ml-2 max-w-fit"
            >
              <OsdsCheckboxButton
                size={ODS_CHECKBOX_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <span slot="end">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    level={ODS_TEXT_LEVEL.body}
                    size={ODS_TEXT_SIZE._400}
                  >
                    {checkboxLabel}
                  </OsdsText>
                </span>
              </OsdsCheckboxButton>
            </OsdsCheckbox>
          )}
        />
      </OsdsFormField>
      {isChecked && (
        <OsdsFormField>
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
        </OsdsFormField>
      )}
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        onClick={handleSubmit(onFormSubmit)}
      >
        {actionLabel}
      </OsdsButton>
    </OsdsModal>
  );
}
