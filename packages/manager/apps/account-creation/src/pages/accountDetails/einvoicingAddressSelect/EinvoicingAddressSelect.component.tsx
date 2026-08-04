import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LegalForm } from '@ovh-ux/manager-config';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { isB2GLegalForm } from '@/helpers/flowHelper';
import { Rule } from '@/types/rule';

type EinvoicingAddressSelectProps = {
  rule?: Pick<Rule, 'in' | 'defaultValue' | 'mandatory'>;
  legalForm?: LegalForm;
  value?: string;
  onValueChange: (value: string | undefined) => void;
};

/**
 * E-invoicing billing address field: informational banner when zero or one
 * address is available, mandatory select otherwise. No rule → nothing rendered.
 */
export default function EinvoicingAddressSelect({
  rule,
  legalForm,
  value,
  onValueChange,
}: EinvoicingAddressSelectProps) {
  const { t } = useTranslation('account-details');

  const addresses = rule?.in ?? [];
  const singleAddress =
    addresses.length === 1 ? rule?.defaultValue ?? addresses[0] : undefined;

  // Single address → use it automatically. Empty → make sure nothing lingers.
  useEffect(() => {
    if (!rule) return;
    if (addresses.length === 0 && value) {
      onValueChange(undefined);
    } else if (singleAddress && value !== singleAddress) {
      onValueChange(singleAddress);
    }
  }, [rule, addresses.length, singleAddress]);

  if (!rule) {
    return null;
  }

  if (addresses.length === 0) {
    return (
      <OdsMessage color="information" isDismissible={false} className="my-2">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {isB2GLegalForm(legalForm)
            ? t('account_details_einvoicing_empty_b2g')
            : t('account_details_einvoicing_empty_b2b')}
        </OdsText>
      </OdsMessage>
    );
  }

  if (addresses.length === 1) {
    return (
      <OdsMessage color="information" isDismissible={false} className="my-2">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {isB2GLegalForm(legalForm)
            ? t('account_details_einvoicing_single_b2g', {
                address: singleAddress,
              })
            : t('account_details_einvoicing_single_b2b', {
                address: singleAddress,
              })}
        </OdsText>
      </OdsMessage>
    );
  }

  return (
    <OdsFormField>
      <label slot="label">
        <OdsText preset="caption">
          {t('account_details_einvoicing_address_label')}
          {rule.mandatory && ' *'}
        </OdsText>
      </label>
      <OdsSelect
        name="einvoicingBillingAddress"
        value={value ?? ''}
        className="w-full"
        onOdsChange={(event) =>
          onValueChange((event.detail?.value as string) || undefined)
        }
      >
        {addresses.map((address) => (
          <option key={address} value={address}>
            {address}
          </option>
        ))}
      </OdsSelect>
      <OdsText preset="caption" className="block mt-2">
        {isB2GLegalForm(legalForm)
          ? t('account_details_einvoicing_multi_b2g')
          : t('account_details_einvoicing_multi_b2b')}
      </OdsText>
    </OdsFormField>
  );
}
