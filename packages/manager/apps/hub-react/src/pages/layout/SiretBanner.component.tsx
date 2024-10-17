import { Suspense, useContext, useEffect, useMemo } from 'react';
import { Await } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SKELETON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ShellContext,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';

export default function SiretBanner() {
  const { t } = useTranslation('hub/siret');
  const {
    shell: { navigation },
    environment: { user },
  } = useContext(ShellContext);
  const { trackClick, trackPage } = useOvhTracking();

  const shouldBeDisplayed = useMemo(
    () =>
      !user.companyNationalIdentificationNumber &&
      user.legalform === 'corporation' &&
      user.country === 'FR',
    [user],
  );

  const link = navigation.getURL('dedicated', '#/useraccount/infos', {
    fieldToFocus: 'siretForm',
  });

  const trackLink = () => {
    trackClick({
      actionType: 'action',
      actions: ['hub', 'add-siret-banner', 'goto-edit-profile'],
    });
  };

  useEffect(() => {
    if (shouldBeDisplayed) {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: 'siret',
      });
    }
  }, [shouldBeDisplayed]);

  return shouldBeDisplayed ? (
    <OsdsMessage
      className="flex rounded"
      type={ODS_MESSAGE_TYPE.info}
      color={ODS_THEME_COLOR_INTENT.info}
      removable={true}
      data-testid="siret_banner"
    >
      <div>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block"
        >
          {t('manager_hub_dashboard_banner_siret')}
          <Suspense
            fallback={
              <OsdsSkeleton
                data-testid="siret_banner_link_skeleton"
                inline
                size={ODS_SKELETON_SIZE.sm}
              />
            }
          >
            <Await
              resolve={link}
              children={(href: string) => (
                <OsdsLink
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={href}
                  target={OdsHTMLAnchorElementTarget._top}
                  onClick={trackLink}
                >
                  {t('manager_hub_dashboard_banner_siret_link')}
                  <OsdsIcon
                    name={ODS_ICON_NAME.EXTERNAL_LINK}
                    size={ODS_ICON_SIZE.xxs}
                    color={ODS_THEME_COLOR_INTENT.primary}
                  />
                </OsdsLink>
              )}
            />
          </Suspense>
        </OsdsText>
      </div>
    </OsdsMessage>
  ) : null;
}
