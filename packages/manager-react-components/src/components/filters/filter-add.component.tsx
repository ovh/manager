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

export type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
  type?: FilterTypeCategories;
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

  const submitAddFilter = () => {
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
          {selectedColumn?.type === FilterTypeCategories.Date ? (
            <OdsDatepicker
              name="filter-add_value-input"
              className="border"
              value={dateValue}
              data-testid="filter-add_value-date"
              onOdsChange={(e) => setDateValue(e.detail.value)}
            />
          ) : (
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
          )}
        </OdsFormField>
      </div>
      <div>
        <OdsButton
          className="mt-4 w-full filter-add-button-submit"
          size={ODS_BUTTON_SIZE.sm}
          isDisabled={!value && !dateValue}
          onClick={submitAddFilter}
          data-testid="filter-add_submit"
          label={t('common_criteria_adder_submit_label')}
        />
      </div>
    </>
  );
}
