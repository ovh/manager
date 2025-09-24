import { ActionMenu } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useMemo } from 'react';
import {
  APP_NAME,
  STATUS_DISABLED,
  STATUS_SUSPENDED,
  SUB_UNIVERSE,
  UNIVERSE,
} from '@/constants';
import { TObject } from '@/api/data/container';
import { downloadObject } from '@/api/data/download';
import { TContainer } from '@/pages/dashboard/BucketPropertiesCard';
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

  const { trackClick } = useOvhTracking();
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

  const trackAction = (actionType: string) => {
    trackClick({
      actions: [
        UNIVERSE,
        SUB_UNIVERSE,
        APP_NAME,
        `${object.name || object.key}`,
        'button',
        actionType,
      ],
    });
  };

  const handleDownload = async () => {
    trackAction('download_object_versioning');
    await downloadObject(object, container, projectId);
  };

  const encodeName = (name: string) => btoa(encodeURIComponent(name));

  const navigateToVersions = () => {
    trackAction('details_object_versioning');
    const baseUrl = `./${encodeName(
      object.name || object.key,
    )}/versions?region=${container.region}`;
    navigate(baseUrl);
  };

  const navigateToDelete = () => {
    trackAction('delete_object_versioning');
    const baseUrl = `./${encodeName(object.name || object.key)}/delete?region=${
      container.region
    }`;

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
  };

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
      onClick: navigateToVersions,
    },
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_containers_container_delete_label',
      ),
      onClick: navigateToDelete,
    },
  ].filter(Boolean);

  return (
    <ActionMenu
      id={object.index}
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
}
