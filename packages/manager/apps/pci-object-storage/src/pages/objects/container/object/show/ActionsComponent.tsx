import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ShellContext, useTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useContext } from 'react';
import {
  STATUS_DISABLED,
  STATUS_SUSPENDED,
  TRACKING_PREFIX,
} from '@/constants';
import { TObject } from '@/api/data/container';
import { downloadObject } from '@/api/data/download';
import { TContainer } from '@/pages/objects/container/object/show/Show.page';

type TIndexedObject = TObject & { index: string };

export default function ActionsComponent({
  object,
  container,
  isLocalZone,
}: Readonly<{
  object: TIndexedObject;
  container: TContainer;
  isLocalZone: boolean;
}>) {
  const { t } = useTranslation('container');

  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();

  const { projectId } = useParams();

  const handleDownload = async () => {
    tracking?.trackClick({
      name: `${TRACKING_PREFIX}object::download-file`,
      type: 'action',
    });

    await downloadObject(object, container, projectId);
  };

  const encodeName = (name: string) =>
    encodeURIComponent(name.replace(/\//, '~2F'));

  const items = [
    !object.isDeleteMarker && {
      id: 1,
      label: t(
        'pci_projects_project_storages_containers_container_download_label',
      ),
      onClick: handleDownload,
    },
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_containers_container_delete_label',
      ),
      onClick: () => {
        const baseUrl = `./${encodeName(
          object.name || object.key,
        )}/delete?region=${container.region}`;

        const versionParam = object.versionId
          ? `&versionId=${object.versionId}`
          : '';

        const isLocalZoneParam = isLocalZone ? '&isLocalZone=true' : '';
        const isSwiftParam = !container.s3StorageType ? '&isSwift=true' : '';
        const isVersioningDisabledParam =
          container.versioning?.status === STATUS_DISABLED
            ? '&isVersioningDisabled=true'
            : '';
        const isVersioningSuspendedParam =
          container.versioning?.status === STATUS_SUSPENDED
            ? '&isVersioningSuspended=true'
            : '';

        navigate(
          baseUrl +
            versionParam +
            isLocalZoneParam +
            isSwiftParam +
            isVersioningDisabledParam +
            isVersioningSuspendedParam,
        );
      },
    },
  ].filter(Boolean);

  return <ActionMenu id={object.index} items={items} isCompact />;
}
