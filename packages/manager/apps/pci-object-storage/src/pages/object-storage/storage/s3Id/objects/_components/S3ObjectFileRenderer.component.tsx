import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import { MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import FileIcon from '@/components/file-icon/FileIcon.component';
import ConditionalLink from '@/components/links/ConditionalLink.component';
import { cn } from '@/lib/utils';
import { useS3ObjectActions } from '../_hooks/useS3ObjectActions.hook';
import { DeepArchiveBadge } from './DeepArchiveBadge.component';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';
import { useObjectSelection } from '../_contexts/ObjectSelection.context';

interface S3ObjectFileRendererProps {
  object: StorageObject;
  showVersion?: boolean;
}
const S3ObjectFileRenderer = ({
  object,
  showVersion = false,
}: S3ObjectFileRendererProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );
  const localeBytesConverter = useLocaleBytesConverter();
  const { isSelected, setSelection } = useObjectSelection();

  const { actions } = useS3ObjectActions({
    object,
    showVersion,
  });

  const handleCheckboxChange = (checked: boolean) => {
    setSelection({ key: object.key, versionId: object.versionId, checked });
  };

  return (
    <>
      <div
        className={cn(
          'py-2 px-3 grid grid-cols-[auto_minmax(0,1fr)_auto_130px_auto] items-center gap-4 hover:bg-primary-50',
          object.isLatest === false && 'bg-neutral-50 pl-6',
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
        <div className="flex items-center gap-2 min-w-0">
          <ConditionalLink
            condition={!object.isDeleteMarker}
            to={`./object?objectKey=${encodeURIComponent(object.key)}`}
            className="flex items-center gap-2 min-w-0"
          >
            <FileIcon fileName={object.key} className="w-4 h-4 flex-shrink-0" />
            <span className="truncate" title={object.key}>
              {String(object.key)
                .split('/')
                .pop()}
            </span>
          </ConditionalLink>

          {object.isDeleteMarker && (
            <Badge className="ml-2" variant="information">
              {t('tableSuppressionBadgeLabel')}
            </Badge>
          )}
          <div className="hidden lg:block">
            <DeepArchiveBadge object={object} />
          </div>
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
                mode="ghost"
                size="xs"
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
              {actions
                .filter((a) => !a.hidden)
                .map((a) => (
                  <div key={a.id}>
                    {a.withSeparator && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      onClick={a.onClick}
                      variant={a.variant}
                      disabled={a.disabled}
                    >
                      {a.label}
                    </DropdownMenuItem>
                  </div>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default S3ObjectFileRenderer;
