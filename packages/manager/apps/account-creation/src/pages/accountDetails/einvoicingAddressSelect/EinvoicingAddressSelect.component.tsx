import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Tile,
  Text,
} from '@ovhcloud/ods-react';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { EinvoicingRule } from '@/types/einvoicing';
import '../vatSelect/VatSelect.scss';

type EinvoicingAddressSelectProps = {
  rule?: EinvoicingRule;
  value?: string;
  onValueChange: (value: string | undefined) => void;
};

/**
 * E-invoicing billing address picker driven by the PPF rule (RG1→RG4):
 * - RG1: rule missing or `visible: false` → render nothing (field hidden).
 * - RG2: `visible` + non-empty `in` → radio list of active addresses.
 * - RG3: single entry / `defaultValue` set → pre-selected.
 * - RG4: `visible` + empty `in` → informational message, nothing to select.
 */
export default function EinvoicingAddressSelect({
  rule,
  value,
  onValueChange,
}: EinvoicingAddressSelectProps) {
  const { t } = useTranslation('account-details');

  const addresses = rule?.in ?? [];
  const hasAddresses = addresses.length > 0;

  // RG3: pre-select the default (or the single) address once, if nothing chosen.
  useEffect(() => {
    if (!rule?.visible || value) return;
    const preselected =
      rule.defaultValue ?? (addresses.length === 1 ? addresses[0] : undefined);
    if (preselected) {
      onValueChange(preselected);
    }
  }, [rule?.visible, rule?.defaultValue, addresses.length]);

  // RG1: field hidden.
  if (!rule?.visible) {
    return null;
  }

  // RG4: known SIREN but no active address.
  if (!hasAddresses) {
    return (
      <OdsMessage color="information" isDismissible={false} className="my-2">
        <Text preset={TEXT_PRESET.paragraph}>
          {t('account_details_einvoicing_no_active_address')}
        </Text>
      </OdsMessage>
    );
  }

  // RG2 / RG3: pick an address.
  return (
    <RadioGroup
      value={value ?? ''}
      onValueChange={({ value: newValue }) =>
        onValueChange(newValue || undefined)
      }
    >
      {addresses.map((address) => (
        <Tile key={address} selected={value === address}>
          <Radio value={address} className="config-tile">
            <div className="config-tile__info">
              <div className="config-tile__info__radio">
                <RadioControl />
                <RadioLabel>
                  <Text preset={TEXT_PRESET.paragraph}>{address}</Text>
                </RadioLabel>
              </div>
            </div>
          </Radio>
        </Tile>
      ))}
    </RadioGroup>
  );
}
