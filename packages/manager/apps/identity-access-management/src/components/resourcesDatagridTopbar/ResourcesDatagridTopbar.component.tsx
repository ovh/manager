import {
  OdsButton,
  OdsCombobox,
  OdsComboboxItem,
  OdsFormField,
  OdsInput,
  OdsPopover,
  OdsSelect,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ODS_BADGE_SIZE,
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { PropsWithChildren, useMemo, useRef, useState } from 'react';
import {
  DatagridColumn,
  TagsFilterForm,
} from '@ovh-ux/manager-react-components';
import { useIamResourceTypeList } from '@/data/hooks/useIamResources';
import './resourceDatagridTopbar.scss';
import { useResourcesDatagridContext } from '../resourcesDatagrid/ResourcesDatagridContext';
import { ResourceDatagridColumn } from '../resourcesDatagrid/ResourcesDatagrid.component';
import ResourcesDatagridFilters from '../resourcesDatagridFilters/ResourcesDatagridFilters.component';

export type ResourcesDatagridFilter = {
  id: string;
  column: string;
  value: string;
  tagKey?: string;
  hidden?: boolean;
};

export type ResourcesDatagridTopbarProps = {
  columns: Array<DatagridColumn<unknown>>;
};

export default function ResourcesDatagridTopbar({
  columns,
  children,
}: PropsWithChildren<ResourcesDatagridTopbarProps>) {
  const { addFilter } = useResourcesDatagridContext();
  const { t } = useTranslation([NAMESPACES.ACTIONS, 'tag-manager']);
  const [selectedColumn, setSelectedColumn] = useState<ResourceDatagridColumn>(
    columns[0].id as ResourceDatagridColumn,
  );
  const [tagKey, setTagKey] = useState('');
  const [value, setValue] = useState('');
  const filterPopoverRef = useRef(null);
  const { data: resourceTypeList } = useIamResourceTypeList();

  const isButtonDisabled = useMemo(() => {
    if (selectedColumn === 'tags') {
      return !tagKey || !value;
    }

    setTagKey('');

    return !value;
  }, [selectedColumn, tagKey, value]);

  const validateFilter = () => {
    addFilter({
      id: `${selectedColumn}:${value}${tagKey ? `:${tagKey}` : ''}`,
      column: selectedColumn,
      value,
      tagKey,
    });
    setSelectedColumn(ResourceDatagridColumn.DISPLAYNAME);
    setValue('');
    setTagKey('');
    filterPopoverRef?.current?.hide();
  };

  return (
    <div className="flex justify-between items-center">
      <section className="shrink-0">{children}</section>
      <ResourcesDatagridFilters />
      <aside className="shrink-0">
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:filter`)}
          id="datagrid-resource-filter-popover-trigger"
          slot="datagrid-resource-filter-popover-trigger"
          variant={ODS_BUTTON_VARIANT.outline}
          size={ODS_BADGE_SIZE.sm}
          icon={ODS_ICON_NAME.filter}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.left}
        />
        <OdsPopover
          ref={filterPopoverRef}
          triggerId="datagrid-resource-filter-popover-trigger"
          with-arrow
        >
          <div className="flex flex-col gap-5">
            <OdsFormField>
              <OdsText slot="label" preset={ODS_TEXT_PRESET.heading6}>
                {t('tag-manager:resourceDatagridColumnFilter')}
              </OdsText>
              <OdsSelect
                key="datagrid-resource-filter-column"
                name="datagrid-resource-filter-column"
                data-testid="datagrid-resource-filter-column"
                onOdsChange={(event) =>
                  setSelectedColumn(
                    event.detail.value as ResourceDatagridColumn,
                  )
                }
                value={selectedColumn}
              >
                {columns.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </OdsSelect>
            </OdsFormField>
            {[
              ResourceDatagridColumn.DISPLAYNAME,
              ResourceDatagridColumn.TYPE,
            ].includes(selectedColumn) && (
              <OdsFormField>
                <OdsText slot="label" preset={ODS_TEXT_PRESET.heading6}>
                  {t(`tag-manager:resourceDatagridColumnValue`)}
                </OdsText>

                {selectedColumn === ResourceDatagridColumn.DISPLAYNAME && (
                  <OdsInput
                    name="resource-displayname"
                    type={ODS_INPUT_TYPE.text}
                    onOdsChange={(event) => {
                      setValue(event.detail.value as string);
                    }}
                    data-testid="resource-displayname-input"
                    value={value}
                  />
                )}
                {selectedColumn === ResourceDatagridColumn.TYPE && (
                  <OdsCombobox
                    name="resource-type"
                    allowNewElement={false}
                    onOdsChange={(event) => {
                      setValue(event.detail.value);
                    }}
                    data-testid="resource-type-combobox"
                  >
                    {!resourceTypeList && <OdsSkeleton />}
                    {resourceTypeList &&
                      resourceTypeList.map((type) => (
                        <OdsComboboxItem
                          key={type.value}
                          value={type.value}
                          searchLabel={`${type.label}${type.value}`}
                          selectionLabel={type.label}
                        >
                          {type.label}
                        </OdsComboboxItem>
                      ))}
                  </OdsCombobox>
                )}
              </OdsFormField>
            )}
            {selectedColumn === ResourceDatagridColumn.TAGS && (
              <TagsFilterForm
                setTagKey={setTagKey}
                setValue={setValue}
                tagKey={tagKey}
                value={value}
                resourceType={null}
                data-testid="resource-tag-form"
              />
            )}
            <OdsButton
              className="w-full resource-datagrid-filter-add-button-submit"
              label={t(`${NAMESPACES.ACTIONS}:filter`)}
              variant={ODS_BUTTON_VARIANT.default}
              isDisabled={isButtonDisabled}
              onClick={validateFilter}
            />
          </div>
        </OdsPopover>
      </aside>
    </div>
  );
}
