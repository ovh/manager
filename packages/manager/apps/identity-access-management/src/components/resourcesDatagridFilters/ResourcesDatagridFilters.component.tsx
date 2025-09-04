import { OdsTag } from '@ovhcloud/ods-components/react';
import { ODS_TAG_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useResourcesDatagridContext } from '../resourcesDatagrid/ResourcesDatagridContext';
import { ResourcesDatagridFilter } from '../resourcesDatagridTopbar/ResourcesDatagridTopbar.component';

export default function ResourcesDatagridFilters() {
  const { filters, removeFilter } = useResourcesDatagridContext();
  const { t } = useTranslation('tag-manager');

  const formatLabel = (filter: ResourcesDatagridFilter) => {
    if (filter.tagKey) {
      return `${t(`resourceDatagridColumn_${filter.column}`)} : ${
        filter.tagKey
      }:${filter.value}`;
    }

    return `${t(`resourceDatagridColumn_${filter.column}`)} : ${filter.value}`;
  };

  return (
    <div className="flex gap-4 flex-wrap mx-4 justify-end w-full">
      {filters?.map((filter) =>
        !filter.hidden ? (
          <OdsTag
            color={ODS_TAG_COLOR.information}
            size="lg"
            key={filter.id}
            onOdsRemove={() => removeFilter(filter)}
            label={formatLabel(filter)}
            data-testid="filter-tag"
          />
        ) : null,
      )}
    </div>
  );
}
