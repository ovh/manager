import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { format } from 'date-fns';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import * as dateFnsLocales from 'date-fns/locale';
import { useRef } from 'react';
import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';
import { createSearchParams, useHref } from 'react-router-dom';
import clsx from 'clsx';
import ActionsComponent from './ActionsComponent';
import { TObject } from '@/api/data/container';
import { TContainer } from '@/pages/objects/container/object/show/Show.page';

import { shouldShowVersions } from './useShouldShowVersions';

export type TIndexedObject = TObject & { index: string };

export const useDatagridColumn = ({
  container,
  isLocalZone,
  shouldSeeVersions,
  enableVersionsToggle,
  isLastElement,
}: {
  container: TContainer;
  isLocalZone: boolean;
  shouldSeeVersions?: boolean;
  enableVersionsToggle?: boolean;
  isLastElement?: boolean;
}) => {
  const { i18n, t } = useTranslation('container');
  const { formatBytes } = useBytes();
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);

  const columns: DatagridColumn<TIndexedObject>[] = [
    {
      id: 'name',
      cell: (props: TIndexedObject) => {
        const isLink = shouldShowVersions({
          isLatest: props.isLatest,
          isLocalZone,
          shouldSeeVersions,
          enableVersionsToggle,
          versioningStatus: container.versioning?.status,
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
                <OdsLink
                  color="primary"
                  href={useHref({
                    pathname: `./${props.name || props.key}/versions`,
                    search: `?${createSearchParams({
                      region: container.region,
                    })}`,
                  })}
                  label={props.name || props.key}
                />
              ) : (
                <DataGridTextCell>{props.name || props.key}</DataGridTextCell>
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
      },
      label: t('pci_projects_project_storages_containers_container_name_label'),
    },
    {
      id: 'lastModified',
      cell: (props: TIndexedObject) => (
        <div
          className={clsx({
            'is-latest': props.versionId && props.isLatest,
          })}
        >
          <DataGridTextCell>
            {format(props.lastModified, 'dd MMM yyyy HH:mm:ss', {
              locale: locales[userLocale],
            })}
          </DataGridTextCell>
        </div>
      ),
      label: t(
        'pci_projects_project_storages_containers_container_lastModified_label',
      ),
    },
    container?.s3StorageType && {
      id: 'storageClass',
      cell: (props: TIndexedObject) => (
        <div
          className={clsx({
            'is-latest': props.versionId && props.isLatest,
          })}
        >
          <DataGridTextCell>
            {props.storageClass
              ? t(
                  `pci_projects_project_storages_containers_container_storage_class_${props.storageClass}`,
                )
              : ''}
          </DataGridTextCell>
        </div>
      ),
      label: t(
        'pci_projects_project_storages_containers_container_storage_class_label',
      ),
    },
    {
      id: 'size',
      cell: (props: TIndexedObject) => (
        <div
          className={clsx({
            'is-latest': props.versionId && props.isLatest,
          })}
        >
          <DataGridTextCell>
            {formatBytes(props.size, 2, 1024)}
          </DataGridTextCell>
        </div>
      ),
      label: t('pci_projects_project_storages_containers_container_size_label'),
    },
    !container?.s3StorageType && {
      id: 'contentType',
      cell: (props: TIndexedObject) => (
        <div
          className={clsx({
            'is-latest': props.versionId && props.isLatest,
          })}
        >
          <DataGridTextCell>{props.contentType}</DataGridTextCell>
        </div>
      ),
      label: t(
        'pci_projects_project_storages_containers_container_contentType_label',
      ),
    },
    {
      id: 'actions',
      cell: (props: TIndexedObject) => (
        <div
          className={clsx({
            'is-latest': props.versionId && props.isLatest,
          })}
        >
          <ActionsComponent
            object={props}
            container={container}
            isLocalZone={isLocalZone}
            shouldSeeVersions={shouldSeeVersions}
            enableVersionsToggle={enableVersionsToggle}
            isLastElement={isLastElement}
          />
        </div>
      ),
      label: '',
      isSortable: false,
    },
  ].filter(Boolean);

  return columns;
};
