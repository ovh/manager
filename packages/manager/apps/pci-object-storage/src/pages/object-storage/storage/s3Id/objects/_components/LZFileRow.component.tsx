import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { Badge, Checkbox, useToast } from '@datatr-ux/uxlib';
import { Download, Loader2, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import FileIcon from '@/components/file-icon/FileIcon.component';
import useDownload from '@/hooks/useDownload.hook';
import { useGetPresignUrlS3 } from '@/data/hooks/s3-storage/useGetPresignUrlS3.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useS3Data } from '../../S3.context';
import storages from '@/types/Storages';
import { cn } from '@/lib/utils';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';
import { VIRTUALIZED_BROWSER } from '@/components/virtualized-browser/virtualized-browser.constants';
import { RowActions, RowAction } from './RowActions.component';
import { useObjectSelection } from '../_contexts/ObjectSelection.context';

interface S3ObjectFileRendererProps {
  object: StorageObject;
}
export const LZFileRow = ({ object }: S3ObjectFileRendererProps) => {
  const { projectId } = useParams();
  const localeBytesConverter = useLocaleBytesConverter();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );
  const { download } = useDownload();
  const { s3 } = useS3Data();
  const toast = useToast();
  const { isSelected, setSelection } = useObjectSelection();

  const handleCheckboxChange = (checked: boolean) => {
    setSelection({ key: object.key, versionId: object.versionId, checked });
  };
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

  const actions: RowAction[] = [
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
      id: 'delete',
      withSeparator: true,
      icon: <Trash className="size-4" />,
      onClick: () => onDeleteClicked(),
      label: t('tableActionDelete'),
      variant: 'critical',
    },
  ];
  return (
    <div
      style={{ height: VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT }}
      className={cn(
        'py-2 px-3 grid grid-cols-[auto_minmax(0,1fr)_auto_130px_auto] items-center gap-4 hover:bg-primary-50 border-b',
      )}
    >
      {/* CHECKBOX */}
      <div className="flex items-center">
        <Checkbox
          checked={isSelected(object.key, object.versionId)}
          onCheckedChange={handleCheckboxChange}
          aria-label={t('selectObject', { name: object.key })}
        />
      </div>

      {/* NAME */}
      <div className="flex flex-row gap-2 items-center">
        <FileIcon fileName={object.key} className="w-4 h-4 flex-shrink-0" />
        <span className="truncate" title={object.key}>
          {String(object.key)
            .split('/')
            .pop()}
        </span>
        {object.isDeleteMarker && (
          <Badge className="ml-2" variant="information">
            {t('tableSuppressionBadgeLabel')}
          </Badge>
        )}
      </div>

      {/* SIZE + DATE */}
      <div className="text-muted-foreground flex justify-end gap-2">
        {object.size !== undefined && (
          <span>{localeBytesConverter(object.size, true, 2)}</span>
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
          <Badge variant="outline">
            {tObj(`objectClass_${object.storageClass}`)}
          </Badge>
        )}
      </div>

      <RowActions actions={actions} testId="storages-action-trigger" />
    </div>
  );
};
