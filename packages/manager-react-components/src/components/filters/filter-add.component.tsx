import React, { useMemo, useState } from 'react';
import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';
import { ODS_BUTTON_SIZE, ODS_INPUT_TYPE } from '@ovhcloud/ods-components';

import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsSelect,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import './translations';

type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
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

  const selectedColumn = useMemo(
    () => columns.find(({ id }) => selectedId === id),
    [columns, selectedId],
  );

  const submitAddFilter = () => {
    onAddFilter(
      {
        key: selectedId,
        comparator: selectedComparator,
        value,
      },
      selectedColumn,
    );
    setValue('');
  };

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
          <OdsSelect
            name="add-operator"
            value={selectedComparator}
            onOdsChange={(event) => {
              setSelectedComparator(event.detail.value as FilterComparator);
            }}
          >
            {selectedColumn?.comparators?.map((comp) => (
              <option key={comp} value={comp}>
                {t(`${'common_criteria_adder_operator_'}${comp}`)}
              </option>
            ))}
          </OdsSelect>
        </OdsFormField>
      </div>
      <div>
        <OdsFormField className="mt-2 w-full">
          <div slot="label">
            <span className="text-[--ods-color-heading] leading-[22px]">
              {t('common_criteria_adder_value_label')}
            </span>
          </div>
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
        </OdsFormField>
      </div>
      <div>
        <OdsButton
          className="mt-4 w-full filter-add-button-submit"
          size={ODS_BUTTON_SIZE.sm}
          isDisabled={!value}
          onClick={submitAddFilter}
          data-testid="filter-add_submit"
          label={t('common_criteria_adder_submit_label')}
        />
      </div>
    </>
  );
}
