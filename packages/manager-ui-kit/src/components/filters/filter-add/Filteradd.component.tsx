import { Fragment, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
} from '@ovhcloud/ods-react';

import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';

import { Button } from '../../button/Button.component';
import '../translations';
import { FilterAddProps } from './FilterAdd.props';
import { FilterSectionValue } from './filter-section-value/FilterSectionValue.component';
import { FilterTagsForm } from './filter-tags-form/FilterTagsForm.component';

export function FilterAdd({ columns, onAddFilter, resourceType }: Readonly<FilterAddProps>) {
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
      return !Number.isNaN(Number(value)) && value !== '';
    }

    if (selectedColumn?.type === FilterTypeCategories.Tags) {
      return (
        (!!tagKey && !!value) ||
        (!!tagKey &&
          [FilterComparator.TagExists, FilterComparator.TagNotExists].includes(selectedComparator))
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
    setSelectedComparator(selectedColumn?.comparators?.[0] || FilterComparator.IsEqual);
    setValue('');
    setTagKey('');
    setDateValue(null);
  }, [selectedColumn]);

  return (
    <>
      <div className="w-full">
        <FormField>
          <FormFieldLabel>{t('common_criteria_adder_column_label')}</FormFieldLabel>
          <Select
            key={`add-filter_select_idColumn-${selectedId}`}
            name={`add-filter_select_idColumn-${selectedId}`}
            value={[selectedId]}
            onValueChange={(detail) => setSelectedId(detail.value[0])}
            data-testid="add-filter_select_idColumn"
            items={columns.map(({ id, label }) => ({
              label,
              value: id,
            }))}
          >
            <SelectControl />
            <SelectContent createPortal={false} />
          </Select>
        </FormField>
      </div>
      <div className="mt-4 w-full">
        <FormField>
          <FormFieldLabel>{t('common_criteria_adder_operator_label')}</FormFieldLabel>
          {selectedColumn && (
            <div data-testid={`add-operator-${selectedColumn.id}`}>
              <Select
                key={`add-operator-${selectedColumn.id}`}
                name={`add-operator-${selectedColumn.id}`}
                value={[selectedComparator]}
                onValueChange={(detail) => {
                  setSelectedComparator(detail.value[0] as FilterComparator);
                }}
                items={selectedColumn.comparators?.map((comp) => ({
                  label: t(`common_criteria_adder_operator_${comp}`),
                  value: comp,
                }))}
              >
                <SelectControl />
                <SelectContent createPortal={false} />
              </Select>
            </div>
          )}
        </FormField>
      </div>
      {selectedColumn?.type !== FilterTypeCategories.Tags && (
        <div className="mt-4 w-full">
          <FormField>
            <FormFieldLabel>{t('common_criteria_adder_value_label')}</FormFieldLabel>
            <FilterSectionValue
              selectedColumn={selectedColumn}
              value={value}
              setValue={setValue}
              submitAddFilter={submitAddFilter}
              selectedId={selectedId}
              dateValue={dateValue}
              setDateValue={setDateValue}
            />
          </FormField>
        </div>
      )}
      {selectedColumn?.type === FilterTypeCategories.Tags && (
        <div className="mt-4 w-full" data-testid="filter-tag-inputs">
          <FilterTagsForm
            resourceType={resourceType || ''}
            tagKey={tagKey}
            setTagKey={setTagKey}
            value={value}
            setValue={setValue}
          />
        </div>
      )}
      <div className="mt-4 w-full">
        <Button
          className="w-full filter-add-button-submit z-[1]"
          size={BUTTON_SIZE.sm}
          disabled={!isInputValid}
          onClick={submitAddFilter}
          data-testid="filter-add_submit"
        >
          {t('common_criteria_adder_submit_label')}
        </Button>
      </div>
    </>
  );
}
