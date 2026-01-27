import { max_keytag, min_keyTag } from '@/domain/constants/dsRecords';
import { TDnssecConfiguration } from '@/domain/types/dnssecConfiguration';
import { getPublicKeyError } from '@/domain/utils/utils';
import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  Select,
  SelectContent,
  SelectControl,
  SelectItem,
  Textarea,
} from '@ovhcloud/ods-react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface DsRecordsFormProps {
  readonly supportedAlgorithms: TDnssecConfiguration['supportedAlgorithms'];
}

export default function DsRecordsForm({
  supportedAlgorithms,
}: DsRecordsFormProps) {
  const { t } = useTranslation('domain');
  const supportedAlgorithmsItems: SelectItem[] = supportedAlgorithms.map(
    (algorithm) => ({
      label: `${algorithm.number} - ${algorithm.name}`,
      value: String(algorithm.number),
    }),
  );
  const {
    register,
    control,
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
          min={min_keyTag}
          max={max_keytag}
          placeholder="32456"
          {...register('keyTag', {
            validate: (value: string) => {
              if (value === null || value === '') {
                return t('domain_tab_dsrecords_drawer_form_error_empty');
              }
              return true;
            },
            min: {
              value: min_keyTag,
              message: t('domain_tab_dsrecords_drawer_form_invalid_keytag'),
            },
            max: {
              value: max_keytag,
              message: t('domain_tab_dsrecords_drawer_form_invalid_keytag'),
            },
          })}
        />
        <FormFieldError className="text-sm">
          {errors.keyTag?.message ? t(String(errors.keyTag.message)) : null}
        </FormFieldError>
      </FormField>

      <FormField>
        <FormFieldLabel>
          {t('domain_dsrecords_table_header_flags')}
        </FormFieldLabel>
        <Input name="input" type="number" readOnly {...register('flags')} />
      </FormField>

      <FormField invalid={Boolean(errors.algorithm)}>
        <FormFieldLabel>
          {t('domain_dsrecords_table_header_algo')}
        </FormFieldLabel>
        <Controller
          name="algorithm"
          control={control}
          render={({ field }) => {
            return (
              <Select
                id="algorithm"
                items={supportedAlgorithmsItems}
                value={[String(field.value)]}
                onValueChange={({ value }) => {
                  field.onChange(value[0]);
                }}
              >
                <SelectControl />
                <SelectContent />
              </Select>
            );
          }}
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
        <FormFieldError className="text-sm">
          {errors.publicKey?.message ? t(String(errors.publicKey.message)) : null}
        </FormFieldError>
      </FormField>
    </section>
  );
}
