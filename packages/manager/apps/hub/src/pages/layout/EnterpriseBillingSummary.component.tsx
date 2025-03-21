import React from 'react';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { LINK } from '@/pages/layout/layout.constants';
import '@/pages/layout/BillingSummary.style.scss';

export default function EnterpriseBillingSummary() {
  const { t } = useTranslation('hub/billing');
  const { trackClick } = useOvhTracking();

  const trackNavigation = () => {
    trackClick({
      actionType: 'action',
      actions: ['activity', 'billing', 'show-all'],
    });
  };

  return (
    <div
      className="manager-hub-billing-summary"
      data-testid="enterprise_billing_summary"
    >
      <div className="text-left px-6">
        <OsdsText
          className="block mb-6"
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.text}
          data-testid="enterprise_billing_summary_title"
        >
          {t('hub_enterprise_billing_summary_title')}
        </OsdsText>
        <OsdsText
          className="block mb-6"
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
          data-testid="enterprise_billing_summary_description"
        >
          {t('hub_enterprise_billing_summary_description')}
        </OsdsText>
      </div>
      <OsdsLink
        href={LINK}
        rel={OdsHTMLAnchorElementRel.noreferrer}
        target={OdsHTMLAnchorElementTarget._blank}
        onClick={trackNavigation}
        contrasted
        data-testid="enterprise_billing_summary_link"
      >
        {t('hub_enterprise_billing_summary_goto')}
        <span className="ml-4" slot="end">
          <OsdsIcon
            name={ODS_ICON_NAME.ARROW_RIGHT}
            size={ODS_ICON_SIZE.sm}
            contrasted
          ></OsdsIcon>
        </span>
      </OsdsLink>
    </div>
  );
}
