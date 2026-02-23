import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  INPUT_TYPE,
  Select,
  SelectContent,
  SelectControl,
  Spinner
} from '@ovhcloud/ods-react';
import { A_TYPES, type AType } from '@/zone/pages/zone/reset/reset.types';

interface ARecordSectionProps {
  readonly aType: AType | null;
  readonly aHosting: string;
  readonly aCustomIp: string;
  readonly ipError: string;
  readonly hostings: string[];
  readonly isLoadingHostings: boolean;
  readonly onATypeChange: (val: AType) => void;
  readonly onHostingChange: (val: string) => void;
  readonly onIpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ARecordSection({
  aType,
  aHosting,
  aCustomIp,
  ipError,
  hostings,
  isLoadingHostings,
  onATypeChange,
  onHostingChange,
  onIpChange,
}: ARecordSectionProps) {
  const { t } = useTranslation('zone');

  const aTypeItems = A_TYPES.map((v) => ({
    label: t(`zone_page_reset_type_${v}`),
    value: v,
  }));

  return (
    <div>
      <FormField>
        <FormFieldLabel>{t('zone_page_reset_type_a_label')}</FormFieldLabel>
        <Select
          items={aTypeItems}
          onValueChange={(detail: { value?: string[] }) =>
            onATypeChange((detail.value?.[0] ?? '') as AType)
          }
        >
          <SelectControl placeholder={t('zone_page_reset_select_placeholder')} />
          <SelectContent createPortal={false} />
        </Select>
      </FormField>

      {aType === 'HOSTING_WEB' && (
        <FormField className="mt-3">
          <FormFieldLabel>{t('zone_page_reset_type_hosting_web_label')}</FormFieldLabel>
          {isLoadingHostings ? (
            <Spinner />
          ) : (
            <Select
              items={hostings.map((h) => ({ label: h, value: h }))}
              onValueChange={(detail: { value?: string[] }) =>
                onHostingChange(detail.value?.[0] ?? '')
              }
            >
              <SelectControl
                placeholder={t('zone_page_reset_type_hosting_web_placeholder')}
              />
              <SelectContent createPortal={false} />
            </Select>
          )}
        </FormField>
      )}

      {aType === 'CUSTOM' && (
        <FormField className="mt-3" invalid={!!ipError}>
          <FormFieldLabel>{t('zone_page_reset_type_custom_a_label')}</FormFieldLabel>
          <Input
            type={INPUT_TYPE.text}
            value={aCustomIp}
            onChange={onIpChange}
            placeholder="1.2.3.4"
            invalid={!!ipError}
          />
          {ipError && <FormFieldError>{ipError}</FormFieldError>}
        </FormField>
      )}
    </div>
  );
}
