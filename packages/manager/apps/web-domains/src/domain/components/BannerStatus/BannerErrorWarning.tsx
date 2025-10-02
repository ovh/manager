import React, { useContext } from 'react';
import {
  Icon,
  ICON_NAME,
  Link,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ShellContext,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { RENEW_URL } from '@/alldoms/constants';
import { bannerTypeFromFlags } from '@/domain/utils/bannerStatus';
import { useGetDomainResource } from '@/domain/hooks/data/query';

interface BannerErrorWarningProps {
  readonly serviceName: string;
}

export default function BannerErrorWarning({
  serviceName,
}: BannerErrorWarningProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const { domainResource } = useGetDomainResource(serviceName);
  const {
    environment: { user },
  } = useContext(ShellContext);

  const restoreUrl = `${RENEW_URL[user.ovhSubsidiary] ||
    RENEW_URL.default}${serviceName}`;

  const states = [
    ...domainResource.currentState.additionalStates,
    domainResource.currentState.suspensionState,
    domainResource.currentState.mainState,
  ];
  const bannerDetails = bannerTypeFromFlags(states);

  if (!domainResource || !bannerDetails) {
    return <></>;
  }
  let linkHref = '';
  if (bannerDetails.link?.linkDetails) {
    const { data: link } = useNavigationGetUrl(bannerDetails.link.linkDetails);
    linkHref = link as string;
  }

  return (
    <Message
      color={bannerDetails.type === 'warning' ? bannerDetails.type : 'critical'}
      dismissible={false}
      className="w-full pb-6"
      data-testid={`banner-${bannerDetails.type}`}
    >
      <MessageIcon
        name={
          bannerDetails.type === 'warning'
            ? 'triangle-exclamation'
            : 'hexagon-exclamation'
        }
      />
      <MessageBody data-testid="banner-body">
        {bannerDetails.link ? (
          <Trans
            i18nKey={bannerDetails.i18nKey}
            t={t}
            components={{
              Link: (
                <Link
                  href={bannerDetails.link.orderFunnel ? restoreUrl : linkHref}
                  data-testid={'banner-link'}
                >
                  <Icon name={ICON_NAME.arrowRight} />
                  {t(bannerDetails.link.linki18n)}
                </Link>
              ),
            }}
          />
        ) : (
          t(bannerDetails.i18nKey)
        )}
      </MessageBody>
    </Message>
  );
}
