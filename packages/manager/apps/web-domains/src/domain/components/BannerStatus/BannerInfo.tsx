import { useContext } from 'react';
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
import { useGetServiceInformation } from '@/common/hooks/data/query';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ServiceRoutes,
  ServiceInfoRenewModeEnum,
} from '@/common/enum/common.enum';
import { useLinks } from '@/domain/constants/guideLinks';

interface BannerInfoProps {
  readonly serviceName: string;
}

export default function BannerInfo({ serviceName }: BannerInfoProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ONBOARDING]);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { serviceInfo, isServiceInfoLoading } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );

  const guideUrls = useLinks(ovhSubsidiary);

  if (isServiceInfoLoading) {
    return <></>;
  }

  if (
    isServiceInfoLoading ||
    (serviceInfo &&
      serviceInfo?.billing?.renew?.current.mode !==
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
              <Link href={guideUrls.MANUAL_RENEW_LINK}>
                {t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
                <Icon name={ICON_NAME.arrowRight} />
              </Link>
            ),
          }}
        />
      </MessageBody>
    </Message>
  );
}
