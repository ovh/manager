import { JSX } from 'react';

import {
  Datepicker,
  DatepickerContent,
  DatepickerControl,
  INPUT_TYPE,
  Input,
  Select,
  SelectContent,
  SelectControl,
} from '@ovhcloud/ods-react';

import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

import { FilterSectionValueProps } from './FilterSectionValue.props';

export const FilterSectionValue = ({
  selectedColumn,
  value,
  setValue,
  submitAddFilter,
  selectedId,
  dateValue,
  setDateValue,
}: FilterSectionValueProps) => {
  let inputComponent: JSX.Element = null;
  if (selectedColumn?.type === FilterTypeCategories.Date) {
    inputComponent = (
      <div data-testid="filter-add_value-date" className="z-[2]">
        <Datepicker
          className="border"
          name="filter-add_value-date"
          value={dateValue}
          onValueChange={(detail) => setDateValue(detail.value || null)}
        >
          <DatepickerControl clearable />
          <DatepickerContent createPortal={false} />
        </Datepicker>
      </div>
    );
  } else if (selectedColumn?.type === FilterTypeCategories.Numeric) {
    inputComponent = (
      <Input
        name="filter-add_value-input"
        className="border"
        type={INPUT_TYPE.text}
        value={value}
        pattern="(\+|-)?[0-9]+([.][0-9]+)?"
        data-testid="filter-add_value-numeric"
        onChange={(e) => setValue(`${e.target.value}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submitAddFilter();
          }
        }}
      />
    );
  } else if (selectedColumn?.options && selectedColumn.options.length > 0) {
    inputComponent = (
      <Select
        key={`filter-add_value-select-${selectedId}`}
        value={[value]}
        name={`filter-add_value-select-${selectedId}`}
        data-testid="filter-add_value-select"
        onValueChange={(detail) => setValue(detail.value[0])}
        items={selectedColumn?.options?.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
      >
        <SelectControl />
        <SelectContent createPortal={false} />
      </Select>
    );
  } else {
    inputComponent = (
      <Input
        name="filter-add_value-input"
        className="border"
        type={INPUT_TYPE.text}
        value={value}
        data-testid="filter-add_value-input"
        onChange={(e) => setValue(`${e.target.value}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            submitAddFilter();
          }
        }}
      />
    );
  }

  return inputComponent;
};
