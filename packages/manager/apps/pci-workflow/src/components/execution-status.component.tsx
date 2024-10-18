import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsChip, OsdsText } from '@ovhcloud/ods-components/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TExecutionState } from '@/api/data/region-workflow';

export default function ExecutionStatusComponent({
  status,
}: {
  status: TExecutionState;
}): JSX.Element {
  const { t } = useTranslation('listing');
  const color: ODS_THEME_COLOR_INTENT = useMemo(() => {
    switch (status) {
      case 'SUCCESS':
        return ODS_THEME_COLOR_INTENT.success;
      case 'PAUSED':
        return ODS_THEME_COLOR_INTENT.warning;
      case 'ERROR':
        return ODS_THEME_COLOR_INTENT.error;
      default:
        return ODS_THEME_COLOR_INTENT.info;
    }
  }, [status]);

  return (
    <OsdsChip color={color} inline>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <span className="whitespace-nowrap">
          {t(`pci_workflow_execution_status_${status}`)}
        </span>
      </OsdsText>
    </OsdsChip>
  );
}
