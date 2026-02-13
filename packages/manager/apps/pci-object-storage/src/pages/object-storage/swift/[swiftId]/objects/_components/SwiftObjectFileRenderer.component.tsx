import {
  Button,
  ButtonProps,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemProps,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import { Download, Loader2, MoreHorizontal, Pen, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContainerObject } from '@datatr-ux/ovhcloud-types/cloud/storage';
import { add, formatRFC3339 } from 'date-fns';
import { ReactElement } from 'react';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import FileIcon from '@/components/file-icon/FileIcon.component';
import useDownload from '@/hooks/useDownload.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import storages from '@/types/Storages';
import { cn } from '@/lib/utils';
import { useDownloadSwiftObject } from '@/data/hooks/swift-storage/useDownloadObject.hook';
import { useLocaleBytesConverter } from '@/hooks/useLocaleByteConverter.hook';

interface SwiftObjectFileRendererProps {
  object: ContainerObject;
}
const SwiftObjectFileRenderer = ({ object }: SwiftObjectFileRendererProps) => {
  const { projectId, swiftId } = useParams();
  const localeBytesConverter = useLocaleBytesConverter();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { download } = useDownload();
  const toast = useToast();

  const {
    downloadSwiftObject,
    isPending: isDownloadPending,
  } = useDownloadSwiftObject({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: async (downloadInfo: storages.ContainerObjectTempURL) => {
      download({ type: 'url', url: downloadInfo.getURL }, object.name);
    },
  });

  const onDetailsClicked = () =>
    navigate(`./object?objectName=${encodeURIComponent(object.name)}`);
  const onDownloadClicked = () => {
    const oneWeekDate = add(new Date(), { weeks: 1 });
    return downloadSwiftObject({
      projectId,
      containerId: swiftId,
      data: {
        objectName: object.name,
        expirationDate: formatRFC3339(oneWeekDate),
      },
    });
  };
  const onDeleteClicked = () =>
    navigate(`./delete-object?objectName=${object.name}`);

  const actions: {
    id: string;
    icon: ReactElement;
    onClick: () => void;
    disabled?: boolean;
    label: string;
    withSeparator?: boolean;
    mobileOnly?: boolean;
    variant?: ButtonProps['variant'] & DropdownMenuItemProps['variant'];
  }[] = [
    {
      id: 'details',
      icon: <Pen className="size-4" />,
      mobileOnly: true,
      onClick: () => onDetailsClicked(),
      label: t('tableActionManage'),
    },
    {
      id: 'download',
      icon: isDownloadPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      ),
      onClick: () => onDownloadClicked(),
      disabled: isDownloadPending,
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
    <>
      <div
        className={cn(
          'py-2 px-3 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 hover:bg-primary-50',
        )}
      >
        {/* NAME */}
        <div className="flex items-center gap-2 min-w-0">
          <FileIcon fileName={object.name} className="w-4 h-4 flex-shrink-0" />
          <span className="truncate" title={object.name}>
            {String(object.name)
              .split('/')
              .pop()}
          </span>
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
                data-testid="swift-objects-action-trigger"
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
                    data-testid={`swift-objects-action-${a.id}`}
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

export default SwiftObjectFileRenderer;
