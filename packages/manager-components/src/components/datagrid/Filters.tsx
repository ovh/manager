import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ColumnSort as TanstackColumnSort,
  PaginationState as TanstackPaginationState,
  Table,
} from '@tanstack/react-table';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
  OsdsSelect,
  OsdsSelectOption,
  OsdsInput,
  OsdsChip,
  OsdsPopover,
  OsdsPopoverContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  OsdsInputCustomEvent,
  OdsInputValueChangeEventDetail,
} from '@ovhcloud/ods-components';

export type ColumnSort = TanstackColumnSort;
export type PaginationState = TanstackPaginationState;

const Filtertrans = {
  INCLUDES: 'common_criteria_adder_operator_string_contains',
  DOESNT_INCLUDE: 'common_criteria_adder_operator_string_containsNot',
  START_WITH: 'common_criteria_adder_operator_string_startsWith',
  ENDS_WITH: 'common_criteria_adder_operator_string_endsWith',
  EQUALS_TO: 'common_criteria_adder_operator_number_is',
  NB_EQUALS_TO: 'common_criteria_adder_operator_number_is',
  DIFFERENT_FROM: 'common_criteria_adder_operator_boolean_isNot',
  DATE_IS: 'common_criteria_adder_operator_date_is',
  DATE_BEFORE: 'common_criteria_adder_operator_date_isBefore',
  DATE_AFTER: 'common_criteria_adder_operator_date_isAfter',
  SMALLER_THAN: 'common_criteria_adder_operator_number_smaller',
  BIGGER_THAN: 'common_criteria_adder_operator_number_bigger',
};

const FilterStringOptions = [
  'INCLUDES',
  'DOESNT_INCLUDE',
  'START_WITH',
  'ENDS_WITH',
  'EQUALS_TO',
  'DIFFERENT_FROM',
];

const FilterNumberOptions = ['NB_EQUALS_TO', 'SMALLER_THAN', 'BIGGER_THAN'];
const FilterDateOptions = ['DATE_IS', 'DATE_BEFORE', 'DATE_AFTER'];

export type FilterFnOption<TData extends any> = 'auto' | 'customFilter';

const ColumnsField = ({ columns, setFilters, filters }: any) => {
  const { t } = useTranslation('datagrid');
  return (
    <>
      <div>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._200}
        >
          {t('common_criteria_adder_column_label')}
        </OsdsText>
      </div>
      <div>
        <OsdsSelect
          required
          value={filters.id}
          onOdsValueChange={(value: any) =>
            setFilters((previousValue: any) => {
              const type = columns.filter(
                (column: any) => column.id === value.detail.value,
              );
              return {
                id: value.detail.value,
                condition:
                  type[0].type === 'string'
                    ? FilterStringOptions[0]
                    : type[0]?.type === 'number'
                    ? FilterNumberOptions[0]
                    : FilterDateOptions[0],
                value: previousValue.value,
                type: type[0]?.type,
              };
            })
          }
        >
          {columns
            .filter((element: any) => element !== 'iam')
            .map((column: any) => (
              <OsdsSelectOption key={column.id} value={column.id}>
                {column.id}
              </OsdsSelectOption>
            ))}
        </OsdsSelect>
      </div>
    </>
  );
};

const FilterSelectString = ({ filters, setFilters }: any) => {
  const { t } = useTranslation('datagrid');
  return (
    <OsdsSelect
      required
      id="filter-condition"
      value={filters.condition}
      onOdsValueChange={(value: any) =>
        setFilters((previousValue: any) => ({
          id: previousValue.id,
          condition: value.detail.value,
          value: previousValue.value,
          type: previousValue.type,
        }))
      }
    >
      {FilterStringOptions.map((condition: string) => (
        <OsdsSelectOption key={condition} value={condition}>
          {
            // @ts-ignore
            t(Filtertrans[condition as string] as string)
          }
        </OsdsSelectOption>
      ))}
    </OsdsSelect>
  );
};

const FilterSelectNumber = ({ filters, setFilters }: any) => {
  const { t } = useTranslation('datagrid');
  return (
    <OsdsSelect
      required
      id="filter-condition"
      value={filters.condition}
      onOdsValueChange={(value: any) =>
        setFilters((previousValue: any) => ({
          id: previousValue.id,
          condition: value.detail.value,
          value: previousValue.value,
          type: previousValue.type,
        }))
      }
    >
      {FilterNumberOptions.map((condition: string) => (
        <OsdsSelectOption key={condition} value={condition}>
          {
            // @ts-ignore
            t(Filtertrans[condition as string] as string)
          }
        </OsdsSelectOption>
      ))}
    </OsdsSelect>
  );
};

const FilterSelectDate = ({ filters, setFilters }: any) => {
  const { t } = useTranslation('datagrid');
  return (
    <OsdsSelect
      required
      id="filter-condition"
      value={filters.condition}
      onOdsValueChange={(value: any) =>
        setFilters((previousValue: any) => ({
          id: previousValue.id,
          condition: value.detail.value,
          value: previousValue.value,
          type: previousValue.type,
        }))
      }
    >
      {FilterDateOptions.map((condition: string) => (
        <OsdsSelectOption key={condition} value={condition}>
          {
            // @ts-ignore
            t(Filtertrans[condition as string] as string)
          }
        </OsdsSelectOption>
      ))}
    </OsdsSelect>
  );
};

const ConditionField = ({ setFilters, filters }: any) => {
  const { t } = useTranslation('datagrid');
  return (
    <>
      <div>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._200}
        >
          {t('common_criteria_adder_operator_label')}
        </OsdsText>
      </div>
      <div>
        {filters?.type === 'string' && (
          <FilterSelectString filters={filters} setFilters={setFilters} />
        )}
        {filters?.type === 'number' && (
          <FilterSelectNumber filters={filters} setFilters={setFilters} />
        )}
        {filters?.type === 'date' && (
          <FilterSelectDate filters={filters} setFilters={setFilters} />
        )}
      </div>
    </>
  );
};

const FiltersCascading = ({
  table,
  columns,
}: {
  table: Table<any>;
  columns: any;
}) => {
  const { t } = useTranslation('datagrid');
  const FieldsByDefault = {
    id: columns[0]?.[Object.keys(columns[0])[0]] || '',
    condition:
      columns[0].type === 'string'
        ? FilterStringOptions[0]
        : columns[0].type === 'number'
        ? FilterNumberOptions[0]
        : FilterDateOptions[0],
    value: '',
    type: columns[0].type,
  };
  const [filtersTab, setFiltersTab] = useState([
    // {
    //   id: 'id',
    //   condition: 'INCLUDES',
    //   value: '33bf',
    // },
    // {
    //   id: 'id',
    //   condition: 'INCLUDES',
    //   value: '015',
    // },
    // {
    //   id: 'name',
    //   condition: 'INCLUDES',
    //   value: 'Nico',
    // },
    // {
    //   id: 'name',
    //   condition: 'EQUALS',
    //   value: 'Allow_project_PCI_Nico',
    // },
    // {
    //   id: 'name',
    //   condition: 'ENDS_WITH',
    //   value: '23',
    // },
    // {
    //   id: 'name',
    //   condition: 'START_WITH',
    //   value: 'check',
    // },
    // {
    //   id: 'id',
    //   condition: 'DOESNT_INCLUDE',
    //   value: 'be',
    // },
    // {
    //   id: 'id',
    //   condition: 'DIFFERENT_FROM',
    //   value: 'be733bf6-a249-457a-80ff-3978e05ab202',
    // },
    // {
    //   id: 'vcore',
    //   condition: 'NB_EQUALS_TO',
    //   value: 8,
    // },
  ]);
  const [filters, setFilters] = useState(FieldsByDefault);
  useEffect(() => {
    table?.setColumnFilters(filtersTab);
  }, [filtersTab]);

  return (
    <div>
      <OsdsPopover>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          slot="popover-trigger"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
        >
          <span>
            <OsdsIcon
              name={ODS_ICON_NAME.FILTER}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.xxs}
            />
          </span>
          <span>Filter</span>
        </OsdsButton>
        <OsdsPopoverContent>
          <div style={{ width: '200px', padding: '10px' }}>
            <div className="pb-4">
              <ColumnsField
                columns={columns}
                setFilters={setFilters}
                filters={filters}
              />
            </div>
            <div className="pb-4">
              <ConditionField setFilters={setFilters} filters={filters} />
            </div>
            <div className="pb-4">
              <div>
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._200}
                >
                  {t('common_criteria_adder_value_label')}
                </OsdsText>
              </div>
              <div>
                <OsdsInput
                  type={ODS_INPUT_TYPE.text}
                  value={filters.value}
                  onOdsValueChange={(
                    e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
                  ) =>
                    setFilters((previousValue) => ({
                      id: previousValue.id,
                      condition: previousValue.condition,
                      value: e.detail.value,
                      type: previousValue.type,
                    }))
                  }
                />
              </div>
            </div>
            <div className="pb-4">
              <OsdsButton
                {...(filters?.value.length > 0 ? {} : { disabled: true })}
                size={ODS_BUTTON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => {
                  if (filters?.value.length > 0) {
                    document.body.click();
                    setFilters(FieldsByDefault);
                    setFiltersTab((prev) => [...prev, filters]);
                  }
                }}
              >
                {t('common_criteria_adder_submit_label')}
              </OsdsButton>
            </div>
          </div>
        </OsdsPopoverContent>
      </OsdsPopover>
      <div>
        <div className="flex flex-wrap mb-4">
          {filtersTab?.map((elem, index) => (
            <div key={index} className="w-fit mr-3 mt-4">
              <OsdsChip
                color={ODS_THEME_COLOR_INTENT.primary}
                onOdsChipRemoval={() => {
                  const column = table?.getColumn(elem.id);
                  column?.setFilterValue('');
                  setFiltersTab(filtersTab.filter((_, i) => i !== index));
                }}
                removable
              >
                <OsdsText>
                  {elem.id} {elem.condition} {elem.value}
                </OsdsText>
              </OsdsChip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersCascading;
