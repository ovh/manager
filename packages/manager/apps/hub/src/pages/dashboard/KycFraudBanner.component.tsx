import { Suspense, useContext, useEffect, useMemo } from 'react';

import { Await } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementRel, OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsLink, OsdsMessage, OsdsSkeleton, OsdsText } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { SUPPORT_URLS } from '@/components/hub-support/HubSupport.constants';
import { useKyc } from '@/data/hooks/kyc/useKyc';
import { useHubContext } from '@/pages/dashboard/context';
import {
  KYC_FRAUD_FEATURE,
  KYC_FRAUD_TRACK_IMPRESSION,
} from '@/pages/dashboard/dashboard.constants';
import { KycProcedures, KycStatuses } from '@/types/kyc.type';

export default function KycFraudBanner() {
  const { t } = useTranslation('hub/kyc');
  const {
    environment,
    shell: { navigation, tracking },
  } = useContext(ShellContext);
  const { availability, isLoading, isFreshCustomer } = useHubContext();
  const { useKycStatus } = useKyc(KycProcedures.FRAUD);
  const { user } = environment;
  const region = environment.getRegion();
  const isEUOrCA = ['EU', 'CA'].includes(region);
  const { data } = useKycStatus({
    enabled: !(isLoading || isFreshCustomer || availability?.[KYC_FRAUD_FEATURE]),
  });

  const shouldBeDisplayed = useMemo(
    () =>
      data?.status === KycStatuses.REQUIRED ||
      (data?.status === KycStatuses.OPEN && Boolean(data?.ticketId)),
    [data],
  );

  useEffect(() => {
    if (shouldBeDisplayed) {
      tracking.trackImpression({
        ...KYC_FRAUD_TRACK_IMPRESSION,
        variant: data?.status,
      });
    }
  }, [shouldBeDisplayed]);

  const link = useMemo(() => {
    if (data?.status === KycStatuses.REQUIRED) {
      return navigation.getURL('dedicated', '#/documents', {});
    }
    return isEUOrCA
      ? Promise.resolve(`${SUPPORT_URLS.allTickets}${user.ovhSubsidiary}`)
      : navigation.getURL('dedicated', '#/support/tickets', {});
  }, [data]);

  const trackLink = () => {
    tracking.trackClickImpression({
      click: {
        ...KYC_FRAUD_TRACK_IMPRESSION,
        variant: data?.status,
      },
    });
  };

  return shouldBeDisplayed ? (
    <OsdsMessage
      className="flex rounded mb-4"
      type={
        data?.status === KycStatuses.REQUIRED ? ODS_MESSAGE_TYPE.warning : ODS_MESSAGE_TYPE.info
      }
      color={
        data?.status === KycStatuses.REQUIRED
          ? ODS_THEME_COLOR_INTENT.warning
          : ODS_THEME_COLOR_INTENT.info
      }
      removable={true}
      data-testid="kyc_fraud_banner"
    >
      <OsdsText
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        {t(`kyc_fraud_${data.status}_banner_text`)}
        {link && (
          <Suspense fallback={<OsdsSkeleton data-testid="kyc_fraud_banner_link_skeleton" />}>
            <Await
              resolve={link}
              children={(href: string) => (
                <OsdsLink
                  className="ml-2"
                  color={ODS_THEME_COLOR_INTENT.primary}
                  href={href}
                  target={OdsHTMLAnchorElementTarget._top}
                  rel={OdsHTMLAnchorElementRel.noopener}
                  onClick={trackLink}
                  data-testid="kyc_fraud_link"
                >
                  {t(`kyc_fraud_${data.status}_banner_link`)}
                </OsdsLink>
              )}
            />
          </Suspense>
        )}
      </OsdsText>
    </OsdsMessage>
  ) : null;
}
