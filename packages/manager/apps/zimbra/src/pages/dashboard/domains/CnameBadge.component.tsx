import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsBadge, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useGenerateUrl } from '@/hooks';
import { VERIFY_DOMAIN } from '@/tracking.constants';

import { DomainItem } from './Domains.types';

export type CnameBadgeProps = {
  item: DomainItem;
};

export const CnameBadge: React.FC<CnameBadgeProps> = ({ item }) => {
  const { t } = useTranslation('domains');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const validateUrl = useGenerateUrl(`./${item.id}/verify`, 'path');

  return (
    <div
      role="button"
      aria-hidden="true"
      className="cursor-pointer"
      onClick={() => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: [VERIFY_DOMAIN],
        });
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

export default CnameBadge;
