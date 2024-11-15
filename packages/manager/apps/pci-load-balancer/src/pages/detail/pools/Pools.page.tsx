import { Headers, Links } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { Suspense } from 'react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { DISCOVER_LINK } from '@/constants';

export default function Pools() {
  const { t } = useTranslation('pools');

  return (
    <div>
      <Headers title={t('octavia_load_balancer_pools_title')} />

      <div>
        <OsdsText
          className="block"
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('octavia_load_balancer_pools_description_part_1')}
        </OsdsText>
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('octavia_load_balancer_pools_description_part_2')}
        </OsdsText>
        <Links
          className="ml-3"
          href={DISCOVER_LINK}
          target={OdsHTMLAnchorElementTarget._blank}
          label={t('octavia_load_balancer_pools_description_part_2_link')}
        />
      </div>

      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}
