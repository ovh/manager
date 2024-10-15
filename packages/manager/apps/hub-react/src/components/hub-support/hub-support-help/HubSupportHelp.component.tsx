import React, { FunctionComponent } from 'react';
import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import useGuideUtils from '@/hooks/guideUtils/useGuideUtils';
import assistance from '../assets/assistance.png';

export const HubSupportHelp: FunctionComponent = () => {
  const { t } = useTranslation('hub/support');
  const { trackClick } = useOvhTracking();
  const guide = useGuideUtils();
  const helpUrl = guide.Home;

  const handleClick = () => {
    trackClick({
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['activity', 'assistance', 'guide-welcome', 'go-to-docs'],
    });
  };

  return (
    <>
      <div className="text-center">
        <img
          src={assistance}
          alt="assistance"
          className="h-32 w-auto inline-block object-contain"
        />
      </div>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.primary}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="block mb-2"
        size={ODS_TEXT_SIZE._400}
      >
        {t('hub_support_need_help')}
      </OsdsText>
      <OsdsText level={ODS_THEME_TYPOGRAPHY_LEVEL.body} className="block mb-2">
        {t('hub_support_need_help_more')}
      </OsdsText>
      <OsdsLink
        href={helpUrl}
        onClick={handleClick}
        target={OdsHTMLAnchorElementTarget._blank}
        color={ODS_THEME_COLOR_INTENT.primary}
        className="font-bold text-right"
      >
        {t('hub_support_help')}
      </OsdsLink>
    </>
  );
};
