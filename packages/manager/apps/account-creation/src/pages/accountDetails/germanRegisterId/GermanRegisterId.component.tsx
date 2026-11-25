import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { courtOptions, registerTypeOf } from '@/helpers/germany/germanyHelper';
import { GermanRegisterCourtList } from '@/types/suggestion';

export type GermanRegisterIdValue = { court: string; number: string };

/**
 * « No court »: the ODS select offers no empty choice once a court is picked
 * (`allowEmptyOption: false`), this option takes it back off. Never a court
 * code (`^[A-Z][0-9]{4}[RV]?$`).
 */
const NO_COURT = 'none';

type GermanRegisterIdProps = GermanRegisterIdValue & {
  /** `GET /me/suggest/germanRegistersByCourt`, `undefined` until loaded. */
  courts?: GermanRegisterCourtList;
  courtsError: boolean;
  /** Spec §4: one part filled without the other. */
  issue: 'courtRequired' | 'numberRequired' | null;
  /** The rules' verdict on the EUID. */
  error?: string;
  mandatory: boolean;
  onChange: (value: GermanRegisterIdValue) => void;
  onBlur: () => void;
};

/**
 * The German register id (spec §4), on one line: the court picked in the
 * official list — the ones keeping the register type typed — and the register
 * type and number typed. The page builds the EUID from both (`toEuid`).
 */
export default function GermanRegisterId({
  court,
  number,
  courts,
  courtsError,
  issue,
  error,
  mandatory,
  onChange,
  onBlur,
}: GermanRegisterIdProps) {
  const { t } = useTranslation('account-details');
  const options = courts ? courtOptions(courts, number, court) : [];
  const unoffered = options.find((option) => !option.offered)?.code ?? '';
  const courtError =
    issue === 'courtRequired'
      ? t('account_details_de_error_court_required')
      : undefined;
  const numberError =
    error ??
    (issue === 'numberRequired'
      ? t('account_details_de_error_cnin_required')
      : undefined);

  return (
    <div className="grid gap-x-4 sm:grid-cols-2">
      <OdsFormField>
        <label htmlFor="deRegisterCourt" slot="label">
          <OdsText preset="caption">
            {t('account_details_de_court_label')}
          </OdsText>
        </label>
        <OdsSelect
          // The options follow the register type typed: remount on change.
          key={`courts_${!!courts}_${registerTypeOf(
            number,
            courts?.registerTypes ?? [],
          ) ?? ''}_${unoffered}`}
          name="deRegisterCourt"
          id="deRegisterCourt"
          value={court || NO_COURT}
          isDisabled={!courts}
          hasError={!!courtError}
          className="w-full"
          onOdsChange={(event) => {
            const value = String(event.detail?.value ?? '');
            onChange({ court: value === NO_COURT ? '' : value, number });
          }}
          onOdsBlur={onBlur}
        >
          <option value={NO_COURT}>
            {t('account_details_de_court_placeholder')}
          </option>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.offered
                ? option.name
                : t('account_details_de_court_unavailable', {
                    name: option.name,
                  })}
            </option>
          ))}
        </OdsSelect>
        {courtsError && (
          <OdsText className="text-critical leading-[0.8]" preset="caption">
            {t('account_details_de_court_list_error')}
          </OdsText>
        )}
        {courtError && (
          <OdsText className="text-critical leading-[0.8]" preset="caption">
            {courtError}
          </OdsText>
        )}
      </OdsFormField>
      <OdsFormField>
        <label htmlFor="deRegisterNumber" slot="label">
          <OdsText preset="caption">
            {t('account_details_de_cnin_label')}
            {mandatory && ' *'}
          </OdsText>
        </label>
        <OdsInput
          name="deRegisterNumber"
          id="deRegisterNumber"
          value={number}
          hasError={!!numberError}
          onOdsChange={(event) =>
            onChange({ court, number: String(event.detail?.value ?? '') })
          }
          onOdsBlur={onBlur}
        />
        <OdsText preset="caption">{t('account_details_de_cnin_hint')}</OdsText>
        {numberError && (
          <OdsText className="text-critical leading-[0.8]" preset="caption">
            {numberError}
          </OdsText>
        )}
      </OdsFormField>
    </div>
  );
}
