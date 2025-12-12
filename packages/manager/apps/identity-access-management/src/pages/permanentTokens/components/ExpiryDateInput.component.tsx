import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsToggle,
  OdsRadio,
  OdsText,
  OdsSelect,
  OdsDatepicker,
  OdsTimepicker,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

// TODO: fix typing error for OdsToggle's defaultValue.
type TOdsToggleDefaultValue =
  | (false & readonly string[])
  | (true & readonly string[]);

export type ExpiryDateModel = {
  active: boolean;
  mode: 'duration' | 'date';
  expiresAt: Date | null;
  expiresIn: number | null;
};

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * 60;
const SECONDS_IN_DAY = 60 * 60 * 24;

export const DEFAULT_EXPIRY_DATE_MODEL: ExpiryDateModel = {
  active: false,
  mode: 'duration',
  expiresAt: new Date(),
  expiresIn: SECONDS_IN_HOUR,
};

enum Unit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
}

const MINUTES_OPTIONS = Array.from({ length: 59 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));

const HOURS_OPTIONS = Array.from({ length: 23 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));

export default function ExpiryDateInput({
  model,
  setModel,
}: {
  model: ExpiryDateModel;
  setModel: (model: ExpiryDateModel) => void;
}) {
  const { t } = useTranslation(['permanent-tokens']);
  const [unit, setUnit] = useState<Unit>(Unit.DAYS);
  const [minutes, setMinutes] = useState<number>(1);
  const [hours, setHours] = useState<number>(1);
  const [days, setDays] = useState<number>(1);

  const setExpiresIn = (unit: Unit, value: number) => {
    if (!model.active || model.mode !== 'duration') { return; }
    switch (unit) {
      case Unit.MINUTES:
        setModel({...model, expiresIn: value * SECONDS_IN_MINUTE })
        setMinutes(value);
        break;
      case Unit.HOURS:
        setModel({...model, expiresIn: value * SECONDS_IN_HOUR })
        setHours(value);
        break;
      case Unit.DAYS:
        setModel({...model, expiresIn: value * SECONDS_IN_DAY })
        setDays(value);
        break;
    }
  };

  return (
    <div className="flex flex-row gap-8">
      <OdsFormField>
        <OdsToggle
          id="hasExpiryDate"
          name="hasExpiryDate"
          defaultValue={(model.active as unknown) as TOdsToggleDefaultValue}
          onOdsChange={(e) => {
            const active = e.detail.value;
            setModel({ ...model, active });
          }}
        />
      </OdsFormField>

      <div className="flex flex-col gap-4">
        <label
          className="mt-[0.3rem] mb-4"
          htmlFor="hasExpiryDate"
          slot="label"
        >
          <OdsText>{t('iam_user_token_modal_field_expiry_date_label')}</OdsText>
        </label>

        <div className="flex gap-6 items-center">
          <div className="flex gap-4 items-center">
            <OdsRadio
              inputId="expiryDateType-duration"
              name="expiryDateType"
              value="duration"
              isChecked={model.mode === 'duration'}
              onClick={() => setModel({ ...model, mode: 'duration' })}
              isDisabled={!model.active}
            />
            <label htmlFor="expiryDateType-duration">
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t('iam_user_token_modal_field_expiry_date_type_duration')}
              </OdsText>
            </label>
          </div>
          <div className="flex gap-4 items-center">
            <OdsRadio
              inputId="expiryDateType-date"
              name="expiryDateType"
              value="date"
              isChecked={model.mode === 'date'}
              onClick={() => setModel({ ...model, mode: 'date' })}
              isDisabled={!model.active}
            />
            <label htmlFor="expiryDateType-date">
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t('iam_user_token_modal_field_expiry_date_type_timestamp')}
              </OdsText>
            </label>
          </div>
        </div>

        {model.mode === 'duration' && (
          <div className="flex flex-row gap-4">
            <OdsSelect
              name="expiryDateUnit"
              value={unit}
              onOdsChange={(e) => setUnit(e.detail.value as Unit)}
              isDisabled={!model.active}
            >
              <option value={Unit.MINUTES}>
                {t('iam_user_token_modal_field_expiry_date_unit_minutes')}
              </option>
              <option value={Unit.HOURS}>
                {t('iam_user_token_modal_field_expiry_date_unit_hours')}
              </option>
              <option value={Unit.DAYS}>
                {t('iam_user_token_modal_field_expiry_date_unit_days')}
              </option>
            </OdsSelect>

            {unit === 'minutes' && (
              <OdsSelect
                name="expiryDateMinutes"
                value={`${minutes}`}
                onOdsChange={e => setExpiresIn(Unit.MINUTES, parseInt(e.detail.value, 10))}
                isDisabled={!model.active}
              >
                {MINUTES_OPTIONS.map(({ value, label }) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </OdsSelect>
            )}

            {unit === 'hours' && (
              <OdsSelect
                name="expiryDateHours"
                value={`${hours}`}
                onOdsChange={e => setExpiresIn(Unit.HOURS, parseInt(e.detail.value, 10))}
                isDisabled={!model.active}
              >
                {HOURS_OPTIONS.map(({ value, label }) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </OdsSelect>
            )}

            {unit === 'days' && (
              <OdsQuantity
                id="expiryDateDays"
                name="expiryDateDays"
                value={days}
                onOdsChange={e => setExpiresIn(Unit.DAYS, e.detail.value)}
                min={1}
                isDisabled={!model.active}
              />
            )}
          </div>
        )}
        {model.mode === 'date' && (
          <OdsDatepicker
            name="ExpiryDateValue"
            value={model.expiresAt}
            onOdsChange={(e) =>
              setModel({ ...model, expiresAt: e.detail.value || null })
            }
            isDisabled={!model.active}
          />
        )}
      </div>
    </div>
  );
}
