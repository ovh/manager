import React, { useMemo, useState } from 'react';
import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
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
      <OsdsFormField>
        <div slot="label">
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('common_criteria_adder_column_label')}
          </OsdsText>
        </div>
        <OsdsSelect
          value={selectedId}
          data-testid="add-filter_select_idColumn"
          onOdsValueChange={(event) =>
            setSelectedId(event.detail.value as string)
          }
        >
          {columns.map(({ id, label }) => (
            <OsdsSelectOption key={id} value={id}>
              {label}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>
      <OsdsFormField className="mt-2">
        <div slot="label">
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('common_criteria_adder_operator_label')}
          </OsdsText>
        </div>
        <OsdsSelect
          value={selectedComparator}
          onOdsValueChange={(event) => {
            setSelectedComparator(event.detail.value as FilterComparator);
          }}
        >
          {selectedColumn?.comparators?.map((comp) => (
            <OsdsSelectOption key={comp} value={comp}>
              {t(`${'common_criteria_adder_operator_'}${comp}`)}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>
      <OsdsFormField className="mt-2">
        <div slot="label">
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('common_criteria_adder_value_label')}
          </OsdsText>
        </div>

        <OsdsInput
          className="border"
          type={ODS_INPUT_TYPE.text}
          color={ODS_THEME_COLOR_INTENT.primary}
          value={value}
          data-testid="filter-add_value-input"
          onOdsValueChange={(e) => setValue(`${e.detail.value}`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submitAddFilter();
            }
          }}
        />
      </OsdsFormField>
      <OsdsButton
        className="mt-4"
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        disabled={value ? undefined : true}
        onClick={submitAddFilter}
        data-testid="filter-add_submit"
      >
        {t('common_criteria_adder_submit_label')}
      </OsdsButton>
    </>
  );
}
