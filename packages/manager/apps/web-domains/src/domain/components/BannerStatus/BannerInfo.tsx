import React from 'react';
import {
  Icon,
  ICON_NAME,
  Link,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { Trans, useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useGetServiceInformation } from '@/domain/hooks/data/query';
import { GUIDES_LIST } from '@/domain/constants/guideLinks';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';
import { getLanguageKey } from '@/domain/utils/utils';

interface BannerInfoProps {
  readonly serviceName: string;
}

export default function BannerInfo({ serviceName }: BannerInfoProps) {
  const { t, i18n } = useTranslation(['domain', NAMESPACES.ONBOARDING]);
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    serviceName,
    ServiceRoutes.Domain,
  );

  if (isServiceInfoLoading) {
    return <></>;
  }

  const langCode = getLanguageKey(i18n.language);
  const guideUrl = GUIDES_LIST.manualRenew.url[langCode];

  if (
    isServiceInfoLoading ||
    (serviceInfo &&
      serviceInfo.billing.renew?.current.mode !==
        ServiceInfoRenewModeEnum.Manual)
  ) {
    return <></>;
  }

  return (
    <Message
      color="information"
      dismissible={false}
      className="w-full mb-6"
      data-testid={'banner-info'}
    >
      <MessageIcon name={ICON_NAME.circleInfo} />
      <MessageBody>
        <Trans
          i18nKey={'domain_tab_general_information_banner_manual_renew'}
          t={t}
          components={{
            Link: (
              <Link href={guideUrl}>
                <Icon name={ICON_NAME.arrowRight} />
                {t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
              </Link>
            ),
          }}
        />
      </MessageBody>
    </Message>
  );
}
