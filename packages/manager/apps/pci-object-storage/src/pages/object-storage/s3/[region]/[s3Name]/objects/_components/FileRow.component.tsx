import { useTranslation } from 'react-i18next';
import { Badge, Checkbox } from '@datatr-ux/uxlib';
import { cloud } from '@datatr-ux/ovhcloud-types';
import { VIRTUALIZED_BROWSER } from '@/components/virtualized-browser/virtualized-browser.constants';
import FileIcon from '@/components/file-icon/FileIcon.component';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import ConditionalLink from '@/components/links/ConditionalLink.component';
import { useS3ObjectActions } from '../_hooks/useS3ObjectActions.hook';
import { cn } from '@/lib/utils';
import { DeepArchiveBadge } from './DeepArchiveBadge.component';
import { RowActions } from './RowActions.component';
import { useObjectSelection } from '../_contexts/ObjectSelection.context';

type FileItem = {
  type: 'file';
  name: string;
} & cloud.StorageObject;

interface FileRowProps {
  item: FileItem;
  showVersion?: boolean;
}

const FileRow = ({ item, showVersion }: FileRowProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );
  const localeBytes = useLocaleBytesConverter();
  const { isSelected, setSelection } = useObjectSelection();

  const { actions } = useS3ObjectActions({
    object: item,
    showVersion,
  });

  const handleCheckboxChange = (checked: boolean) => {
    setSelection({ key: item.key, versionId: item.versionId, checked });
  };

  return (
    <div
      style={{ height: VIRTUALIZED_BROWSER.DEFAULT_ROW_HEIGHT }}
      className={cn(
        'py-2 px-3 grid grid-cols-[auto_minmax(0,1fr)_auto_130px_auto] items-center gap-4 hover:bg-primary-50 border-b',
        item.isLatest === false && 'bg-neutral-50 pl-6',
      )}
    >
      {/* CHECKBOX */}
      <div className="flex items-center">
        <Checkbox
          checked={isSelected(item.key, item.versionId)}
          onCheckedChange={handleCheckboxChange}
          aria-label={t('selectObject', { name: item.key })}
        />
      </div>

      {/* NAME */}
      <div className="flex items-center gap-2 min-w-0">
        <ConditionalLink
          condition={!item.isDeleteMarker}
          to={`./object?objectKey=${encodeURIComponent(item.key)}`}
          className="flex items-center gap-2 min-w-0"
        >
          <FileIcon fileName={item.key} className="w-4 h-4 flex-shrink-0" />
          <span className="truncate" title={item.key}>
            {item.name}
          </span>
        </ConditionalLink>

        {item.isDeleteMarker && (
          <Badge variant="information">{t('tableSuppressionBadgeLabel')}</Badge>
        )}

        <div className="hidden lg:block">
          <DeepArchiveBadge object={item} />
        </div>
      </div>

      {/* SIZE + DATE */}
      <div className="text-muted-foreground flex justify-end gap-2 whitespace-nowrap">
        {item.size !== undefined && (
          <span>{localeBytes(item.size, true, 2)}</span>
        )}
        {item.lastModified && (
          <FormattedDate
            date={new Date(item.lastModified)}
            options={{ day: '2-digit', month: 'short', year: 'numeric' }}
          />
        )}
      </div>

      {/* STORAGE CLASS */}
      <div className="text-right whitespace-nowrap">
        {item.storageClass && (
          <Badge variant="outline">
            {tObj(`objectClass_${item.storageClass}`)}
          </Badge>
        )}
      </div>

      <RowActions actions={actions} />
    </div>
  );
};

export { FileRow };
