import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsDatepicker,
  OdsFormField,
  OdsQuantity,
  OdsRadio,
  OdsSelect,
  OdsText,
  OdsTimepicker,
  OdsToggle,
} from '@ovhcloud/ods-components/react';
import { endOfDay } from 'date-fns';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

import { ExpiryDateModel, ExpiryMode, TOdsToggleDefaultValue, } from '@/types/expiryDate';
import {
  extractTimeFromDate,
  HOURS_OPTIONS,
  MINUTES_OPTIONS,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
  updateDateTime,
} from '@/utils/expiryDateUtils';

enum Unit {
  MINUTES = 'minutes',
  HOURS = 'hours',
  DAYS = 'days',
}

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
  const currentDate = new Date();

  const setExpiresIn = (expiryUnit: Unit, value: number | null) => {
    if (!model.active || model.mode !== ExpiryMode.DURATION) {
      return;
    }
    if (value === null || value <= 0) {
      setModel({ ...model, expiresIn: 0, invalid: true });
      return;
    }

    switch (expiryUnit) {
      case Unit.MINUTES:
        setModel({
          ...model,
          expiresIn: value * SECONDS_IN_MINUTE,
          invalid: false,
        });
        setMinutes(value);
        break;
      case Unit.HOURS:
        setModel({
          ...model,
          expiresIn: value * SECONDS_IN_HOUR,
          invalid: false,
        });
        setHours(value);
        break;
      case Unit.DAYS:
        setModel({
          ...model,
          expiresIn: value * SECONDS_IN_DAY,
          invalid: false,
        });
        setDays(value);
        break;
      default:
        break;
    }
  };

  const setExpiresAt = (value: Date | null) => {
    if (!model.active || model.mode !== ExpiryMode.DATE) {
      return;
    }
    const updatedDate = !!value ? endOfDay(value) : null;
    setModel({
      ...model,
      expiresAt: updatedDate,
      invalid: !updatedDate || updatedDate < currentDate,
    });
  };

  const setExpiresAtDateTime = (time: string | null) => {
    if (
      !model.active ||
      model.mode !== ExpiryMode.DATE ||
      !time ||
      !model.expiresAt
    ) {
      return;
    }
    const updatedDate = updateDateTime(model.expiresAt, time);
    setModel({
      ...model,
      expiresAt: updatedDate,
      invalid: !updatedDate || updatedDate < currentDate,
    });
  };

  return (
    <div className="flex flex-row gap-8">
      <OdsFormField>
        <OdsToggle
          id="hasExpiryDate"
          name="hasExpiryDate"
          data-testid="hasExpiryDate"
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
              data-testid="expiryDateType-duration"
              name="expiryDateType"
              value="duration"
              isChecked={model.mode === ExpiryMode.DURATION}
              onClick={() =>
                setModel({ ...model, mode: ExpiryMode.DURATION })
              }
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
              data-testid="expiryDateType-date"
              name="expiryDateType"
              value="date"
              isChecked={model.mode === ExpiryMode.DATE}
              onClick={() => setModel({ ...model, mode: ExpiryMode.DATE })}
              isDisabled={!model.active}
            />
            <label htmlFor="expiryDateType-date">
              <OdsText preset={ODS_TEXT_PRESET.span}>
                {t('iam_user_token_modal_field_expiry_date_type_timestamp')}
              </OdsText>
            </label>
          </div>
        </div>

        {model.mode === ExpiryMode.DURATION && (
          <div className="flex flex-row gap-4">
            <OdsSelect
              name="expiryDateUnit"
              data-testid="expiryDateUnit"
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
                data-testid="expiryDateMinutes"
                value={`${minutes}`}
                onOdsChange={(e) =>
                  setExpiresIn(Unit.MINUTES, parseInt(e.detail.value, 10))
                }
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
                data-testid="expiryDateHours"
                value={`${hours}`}
                onOdsChange={(e) =>
                  setExpiresIn(Unit.HOURS, parseInt(e.detail.value, 10))
                }
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
                data-testid="expiryDateDays"
                value={days}
                onOdsChange={(e) => setExpiresIn(Unit.DAYS, e.detail.value)}
                min={1}
                isDisabled={!model.active}
              />
            )}
          </div>
        )}
        {model.mode === ExpiryMode.DATE && (
          <div className="flex flex-row gap-4">
            <div className="min-h-[2em] min-w-[12.6em]">
              <OdsDatepicker
                name="ExpiryDateValue"
                data-testid="ExpiryDateValue"
                value={model.expiresAt}
                onOdsChange={(e) => setExpiresAt(e.detail.value || null)}
                isDisabled={!model.active}
                min={currentDate}
                strategy="fixed"
              />
            </div>
            <OdsTimepicker
              name="ExpiryTimeValue"
              data-testid="ExpiryTimeValue"
              value={extractTimeFromDate(model.expiresAt)}
              onOdsChange={(e) => setExpiresAtDateTime(e.detail.value || null)}
              isDisabled={!model.active}
            />
          </div>
        )}
      </div>
    </div>
  );
}
