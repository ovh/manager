import { getPublicKeyError } from '@/domain/utils/utils';
import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  Textarea,
} from '@ovhcloud/ods-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export default function DsRecordsForm() {
  const { t } = useTranslation('domain');
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section className="flex flex-col gap-y-6 mb-8">
      <FormField invalid={Boolean(errors.keyTag)}>
        <FormFieldLabel>
          {t('domain_dsrecords_table_header_keyTag')}
        </FormFieldLabel>
        <Input
          name="input"
          type="number"
          placeholder="32456"
          {...register('keyTag')}
        />
      </FormField>

      <FormField invalid={Boolean(errors.keyType)}>
        <FormFieldLabel>
          {t('domain_dsrecords_table_header_flag')}
        </FormFieldLabel>
        <Input
          name="input"
          type="number"
          placeholder="257 - Key Signing Key (KSK)"
          {...register('keyType')}
        />
      </FormField>

      <FormField invalid={Boolean(errors.algorithm)}>
        <FormFieldLabel>
          {t('domain_dsrecords_table_header_algo')}
        </FormFieldLabel>
        <Input
          name="input"
          placeholder="8 - RSASHZA3457"
          {...register('algorithm')}
        />
      </FormField>

      <FormField invalid={Boolean(errors.publicKey)}>
        <FormFieldLabel>
          {t('domain_dsrecords_table_header_publicKey')}
        </FormFieldLabel>
        <Textarea
          name="textarea"
          placeholder="SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD"
          {...register('publicKey', {
            validate: (value: string) => {
              const errorKey = getPublicKeyError(value);
              return errorKey ? t(errorKey) : true;
            },
          })}
        />
        <FormFieldError>
          {t(errors.publicKey?.message.toString())}
        </FormFieldError>
      </FormField>
    </section>
  );
}
