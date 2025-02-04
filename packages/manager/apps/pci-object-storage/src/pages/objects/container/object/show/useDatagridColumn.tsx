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
import ActionsComponent from './ActionsComponent';
import { TObject } from '@/api/data/container';
import { TContainer } from '@/pages/objects/container/object/show/Show.page';

type TIndexedObject = TObject & { index: string };

export const useDatagridColumn = ({
  container,
  isLocalZone,
}: {
  container: TContainer;
  isLocalZone: boolean;
}) => {
  const { i18n, t } = useTranslation('container');
  const { formatBytes } = useBytes();
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);

  const columns: DatagridColumn<TIndexedObject>[] = [
    {
      id: 'name',
      cell: (props: TIndexedObject) => (
        <DataGridTextCell>{props.name || props.key}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_container_name_label'),
    },
    {
      id: 'lastModified',
      cell: (props: TIndexedObject) => (
        <DataGridTextCell>
          {format(props.lastModified, 'dd MMM yyyy HH:mm:ss', {
            locale: locales[userLocale],
          })}
        </DataGridTextCell>
      ),
      label: t(
        'pci_projects_project_storages_containers_container_lastModified_label',
      ),
    },
    container?.s3StorageType && {
      id: 'storageClass',
      cell: (props: TIndexedObject) => (
        <DataGridTextCell>
          {t(
            `pci_projects_project_storages_containers_container_storage_class_${props.storageClass}`,
          )}
        </DataGridTextCell>
      ),
      label: t(
        'pci_projects_project_storages_containers_container_storage_class_label',
      ),
    },
    {
      id: 'size',
      cell: (props: TIndexedObject) => (
        <DataGridTextCell>{formatBytes(props.size, 2)}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_container_size_label'),
    },
    !container?.s3StorageType && {
      id: 'contentType',
      cell: (props: TIndexedObject) => (
        <DataGridTextCell>{props.contentType}</DataGridTextCell>
      ),
      label: t(
        'pci_projects_project_storages_containers_container_contentType_label',
      ),
    },
    {
      id: 'actions',
      cell: (props: TIndexedObject) => (
        <ActionsComponent
          object={props}
          container={container}
          isLocalZone={isLocalZone}
        />
      ),
      label: '',
      isSortable: false,
    },
  ].filter(Boolean);

  return columns;
};
