import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import {
  Download,
  Files,
  Loader2,
  MoreHorizontal,
  Pen,
  Trash,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VersioningStatusEnum } from '@datatr-ux/ovhcloud-types/cloud/storage/VersioningStatusEnum';
import { octetConverter } from '@/lib/bytesHelper';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import FileIcon from '@/components/fileIcon/FileIcon.component';
import Link from '@/components/links/Link.component';
import useDownload from '@/hooks/useDownload';
import { useGetPresignUrlS3 } from '@/data/hooks/s3-storage/useGetPresignUrlS3.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';
import { cn } from '@/lib/utils';

interface S3ObjectFileRendererProps {
  object: StorageObject;
}
const S3ObjectFileRenderer = ({ object }: S3ObjectFileRendererProps) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );
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
        variant: 'destructive',
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
  const onDeleteClicked = () =>
    navigate(`./delete-object?objectKey=${object.key}`);

  const actions = [
    {
      id: 'details',
      icon: <Pen className="size-4" />,
      mobileOnly: true,
      onClick: () => onDetailsClicked(),
      label: t('tableActionManage'),
    },
    {
      id: 'download',
      icon: pendingGetPresignUrl ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      ),
      onClick: () => onDownloadClicked(),
      disabled: object.isDeleteMarker || pendingGetPresignUrl,
      label: t('tableActionDownload'),
    },
    {
      id: 'versions',
      icon: <Files className="size-4" />,
      onClick: () => onVersionsClicked(),
      label: t('tableActionShowVersion'),
      hidden: s3.versioning.status !== VersioningStatusEnum.enabled,
    },
    {
      id: 'delete',
      withSeparator: true,
      icon: <Trash className="size-4" />,
      onClick: () => onDeleteClicked(),
      label: t('tableActionDelete'),
      variant: 'destructive',
    },
  ];
  return (
    <>
      <div
        className={cn(
          'py-2 px-3 grid grid-cols-[minmax(0,1fr)_auto_130px_auto] items-center gap-4 hover:bg-primary-50',
          !object.isLatest && 'bg-neutral-50 pl-6',
        )}
      >
        {/* NAME */}
        <Link
          to={`./object?objectKey=${encodeURIComponent(object.key)}`}
          className="flex items-center gap-2 min-w-0"
        >
          <FileIcon fileName={object.key} className="w-4 h-4 flex-shrink-0" />
          <span className="truncate" title={object.key}>
            {String(object.key)
              .split('/')
              .pop()}
          </span>
          {object.isDeleteMarker && (
            <Badge className="ml-2" variant="info">
              {t('tableSuppressionBadgeLabel')}
            </Badge>
          )}
        </Link>

        {/* SIZE + DATE */}
        <div className="text-muted-foreground flex justify-end gap-2">
          {object.size !== undefined && (
            <span>{octetConverter(object.size, true, 2)}</span>
          )}
          {object.lastModified && (
            <FormattedDate
              date={new Date(object.lastModified)}
              options={{
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }}
            />
          )}
        </div>

        {/* STORAGE CLASS */}
        <div className="text-right">
          {object.storageClass && (
            <Badge variant={'outline'}>
              {tObj(`objectClass_${object.storageClass}`)}
            </Badge>
          )}
        </div>

        <div className="text-right hidden md:flex">
          {actions
            .filter((a) => !a.mobileOnly)
            .map((a) => (
              <Button
                key={a.id}
                aria-label={a.label}
                title={a.label}
                onClick={a.onClick}
                mode={'ghost'}
                size={'xs'}
                className="p-1"
                variant={a.variant}
                disabled={a.disabled}
              >
                {a.icon}
              </Button>
            ))}
        </div>

        <div className="text-right block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="storages-action-trigger"
                variant="menu"
                size="menu"
                className="p-1 size-6"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="storages-action-content"
              align="end"
            >
              {actions.map((a) => (
                <>
                  {a.withSeparator && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    key={a.id}
                    onClick={a.onClick}
                    variant={a.variant}
                    disabled={a.disabled}
                  >
                    {a.label}
                  </DropdownMenuItem>
                </>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default S3ObjectFileRenderer;
