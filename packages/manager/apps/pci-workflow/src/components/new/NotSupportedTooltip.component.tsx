import {
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { isLocalZone } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { useLZAutoBackupAvailability } from '@/hooks/useLZAutoBackupAvailability';

type NotSupportedTooltipComponentProps = {
  children: ReactNode;
  region: string;
};

export default function NotSupportedTooltipComponent({
  region,
  children,
}: Readonly<NotSupportedTooltipComponentProps>) {
  const { t } = useTranslation();
  const { isAvailable: isSupported } = useLZAutoBackupAvailability();
  return isLocalZone(region) && !isSupported ? (
    <OsdsPopover>
      <span slot="popover-trigger">{children}</span>
      <OsdsPopoverContent>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
        >
          {t('common_not_supported')}
        </OsdsText>
      </OsdsPopoverContent>
    </OsdsPopover>
  ) : (
    <>{children}</>
  );
}
