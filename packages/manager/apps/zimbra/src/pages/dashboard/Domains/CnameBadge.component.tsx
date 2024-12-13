import React from 'react';
import { OdsBadge, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
import {
  ODS_BADGE_COLOR,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DomainsItem } from './Domains';
import { useGenerateUrl } from '@/hooks';

export type CnameBadge = {
  item: DomainsItem;
};

export const CnameBadge: React.FC<CnameBadge> = ({ item }) => {
  const { t } = useTranslation('domains');
  const navigate = useNavigate();
  const validateUrl = useGenerateUrl('./verify', 'path', {
    domainId: item.id,
  });

  return (
    <div
      role="button"
      aria-hidden="true"
      className="cursor-pointer"
      onClick={() => {
        navigate(validateUrl);
      }}
    >
      <OdsBadge
        id={item.cnameToCheck}
        color={ODS_BADGE_COLOR.warning}
        label={t('zimbra_domains_datagrid_cname_label')}
        icon={ODS_ICON_NAME.circleInfo}
      />
      <OdsTooltip
        className="max-w-96 text-center"
        role="tooltip"
        withArrow
        triggerId={item.cnameToCheck}
      >
        <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading6}>
          {t('zimbra_domains_datagrid_cname_tooltip_title')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey="zimbra_domains_datagrid_cname_tooltip"
            values={{ cname: `${item.cnameToCheck}.${item.name}` }}
          />
        </OdsText>
      </OdsTooltip>
    </div>
  );
};
