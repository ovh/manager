import React from 'react';
import {
  OsdsChip,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { DNS_RECORD_TYPE } from '@/utils';

type ServiceProps = keyof typeof DNS_RECORD_TYPE;
type StatusProps = 'error' | 'success' | 'warning';
type DiagnosticBadgeProps = {
  diagType: ServiceProps;
  status?: StatusProps;
  onClick?: () => void;
};

export const DiagnosticBadge: React.FC<DiagnosticBadgeProps> = ({
  diagType,
  status,
  onClick,
}) => {
  const { t } = useTranslation('domains');
  const chipColor = status as ODS_THEME_COLOR_INTENT;

  const handleChipClick = () => {
    if (status === 'error' || status === 'warning') {
      onClick?.();
    }
  };

  return (
    <OsdsTooltip className="mr-4">
      {status === 'success' ? (
        <>
          <OsdsChip color={chipColor}>{diagType}</OsdsChip>
          <OsdsTooltipContent
            slot="tooltip-content"
            className="flex items-start flex-col p-2 "
          >
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_domains_datagrid_diagnostic_tooltip_title', {
                diagType,
              })}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            >
              {t('zimbra_domains_datagrid_diagnostic_configuration_ok')}
            </OsdsText>
          </OsdsTooltipContent>
        </>
      ) : (
        <OsdsChip
          color={chipColor}
          selectable={Boolean(onClick)}
          onClick={handleChipClick}
        >
          {diagType}
        </OsdsChip>
      )}
    </OsdsTooltip>
  );
};
