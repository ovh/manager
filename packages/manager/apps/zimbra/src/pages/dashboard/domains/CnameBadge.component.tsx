import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import {
  BADGE_COLOR,
  Badge,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

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
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge color={BADGE_COLOR.warning}>
            {t('zimbra_domains_datagrid_cname_label')}
            <Icon name={ICON_NAME.circleInfo} />
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-96 text-center" withArrow>
          <Text className="mb-4" preset={TEXT_PRESET.heading6}>
            {t('zimbra_domains_datagrid_cname_tooltip_title')}
          </Text>
          <Text preset={TEXT_PRESET.paragraph}>
            <Trans
              t={t}
              i18nKey="zimbra_domains_datagrid_cname_tooltip"
              values={{ cname: `${item.cnameToCheck}.${item.name}` }}
            />
          </Text>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default CnameBadge;
