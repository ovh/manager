import { useTranslation } from 'react-i18next';
import { TZoneHistoryWithDate } from '@/zone/types/history.types';
import { useDownloadZoneFile } from '@/zone/hooks/data/history.hooks';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { Badge, BADGE_COLOR, Button, BUTTON_VARIANT, BUTTON_SIZE, Checkbox, CheckboxControl, ICON_NAME, Text, TEXT_PRESET, Icon, Tooltip, TooltipTrigger, TooltipContent } from '@ovhcloud/ods-react';

export interface CreationDateCellProps {
  readonly row: TZoneHistoryWithDate;
  readonly isActive?: boolean;
}

export function CreationDateCell({ row, isActive }: CreationDateCellProps) {
  const { t } = useTranslation('zone');
  const formatDate = useFormatDate();
  return (
    <div>
      <Text preset={TEXT_PRESET.span}>
        {formatDate({
          date: row.creationDate,
          format: 'PPpp',
        })}
      </Text>
      {isActive && <Badge color={BADGE_COLOR.information} className="ml-2" >{t('zone_history_current')}</Badge>}
    </div>

  );
}

interface SelectRowCellProps {
  readonly row: TZoneHistoryWithDate;
  readonly isSelected: boolean;
  readonly onSelectChange: (id: string, checked: boolean) => void;
}

export function SelectRowCell({
  row,
  isSelected,
  onSelectChange,
}: SelectRowCellProps) {
  return (
    <Checkbox
      name={`select-${row.id}`}
      checked={isSelected}
      onCheckedChange={(e) => onSelectChange(row.id, e.checked as boolean)}
    >
      <CheckboxControl />
    </Checkbox>
  );
}

interface ViewZoneCellProps {
  readonly row: TZoneHistoryWithDate;
  readonly onView: (item: TZoneHistoryWithDate) => void;
}

export function ViewZoneCell({ row, onView }: ViewZoneCellProps) {
  const { t } = useTranslation('zone');
  return (
    <Button
      variant={BUTTON_VARIANT.ghost}
      size={BUTTON_SIZE.sm}
      onClick={() => onView(row)}
    >
      <>
        <Icon name={ICON_NAME.eye} slot="start" />
        {t('zone_history_view')}

      </>
    </Button>
  );
}

interface DownloadZoneCellProps {
  readonly row: TZoneHistoryWithDate;
  readonly zoneName: string;
}

export function DownloadZoneCell({ row, zoneName }: DownloadZoneCellProps) {
  const { t } = useTranslation('zone');
  const { mutate: download, isPending } = useDownloadZoneFile();

  const handleDownload = () => {
    download({ url: row.zoneFileUrl, zoneName });
  };

  return (
    <Button
      variant={BUTTON_VARIANT.ghost}
      size={BUTTON_SIZE.sm}
      onClick={handleDownload}
      disabled={isPending}
    >
      <>
        <Icon name={ICON_NAME.download} slot="start" />
        {t('zone_history_download')}

      </>
    </Button>
  );
}

interface RestoreZoneCellProps {
  readonly row: TZoneHistoryWithDate;
  readonly onRestore: (item: TZoneHistoryWithDate) => void;
  readonly isActive?: boolean;
  readonly canRestore?: boolean;
}

export function RestoreZoneCell({ row, onRestore, isActive, canRestore = true }: RestoreZoneCellProps) {
  const { t } = useTranslation('zone');
  const isDisabled = isActive || !canRestore;
  const showNoPermissionTooltip = !canRestore && !isActive;

  const button = (
    <Button
      variant={BUTTON_VARIANT.ghost}
      size={BUTTON_SIZE.sm}
      onClick={() => onRestore(row)}
      disabled={isDisabled}
    >
      <>
        <Icon name={ICON_NAME.arrowUpLeft} slot="start" />
        {t('zone_history_restore')}
      </>
    </Button>
  );

  if (showNoPermissionTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{button}</span>
        </TooltipTrigger>
        <TooltipContent>
          {t('zone_history_restore_no_permission')}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
