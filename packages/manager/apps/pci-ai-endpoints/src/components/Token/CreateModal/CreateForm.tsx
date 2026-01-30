import { useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  Input,
  Text,
  Textarea,
} from '@ovhcloud/ods-react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OsdsDatepicker } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { z } from 'zod';
import { TRACKING } from '@/configuration/tracking.constants';
import getLocaleForDatePicker from '@/components/utils/getLocaleForDatepicker';
import { useCreateToken } from '@/hooks/api/database/token/useToken.hook';
import { TokenData } from '@/types/cloud/project/database/token/index';

export type CreateFormProps = {
  projectId: string;
  tokens: string[];
  infiniteDate: Date;
  onSuccess: (token: TokenData) => void;
};

type FormValues = {
  tokenName: string;
  description: string;
  expirationDate: Date;
  isChecked: boolean;
};

export function createTokenSchema(
  tokens: string[],
  t: (key: string) => string,
) {
  return z.object({
    tokenName: z
      .string()
      .min(1, { message: t('ai_endpoints_token_name_required') })
      .regex(/^[A-Za-z0-9-]+$/, {
        message: t('ai_endpoints_token_invalid_format'),
      })
      .refine(
        (value) => !tokens.some((existing) => existing === value.trim()),
        { message: t('ai_endpoints_token_name_error') },
      ),
    description: z.string(),
    expirationDate: z.date(),
    isChecked: z.boolean(),
  });
}

const CreateForm = ({
  projectId,
  tokens,
  infiniteDate,
  onSuccess,
}: CreateFormProps) => {
  const { t } = useTranslation('token');
  const localDatePicker = getLocaleForDatePicker();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { createToken } = useCreateToken({
    projectId,
    onSuccess: (newToken) => {
      onSuccess(newToken);
    },
  });
  const { trackClick, trackPage } = useOvhTracking();
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

  const tokenNameValue = watch('tokenName');
  const isChecked = watch('isChecked');
  const expirationDate = watch('expirationDate');

  useEffect(() => {
    if (!isChecked) {
      setValue('expirationDate', infiniteDate);
    }
    trackPage(TRACKING.apikey.createNewApikeyPopUpShow);
  }, [isChecked, infiniteDate, setValue]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      projectId,
      name: data.tokenName,
      description: data.description,
      expiresAt: data.expirationDate.toISOString(),
    };

    createToken(payload);
  };

  const displayChipValue = useMemo(() => {
    return expirationDate.getTime() === infiniteDate.getTime()
      ? t('ai_endpoints_token_expiration')
      : expirationDate.toLocaleDateString();
  }, [expirationDate, infiniteDate, t]);

  return (
    <>
      <FormField>
        <Text preset="paragraph" className="mt-6">
          {t('ai_endpoints_token_name')}
        </Text>
        <Controller
          control={control}
          name="tokenName"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              aria-label="token-name-input"
              color={
                errors.tokenName
                  ? ODS_THEME_COLOR_INTENT.error
                  : ODS_THEME_COLOR_INTENT.primary
              }
              value={value || ''}
              onBlur={onBlur}
              className="max-w-[23.125rem] mt-2"
              onInput={(event) => {
                const newVal = (event.target as HTMLInputElement).value;
                onChange(newVal.slice(0, 60));
              }}
              ref={ref}
              type="text"
            />
          )}
        />
        {errors.tokenName && tokenNameValue.trim() !== '' && (
          <Text preset="paragraph">{errors.tokenName.message}</Text>
        )}
      </FormField>

      <FormField>
        <Text preset="paragraph" className="flex mt-6">
          {t('ai_endpoints_token_description')}
        </Text>
        <Textarea
          aria-label={t('ai_endpoints_token_description')}
          rows={5}
          placeholder={t('ai_endpoints_token_description_placeholder')}
          className="mt-2"
          value={watch('description')}
          onChange={(detail) => {
            setValue('description', detail.target.value);
          }}
        />
      </FormField>

      <FormField>
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
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={(detail) => field.onChange(detail.checked)}
              className="mt-2 -ml-2 max-w-fit"
            >
              <CheckboxControl />
              <CheckboxLabel>
                <Text>{t('ai_endpoints_token_expiration_date')}</Text>
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

      <Button
        slot="actions"
        onClick={() => {
          handleSubmit(onSubmit)();
          trackClick(TRACKING.apikey.confirmClick);
        }}
        disabled={!isValid || undefined}
      >
        {t('ai_endpoints_token_create')}
      </Button>
    </>
  );
};

export default CreateForm;
