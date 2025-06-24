import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  OsdsFormField,
  OsdsText,
  OsdsInput,
  OsdsTextarea,
  OsdsDatepicker,
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsButton,
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
import { z } from 'zod';
import getLocaleForDatePicker from '@/components/utils/getLocaleForDatepicker';
import { TokensPayload } from '@/types/cloud/project/database/token';

export type CreateFormProps = {
  projectId: string;
  tokens: string[];
  infiniteDate: Date;
  createToken: (payload: TokensPayload) => void;
  isRestricted: boolean;
  onClose: () => void;
};

type FormValues = {
  tokenName: string;
  description: string;
  expirationDate: Date;
  isChecked: boolean;
};

function createTokenSchema(tokens: string[], t: (key: string) => string) {
  return z.object({
    tokenName: z
      .string()
      .min(1, { message: t('ai_endpoints_token_name_required') })
      .regex(/^[A-Za-z0-9-]+$/, {
        message: t('ai_endpoints_token_invalid_format'),
      })
      .refine((v) => !tokens.includes(v.trim()), {
        message: t('ai_endpoints_token_name_error'),
      }),
    description: z.string(),
    expirationDate: z.date(),
    isChecked: z.boolean(),
  });
}

export default function CreateForm({
  projectId,
  tokens,
  infiniteDate,
  createToken,
  isRestricted,
  onClose,
}: CreateFormProps) {
  const { t } = useTranslation('token');
  const localDatePicker = getLocaleForDatePicker();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(createTokenSchema(tokens, t)),
    defaultValues: {
      tokenName: '',
      description: '',
      expirationDate: infiniteDate,
      isChecked: false,
    },
    mode: 'onChange',
  });

  const isChecked = watch('isChecked');
  const expirationDate = watch('expirationDate');

  useEffect(() => {
    if (!isChecked) {
      setValue('expirationDate', infiniteDate);
    }
  }, [isChecked, infiniteDate, setValue]);

  const onSubmit = (data: FormValues) => {
    const payload: TokensPayload = {
      projectId,
      name: data.tokenName,
      description: data.description,
      expiresAt: data.expirationDate.toISOString(),
    };
    createToken(payload);
  };

  useEffect(() => {
    if (isRestricted) {
      onClose();
    }
  }, [isRestricted, onClose]);

  const displayChipValue = useMemo(() => {
    return expirationDate.getTime() === infiniteDate.getTime()
      ? t('ai_endpoints_token_expiration')
      : expirationDate.toLocaleDateString();
  }, [expirationDate, infiniteDate, t]);

  return (
    <>
      <OsdsFormField>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text} slot="label">
          {t('ai_endpoints_token_name')}
        </OsdsText>
        <Controller
          name="tokenName"
          control={control}
          render={({ field }) => (
            <OsdsInput
              ariaLabel="token-name-input"
              color={
                errors.tokenName
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.primary
              }
              type={ODS_INPUT_TYPE.text}
              value={field.value}
              onOdsValueChange={(e) =>
                field.onChange(e.detail.value.slice(0, 60))
              }
              onBlur={field.onBlur}
              ref={field.ref}
              className="max-w-[23.125rem] mt-2"
            />
          )}
        />
        {errors.tokenName && (
          <OsdsText color={ODS_THEME_COLOR_INTENT.error} slot="helper">
            {errors.tokenName.message}
          </OsdsText>
        )}
      </OsdsFormField>

      <OsdsFormField>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          className="flex mt-6"
          slot="label"
        >
          {t('ai_endpoints_token_description')}
        </OsdsText>
        <OsdsTextarea
          ariaLabel={t('ai_endpoints_token_description')}
          rows={5}
          placeholder={t('ai_endpoints_token_description_placeholder')}
          className="mt-2"
          value={watch('description')}
          onOdsValueChange={(e) => setValue('description', e.detail?.value)}
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
                    {t('ai_endpoints_token_expiration_date')}
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
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid || undefined}
      >
        {t('ai_endpoints_token_create')}
      </OsdsButton>
    </>
  );
}
