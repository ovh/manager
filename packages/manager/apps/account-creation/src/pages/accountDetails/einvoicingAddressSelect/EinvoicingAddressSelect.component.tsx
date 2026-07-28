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
import { EinvoicingRule } from '@/types/einvoicing';

type EinvoicingAddressSelectProps = {
  rule?: EinvoicingRule;
  legalForm?: LegalForm;
  siren?: string;
  value?: string;
  onValueChange: (value: string | undefined) => void;
};

// B2G = administration ; B2B = corporation / association.
const isB2g = (legalForm?: LegalForm) => legalForm === 'administration';

/**
 * E-invoicing billing address field driven by the PPF rule, per the FR
 * e-invoicing front-end spec:
 * - `visible: false` → nothing rendered.
 * - empty `in`      → informational banner (B2B uses the SIREN, B2G a generic
 *   message). No picker, no value.
 * - single `in`     → informational banner (from `defaultValue`), the address is
 *   used automatically. No picker.
 * - multiple `in`   → a mandatory `<select>` the customer must pick from (B2G
 *   gets an extra note below it).
 */
export default function EinvoicingAddressSelect({
  rule,
  legalForm,
  siren,
  value,
  onValueChange,
}: EinvoicingAddressSelectProps) {
  const { t } = useTranslation('account-details');

  const addresses = rule?.in ?? [];
  const singleAddress =
    addresses.length === 1 ? rule?.defaultValue ?? addresses[0] : undefined;

  // Single address → use it automatically. Empty → make sure nothing lingers.
  useEffect(() => {
    if (!rule?.visible) return;
    if (addresses.length === 0 && value) {
      onValueChange(undefined);
    } else if (singleAddress && value !== singleAddress) {
      onValueChange(singleAddress);
    }
  }, [rule?.visible, addresses.length, singleAddress]);

  if (!rule?.visible) {
    return null;
  }

  // Empty → informational banner, nothing to select.
  if (addresses.length === 0) {
    return (
      <OdsMessage color="information" isDismissible={false} className="my-2">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {isB2g(legalForm)
            ? t('account_details_einvoicing_empty_b2g')
            : t('account_details_einvoicing_empty_b2b', { siren })}
        </OdsText>
      </OdsMessage>
    );
  }

  // Single address → informational banner, used automatically.
  if (addresses.length === 1) {
    return (
      <OdsMessage color="information" isDismissible={false} className="my-2">
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {isB2g(legalForm)
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

  // Multiple addresses → mandatory select.
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
      {isB2g(legalForm) && (
        <OdsText preset="caption" className="block mt-2">
          {t('account_details_einvoicing_multi_b2g_hint')}
        </OdsText>
      )}
    </OdsFormField>
  );
}
