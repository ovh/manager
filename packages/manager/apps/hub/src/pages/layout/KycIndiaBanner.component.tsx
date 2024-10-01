import { Suspense, useContext, useEffect, useMemo } from 'react';
import { Await } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
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
import { useKyc } from '@/data/hooks/kyc/useKyc';
import { KycProcedures, KycStatuses } from '@/types/kyc.type';

export default function KycIndiaBanner() {
  const { t } = useTranslation();
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { trackClick, trackPage } = useOvhTracking();
  const { useKycStatus } = useKyc(KycProcedures.INDIA);
  const { data } = useKycStatus();

  const shouldBeDisplayed = useMemo(
    () => data?.status === KycStatuses.REQUIRED,
    [data],
  );

  useEffect(() => {
    if (shouldBeDisplayed && !data?.ticketId) {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: 'kyc-india',
      });
    }
  }, [data]);

  const link = useMemo(
    () =>
      data?.ticketId
        ? null
        : navigation.getURL('dedicated', '#/identity-documents', {}),
    [data],
  );

  const trackLink = () => {
    trackClick({
      actionType: 'action',
      actions: ['kyc-india', 'verify-identity'],
    });
  };

  return shouldBeDisplayed ? (
    <OsdsMessage
      className="flex rounded"
      type={ODS_MESSAGE_TYPE.info}
      color={ODS_THEME_COLOR_INTENT.info}
      removable={true}
      data-testid="kyc_india_banner"
    >
      <div>
        <OsdsText
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="block mb-5"
        >
          {t(
            `manager_hub_dashboard_kyc_banner_description${
              data.ticketId ? '_waiting' : ''
            }`,
          )}
        </OsdsText>
        {link && (
          <Suspense
            fallback={
              <OsdsSkeleton data-testid="kyc_india_banner_link_skeleton" />
            }
          >
            <Await
              resolve={link}
              children={(href: string) => (
                <OsdsLink
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={href}
                  target={OdsHTMLAnchorElementTarget._top}
                  rel={OdsHTMLAnchorElementRel.noopener}
                  onClick={trackLink}
                  data-testid="kyc_india_link"
                >
                  {t('manager_hub_dashboard_kyc_banner_link')}
                </OsdsLink>
              )}
            />
          </Suspense>
        )}
      </div>
    </OsdsMessage>
  ) : null;
}
