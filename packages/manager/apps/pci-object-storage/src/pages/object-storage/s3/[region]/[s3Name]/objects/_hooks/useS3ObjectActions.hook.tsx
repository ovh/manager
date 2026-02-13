import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { DropdownMenuItemVariant, useToast } from '@datatr-ux/uxlib';
import { Files, Pen, Trash, ArchiveRestore } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VersioningStatusEnum } from '@datatr-ux/ovhcloud-types/cloud/storage';
import { ReactElement } from 'react';
import useDownload from '@/hooks/useDownload.hook';
import { useGetPresignUrlS3 } from '@/data/hooks/s3-storage/useGetPresignUrlS3.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';
import { isDeepArchive, isDeepArchiveRestored } from '@/lib/s3ObjectHelper';
import { DownloadIcon } from '../_components/DownloadIcon.component';

export interface S3ObjectAction {
  id: string;
  icon: ReactElement;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  withSeparator?: boolean;
  mobileOnly?: boolean;
  hidden?: boolean;
  variant?: DropdownMenuItemVariant;
}

interface UseS3ObjectActionsProps {
  object: StorageObject;
  showVersion: boolean;
}

export const useS3ObjectActions = ({
  object,
  showVersion,
}: UseS3ObjectActionsProps) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { download } = useDownload();
  const { s3 } = useS3Data();
  const toast = useToast();
  const {
    getPresignUrlS3,
    isPending: pendingGetPresignUrl,
  } = useGetPresignUrlS3({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: (presignUrl) => {
      download({ type: 'url', url: presignUrl.url }, object.key);
    },
  });

  const onDetailsClicked = () =>
    navigate(`./object?objectKey=${encodeURIComponent(object.key)}`);

  const onVersionsClicked = () =>
    navigate(`./object/versions?objectKey=${encodeURIComponent(object.key)}`);

  const onDownloadClicked = () => {
    return getPresignUrlS3({
      projectId,
      region: s3.region,
      name: s3.name,
      data: {
        expire: 3600,
        method: storages.PresignedURLMethodEnum.GET,
        object: object.key,
        storageClass: object.storageClass,
        versionId: '',
      },
    });
  };

  const onRestoreClicked = () =>
    navigate(`./restore-object?objectKey=${encodeURIComponent(object.key)}`);

  const onDeleteClicked = () =>
    showVersion
      ? navigate(
          `./delete-version/${object.versionId}?objectKey=${encodeURIComponent(
            object.key,
          )}`,
        )
      : navigate(`./delete-object?objectKey=${encodeURIComponent(object.key)}`);

  const isDeepArch = isDeepArchive(object);
  const needsRestore = !object.restoreStatus && isDeepArch;
  const restoreInProgress = object.restoreStatus?.inProgress;
  const isRestored = isDeepArchiveRestored(object);
  const canDownload =
    !needsRestore && !restoreInProgress && !object.isDeleteMarker;

  const isDownloadActionDisabled =
    object.isDeleteMarker ||
    pendingGetPresignUrl ||
    restoreInProgress ||
    (!canDownload && !needsRestore);

  const actions: S3ObjectAction[] = [
    {
      id: 'details',
      icon: <Pen className="size-4" />,
      mobileOnly: true,
      onClick: onDetailsClicked,
      label: t('tableActionManage'),
    },
    {
      id: 'download',
      icon: (
        <DownloadIcon
          pendingGetPresignUrl={pendingGetPresignUrl}
          needsRestore={needsRestore}
        />
      ),
      onClick: needsRestore
        ? () => onRestoreClicked()
        : () => onDownloadClicked(),
      disabled: isDownloadActionDisabled,
      label: needsRestore ? t('tableActionRestore') : t('tableActionDownload'),
    },
    {
      id: 'extend-restore',
      icon: <ArchiveRestore className="size-4" />,
      onClick: onRestoreClicked,
      label: t('tableActionExtendRestore'),
      hidden: !isRestored,
      mobileOnly: true,
    },
    {
      id: 'versions',
      icon: <Files className="size-4" />,
      onClick: onVersionsClicked,
      label: t('tableActionShowVersion'),
      hidden: s3.versioning.status !== VersioningStatusEnum.enabled,
    },
    {
      id: 'delete',
      withSeparator: true,
      icon: <Trash className="size-4" />,
      onClick: () => onDeleteClicked(),
      label: t('tableActionDelete'),
      variant: 'critical',
    },
  ];

  return {
    actions,
    pendingGetPresignUrl,
    needsRestore,
    isDownloadActionDisabled,
    onDownloadClicked,
    onRestoreClicked,
  };
};
