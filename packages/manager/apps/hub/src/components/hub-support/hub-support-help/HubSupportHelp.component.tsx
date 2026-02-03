import React, { FunctionComponent } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';

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
          className="inline-block h-32 w-auto object-contain"
        />
      </div>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.primary}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="mb-2 block"
        size={ODS_TEXT_SIZE._400}
      >
        {t('hub_support_need_help')}
      </OsdsText>
      <OsdsText level={ODS_THEME_TYPOGRAPHY_LEVEL.body} className="mb-2 block">
        {t('hub_support_need_help_more')}
      </OsdsText>
      <OsdsLink
        href={helpUrl}
        onClick={handleClick}
        target={OdsHTMLAnchorElementTarget._blank}
        color={ODS_THEME_COLOR_INTENT.primary}
        className="text-right font-bold"
      >
        {t('hub_support_help')}
      </OsdsLink>
    </>
  );
};
