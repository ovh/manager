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
import clsx from 'clsx';
import ActionsComponent from './ActionsComponent';
import { TObject } from '@/api/data/container';
import { TContainer } from '@/pages/dashboard/BucketPropertiesCard';

import { shouldShowVersions } from './useShouldShowVersions';
import { NameCell } from './NameCell';
import UseStandardInfrequentAccessAvailability from '@/hooks/useStandardInfrequentAccessAvailability';

export type TIndexedObject = TObject & { index: string };

export const useDatagridColumn = ({
  container,
  isLocalZone,
  shouldSeeVersions,
  enableVersionsToggle,
  isLastElement,
  shouldSeeSearch,
}: {
  container: TContainer;
  isLocalZone: boolean;
  shouldSeeVersions?: boolean;
  enableVersionsToggle?: boolean;
  isLastElement?: boolean;
  shouldSeeSearch?: boolean;
}) => {
  const { i18n, t } = useTranslation('container');
  const { formatBytes } = useBytes();
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);

  const hasStandardInfrequentAccess = UseStandardInfrequentAccessAvailability();

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

        const name = props.name || props.key;

        return (
          <NameCell
            props={props}
            isLink={isLink}
            name={name}
            containerRegion={container.region}
            t={t}
          />
        );
      },
      label: t('pci_projects_project_storages_containers_container_name_label'),
      isSearchable: !!container?.s3StorageType && !!shouldSeeSearch,
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
                  hasStandardInfrequentAccess
                    ? `pci_projects_project_storages_containers_container_storage_class_standard_infrequent_access_${props.storageClass}`
                    : `pci_projects_project_storages_containers_container_storage_class_${props.storageClass}`,
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
