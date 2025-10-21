import {
  FormField,
  FormFieldLabel,
  Input,
  Textarea,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

export default function DnssecForm() {
  const { t } = useTranslation('domain');

  return (
    <section className="flex flex-col gap-y-6 mb-8">
      <FormField>
        <FormFieldLabel>
          {t('domain_DNSSEC_table_header_keyTag')}
        </FormFieldLabel>
        <Input name="input" placeholder="32456" />
      </FormField>

      <FormField>
        <FormFieldLabel>{t('domain_DNSSEC_table_header_flag')}</FormFieldLabel>
        <Input name="input" placeholder="257 - Key Signing Key (KSK)" />
      </FormField>

      <FormField>
        <FormFieldLabel>{t('domain_DNSSEC_table_header_algo')}</FormFieldLabel>
        <Input name="input" placeholder="8 - RSASHZA3457" />
      </FormField>

      <FormField>
        <FormFieldLabel>
          {t('domain_DNSSEC_table_header_publicKey')}
        </FormFieldLabel>
        <Textarea
          name="textarea"
          placeholder="SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD"
        />
      </FormField>
    </section>
  );
}
