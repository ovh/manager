import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ShellContext, useTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useContext, useMemo } from 'react';
import {
  STATUS_DISABLED,
  STATUS_SUSPENDED,
  TRACKING_PREFIX,
} from '@/constants';
import { TObject } from '@/api/data/container';
import { downloadObject } from '@/api/data/download';
import { TContainer } from '@/pages/objects/container/object/show/Show.page';
import { shouldShowVersions } from './useShouldShowVersions';

type TIndexedObject = TObject & { index: string };

export default function ActionsComponent({
  object,
  container,
  isLocalZone,
  shouldSeeVersions,
  enableVersionsToggle,
  isLastElement,
}: Readonly<{
  object: TIndexedObject;
  container: TContainer;
  isLocalZone: boolean;
  shouldSeeVersions?: boolean;
  enableVersionsToggle?: boolean;
  isLastElement?: boolean;
}>) {
  const { t } = useTranslation('container');

  const { tracking } = useContext(ShellContext).shell;
  const navigate = useNavigate();

  const { projectId } = useParams();

  const shouldShowVersionsAction = useMemo(
    () =>
      shouldShowVersions({
        isLatest: object.isLatest,
        isLocalZone,
        shouldSeeVersions,
        enableVersionsToggle,
        versioningStatus: container.versioning?.status,
      }),
    [
      object.isLatest,
      isLocalZone,
      shouldSeeVersions,
      enableVersionsToggle,
      container.versioning?.status,
    ],
  );

  const handleDownload = async () => {
    tracking?.trackClick({
      name: `${TRACKING_PREFIX}object::download-file`,
      type: 'action',
    });

    await downloadObject(object, container, projectId);
  };

  const encodeName = (name: string) => btoa(encodeURIComponent(name));

  const items = [
    !object.isDeleteMarker && {
      id: 0,
      label: t(
        'pci_projects_project_storages_containers_container_download_label',
      ),
      onClick: handleDownload,
    },
    shouldShowVersionsAction && {
      id: 1,
      label: t(
        'pci_projects_project_storages_containers_container_show_versions',
      ),
      onClick: () => {
        const baseUrl = `./${encodeName(
          object.name || object.key,
        )}/versions?region=${container.region}`;

        navigate(baseUrl);
      },
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
        const isLastElementParam = isLastElement ? '&isLastElement=true' : '';

        navigate(
          baseUrl +
            versionParam +
            isLocalZoneParam +
            isSwiftParam +
            isVersioningDisabledParam +
            isVersioningSuspendedParam +
            isLastElementParam,
        );
      },
    },
  ].filter(Boolean);

  return <ActionMenu id={object.index} items={items} isCompact />;
}
