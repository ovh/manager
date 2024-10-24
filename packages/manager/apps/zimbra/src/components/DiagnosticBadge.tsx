import React from 'react';
import { OdsTooltip, OdsText, OdsTag } from '@ovhcloud/ods-components/react';
import { ODS_TAG_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DnsRecordType } from '@/utils';
import { useGenerateUrl } from '@/hooks';

type StatusProps = 'critical' | 'success' | 'warning';
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
  const chipColor = status as ODS_TAG_COLOR;
  const navigate = useNavigate();
  const hasAction = !!(
    status === 'critical' &&
    [DnsRecordType.MX, DnsRecordType.SPF, DnsRecordType.SRV].some(
      (diag) => diag === diagType,
    ) &&
    domainId
  );

  const href = useGenerateUrl('./diagnostic', 'path', {
    domainId,
    dnsRecordType: diagType,
    isOvhDomain: 'false',
  });

  const handleChipClick = () => {
    navigate(href);
  };

  return (
    <OdsTooltip className="mr-4" triggerId="tooltip-trigger">
      {status === 'success' ? (
        <>
          <OdsTag color={chipColor} label={diagType}></OdsTag>
          <div id="tooltip-trigger" className="flex items-start flex-col p-2 ">
            <OdsText preset={ODS_TEXT_PRESET.heading4}>
              {t('zimbra_domains_datagrid_diagnostic_tooltip_title', {
                diagType,
              })}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_domains_datagrid_diagnostic_configuration_ok')}
            </OdsText>
          </div>
        </>
      ) : (
        <OdsTag
          label={diagType}
          color={chipColor}
          {...(hasAction ? { selectable: true, onClick: handleChipClick } : {})}
        />
      )}
    </OdsTooltip>
  );
};
