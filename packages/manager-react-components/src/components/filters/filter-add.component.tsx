import React, { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { ODS_BUTTON_SIZE, ODS_INPUT_TYPE } from '@ovhcloud/ods-components';

import {
  OdsButton,
  OdsDatepicker,
  OdsFormField,
  OdsInput,
  OdsSelect,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import './translations';

export type Option = {
  label: string;
  value: string;
};

export type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
  type?: FilterTypeCategories;
  options?: Option[];
};

export type FilterAddProps = {
  columns: ColumnFilter[];
  onAddFilter: (filter: Filter, column: ColumnFilter) => void;
};

export function FilterAdd({ columns, onAddFilter }: Readonly<FilterAddProps>) {
  const { t } = useTranslation('filters');

  const [selectedId, setSelectedId] = useState(columns?.[0]?.id || '');
  const [selectedComparator, setSelectedComparator] = useState(
    columns?.[0]?.comparators?.[0] || FilterComparator.IsEqual,
  );
  const [value, setValue] = useState('');
  const [dateValue, setDateValue] = useState<Date | null>(null);

  const selectedColumn = useMemo(
    () => columns.find(({ id }) => selectedId === id),
    [columns, selectedId],
  );

  const isInputValid = useMemo(() => {
    if (selectedColumn?.type === FilterTypeCategories.Date) {
      return dateValue !== null;
    }
    if (selectedColumn?.type === FilterTypeCategories.Numeric) {
      // 0 is a valid number (though falsy)
      // Empty string is not a valid number (though Number('') === 0)
      return !Number.isNaN(Number(value)) && value !== '';
    }
    return value !== '';
  }, [selectedColumn, dateValue, value]);

  const submitAddFilter = () => {
    if (!isInputValid) {
      return;
    }
    onAddFilter(
      {
        key: selectedId,
        comparator: selectedComparator,
        value:
          selectedColumn.type === FilterTypeCategories.Date
            ? dateValue.toISOString()
            : value,
        type: selectedColumn.type,
      },
      selectedColumn,
    );
    setValue('');
    setDateValue(null);
  };

  useEffect(() => {
    setSelectedComparator(selectedColumn?.comparators[0]);
    setValue('');
    setDateValue(null);
  }, [selectedColumn]);

  let inputComponent: JSX.Element;
  if (selectedColumn?.type === FilterTypeCategories.Date) {
    inputComponent = (
      <OdsDatepicker
        name="filter-add_value-input"
        className="border"
        value={dateValue}
        data-testid="filter-add_value-date"
        onOdsChange={(e) => setDateValue(e.detail.value)}
      />
    );
  } else if (selectedColumn?.type === FilterTypeCategories.Numeric) {
    inputComponent = (
      <OdsInput
        name="filter-add_value-input"
        className="border"
        type={ODS_INPUT_TYPE.text}
        value={value}
        pattern="(\+|-)?[0-9]+([.][0-9]+)?"
        data-testid="filter-add_value-numeric"
        onOdsChange={(e) => setValue(`${e.detail.value}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submitAddFilter();
          }
        }}
      />
    );
  } else if (selectedColumn?.options?.length > 0) {
    inputComponent = (
      <OdsSelect
        value={value}
        name="filter-add_value-select"
        data-testid="filter-add_value-select"
        onOdsChange={(event) => setValue(event.detail.value as string)}
      >
        {selectedColumn?.options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </OdsSelect>
    );
  } else {
    inputComponent = (
      <OdsInput
        name="filter-add_value-input"
        className="border"
        type={ODS_INPUT_TYPE.text}
        value={value}
        data-testid="filter-add_value-input"
        onOdsChange={(e) => setValue(`${e.detail.value}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submitAddFilter();
          }
        }}
      />
    );
  }

  return (
    <>
      <div>
        <OdsFormField className="w-full">
          <div slot="label">
            <span className="text-[--ods-color-heading] leading-[22px]">
              {t('common_criteria_adder_column_label')}
            </span>
          </div>
          <OdsSelect
            value={selectedId}
            name="add-filter_select_idColumn"
            data-testid="add-filter_select_idColumn"
            onOdsChange={(event) => setSelectedId(event.detail.value as string)}
          >
            {columns.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </OdsSelect>
        </OdsFormField>
      </div>
      <div>
        <OdsFormField className="mt-2 w-full">
          <div slot="label">
            <span className="text-[--ods-color-heading] leading-[22px]">
              {t('common_criteria_adder_operator_label')}
            </span>
          </div>
          {selectedColumn && (
            <div key={`filter-condition-select-${selectedColumn.id}`}>
              <OdsSelect
                name={`add-operator-${selectedColumn.id}`}
                value={selectedComparator}
                onOdsChange={(event) => {
                  setSelectedComparator(event.detail.value as FilterComparator);
                }}
              >
                {selectedColumn.comparators?.map((comp) => (
                  <option key={comp} value={comp}>
                    {t(`common_criteria_adder_operator_${comp}`)}
                  </option>
                ))}
              </OdsSelect>
            </div>
          )}
        </OdsFormField>
      </div>
      <div>
        <OdsFormField className="mt-2 w-full">
          <div slot="label">
            <span className="text-[--ods-color-heading] leading-[22px]">
              {t('common_criteria_adder_value_label')}
            </span>
          </div>
          {inputComponent}
        </OdsFormField>
      </div>
      <div>
        <OdsButton
          className="mt-4 w-full filter-add-button-submit"
          size={ODS_BUTTON_SIZE.sm}
          isDisabled={!isInputValid}
          onClick={submitAddFilter}
          data-testid="filter-add_submit"
          label={t('common_criteria_adder_submit_label')}
        />
      </div>
    </>
  );
}
