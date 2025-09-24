import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';
import { createSearchParams, useHref } from 'react-router-dom';
import clsx from 'clsx';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { TFunction } from 'i18next';
import { TIndexedObject } from './useDatagridColumn';

interface NameCellProps {
  props: TIndexedObject;
  isLink: boolean;
  name: string;
  containerRegion: string;
  t: TFunction;
}

export const NameCell = ({
  props,
  isLink,
  name,
  containerRegion,
  t,
}: NameCellProps) => {
  const href = useHref({
    pathname: `./${btoa(encodeURIComponent(name))}/versions`,
    search: `?${createSearchParams({
      region: containerRegion,
    })}`,
  });

  return (
    <div
      className={clsx({
        'is-latest': props.versionId && props.isLatest,
        'ml-6': props.versionId && !props.isLatest,
      })}
    >
      <div className="flex flex-col">
        {isLink ? (
          <OdsLink color="primary" href={href} label={name} />
        ) : (
          <DataGridTextCell>{name}</DataGridTextCell>
        )}
        {props.isDeleteMarker && (
          <OdsBadge
            className="mt-3"
            size="sm"
            label={t(
              'pci_projects_project_storages_containers_container_delete_marker',
            )}
          />
        )}
      </div>
    </div>
  );
};
