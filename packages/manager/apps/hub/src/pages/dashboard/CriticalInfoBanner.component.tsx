import { useEffect, useMemo } from 'react';

import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useHubContext } from '@/pages/dashboard/context';
import { CRITICAL_INFO_BANNER_FEATURE } from '@/pages/dashboard/dashboard.constants';

type CriticalInfoBannerProps = {
  translationKey: string;
};

export default function CriticalInfoBanner({ translationKey }: CriticalInfoBannerProps) {
  const { t } = useTranslation('hub/critical-info');
  const { availability } = useHubContext();
  const { trackPage } = useOvhTracking();

  const shouldBeDisplayed = useMemo(
    () => Boolean(availability?.[CRITICAL_INFO_BANNER_FEATURE]),
    [availability],
  );

  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(t(translationKey)),
    [t, translationKey],
  );

  useEffect(() => {
    if (shouldBeDisplayed) {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: 'critical-info',
      });
    }
  }, [shouldBeDisplayed]);

  return shouldBeDisplayed ? (
    <OsdsMessage
      className="mb-4 flex rounded"
      type={ODS_MESSAGE_TYPE.warning}
      color={ODS_THEME_COLOR_INTENT.warning}
      removable={true}
      data-testid="critical_info_banner"
    >
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <div
          data-testid="critical_info_banner_content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </OsdsText>
    </OsdsMessage>
  ) : null;
}
