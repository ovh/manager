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
import { useNavigate } from 'react-router-dom';
import { DnsRecordType } from '@/utils';
import { useGenerateUrl } from '@/hooks';

type StatusProps = 'error' | 'success' | 'warning';
type DiagnosticBadgeProps = {
  diagType: DnsRecordType;
  status?: StatusProps;
  domainId?: string;
};

export const DiagnosticBadge: React.FC<DiagnosticBadgeProps> = ({
  diagType,
  status,
  domainId,
}) => {
  const { t } = useTranslation('domains');
  const chipColor = status as ODS_THEME_COLOR_INTENT;
  const navigate = useNavigate();
  const hasAction = !!(
    status === 'error' &&
    [DnsRecordType.MX, DnsRecordType.SPF, DnsRecordType.SRV].some(
      (diag) => diag === diagType,
    ) &&
    domainId
  );

  const href = useGenerateUrl('./diagnostic', 'path', {
    domainId,
    dnsRecordType: diagType,
    // remove when we get it from api
    isOvhDomain: 'false',
  });

  const handleChipClick = () => {
    navigate(href);
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
          {...(hasAction ? { selectable: true, onClick: handleChipClick } : {})}
        >
          {diagType}
        </OsdsChip>
      )}
    </OsdsTooltip>
  );
};
