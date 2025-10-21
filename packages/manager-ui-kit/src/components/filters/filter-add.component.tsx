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
import { TagsFilterForm } from './tags-filter-form.component';

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
  resourceType?: string;
  onAddFilter: (filter: Filter, column: ColumnFilter) => void;
};

export function FilterAdd({
  columns,
  onAddFilter,
  resourceType,
}: Readonly<FilterAddProps>) {
  const { t } = useTranslation('filters');

  const [selectedId, setSelectedId] = useState(columns?.[0]?.id || '');
  const [selectedComparator, setSelectedComparator] = useState(
    columns?.[0]?.comparators?.[0] || FilterComparator.IsEqual,
  );
  const [value, setValue] = useState('');
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [tagKey, setTagKey] = useState('');

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

    // If filter is a tag filter, we need to check if the tag key and value are valid
    // If comparator is TagExists or TagNotExists, we need to only check for tagKey
    if (selectedColumn?.type === FilterTypeCategories.Tags) {
      return (
        (!!tagKey && !!value) ||
        (!!tagKey &&
          [FilterComparator.TagExists, FilterComparator.TagNotExists].includes(
            selectedComparator,
          ))
      );
    }

    return value !== '';
  }, [selectedColumn, dateValue, value, tagKey, selectedComparator]);

  const submitAddFilter = () => {
    if (!isInputValid) {
      return;
    }
    onAddFilter(
      {
        key: selectedId,
        comparator: selectedComparator,
        value:
          selectedColumn?.type === FilterTypeCategories.Date
            ? dateValue?.toISOString() || ''
            : value,
        type: selectedColumn?.type,
        tagKey,
      },
      selectedColumn!,
    );
    setValue('');
    setTagKey('');
    setDateValue(null);
  };

  useEffect(() => {
    setSelectedComparator(
      selectedColumn?.comparators?.[0] || FilterComparator.IsEqual,
    );
    setValue('');
    setTagKey('');
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
        onOdsChange={(e) => setDateValue(e.detail.value || null)}
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
  } else if (selectedColumn?.options && selectedColumn.options.length > 0) {
    inputComponent = (
      <OdsSelect
        key={`filter-add_value-select-${selectedId}`}
        value={value}
        name={`filter-add_value-select-${selectedId}`}
        data-testid="filter-add_value-select"
        onOdsChange={(event) => setValue(event.detail.value as string)}
      >
        {selectedColumn?.options?.map((option) => (
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
            key={`add-filter_select_idColumn-${selectedId}`}
            value={selectedId}
            name={`add-filter_select_idColumn-${selectedId}`}
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
                key={`add-operator-${selectedColumn.id}`}
                name={`add-operator-${selectedColumn.id}`}
                value={selectedComparator}
                onOdsChange={(event) => {
                  setSelectedComparator(event.detail.value as FilterComparator);
                }}
                data-testid={`add-operator-${selectedColumn.id}`}
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
      {selectedColumn?.type !== FilterTypeCategories.Tags && (
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
      )}
      {selectedColumn?.type === FilterTypeCategories.Tags && (
        <TagsFilterForm
          resourceType={resourceType || ''}
          tagKey={tagKey}
          setTagKey={setTagKey}
          value={value}
          setValue={setValue}
          data-testid="filter-tag-inputs"
        />
      )}
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
