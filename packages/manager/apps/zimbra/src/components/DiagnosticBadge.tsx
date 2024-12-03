import React from 'react';
import { OdsTooltip, OdsText, OdsBadge } from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DnsRecordType } from '@/utils';
import { useGenerateUrl } from '@/hooks';

type DiagnosticBadgeProps = {
  diagType: DnsRecordType;
  status?: ODS_BADGE_COLOR;
  domainId?: string;
};

export const DiagnosticBadge: React.FC<DiagnosticBadgeProps> = ({
  diagType,
  status,
  domainId,
}) => {
  const { t } = useTranslation('domains');
  const navigate = useNavigate();
  const hasAction = !!(
    status === ODS_BADGE_COLOR.critical &&
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

  const handleChipClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(href);
  };

  const id = `diag-tooltip-trigger-${diagType}-${domainId}`;

  return (
    <>
      <div
        {...(hasAction && {
          onClick: handleChipClick,
          className: 'cursor-pointer',
        })}
      >
        <OdsBadge
          id={id}
          color={status}
          label={diagType}
          size={ODS_BADGE_SIZE.lg}
        ></OdsBadge>
      </div>

      {status === ODS_BADGE_COLOR.success && (
        <OdsTooltip role="tooltip" triggerId={id}>
          <div className="flex items-start flex-col gap-4 p-4">
            <OdsText preset={ODS_TEXT_PRESET.heading6}>
              {t('zimbra_domains_datagrid_diagnostic_tooltip_title', {
                diagType,
              })}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_domains_datagrid_diagnostic_configuration_ok')}
            </OdsText>
          </div>
        </OdsTooltip>
      )}
    </>
  );
};
