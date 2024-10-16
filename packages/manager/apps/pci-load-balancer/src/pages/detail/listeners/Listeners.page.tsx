import { Links, Notifications } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Suspense } from 'react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { DISCOVER_LINK } from '@/constants';

export default function Listeners() {
  const { t } = useTranslation('listeners');

  return (
    <div>
      <OsdsText
        size={ODS_TEXT_SIZE._600}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('octavia_load_balancer_listeners_title')}
      </OsdsText>

      <div className="my-8">
        <OsdsText
          className="block"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('octavia_load_balancer_listeners_description_part_1')}
        </OsdsText>
        <OsdsText
          className=""
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('octavia_load_balancer_listeners_description_part_2')}
        </OsdsText>
        <Links
          className="ml-3"
          href={DISCOVER_LINK}
          target={OdsHTMLAnchorElementTarget._blank}
          label={t('octavia_load_balancer_listeners_description_part_2_link')}
        />
      </div>

      <Notifications />

      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}
