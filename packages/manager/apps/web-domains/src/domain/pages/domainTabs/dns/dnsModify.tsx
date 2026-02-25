import { useContext } from 'react';
import {
  BaseLayout,
  Breadcrumb,
  ChangelogButton,
  GuideButton,
  GuideItem,
  HeadersProps,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Icon,
  ICON_NAME,
  Link,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { changelogLinks } from '@/domain/constants/serviceDetail';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { urls } from '@/domain/routes/routes.constant';
import Loading from '@/common/components/Loading/Loading';
import {
  useGetDomainResource,
  useGetDomainZone,
} from '@/domain/hooks/data/query';
import DnsConfigurationRadio from '@/domain/components/ModifyNameServer/DnsConfigurationRadio';
import { TNameServer } from '@/domain/types/domainResource';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useLinks } from '@/domain/constants/guideLinks';

export default function DnsModifyPage() {
  const { t } = useTranslation(['domain', NAMESPACES.ONBOARDING]);
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const backUrl = useGenerateUrl(urls.domainTabDns, 'path', { serviceName });
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName,
  );
  const { domainZone, isFetchingDomainZone } = useGetDomainZone(
    serviceName,
    true,
  );
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const guideUrls = useLinks(ovhSubsidiary);

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: guideUrls.DOMAINS_LINK,
      target: '_blank',
      label: t('domain_guide_button_label'),
    },
  ];

  const header: HeadersProps = {
    title: serviceName,
    changelogButton: <ChangelogButton links={changelogLinks} />,
    headerButton: <GuideButton items={guideItems} />,
  };

  if (isFetchingDomainZone || isFetchingDomainResource) {
    return <Loading />;
  }

  const currentNameServers: string[] = domainResource.currentState?.dnsConfiguration?.nameServers.map(
    (ns: TNameServer) => ns.nameServer,
  );

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={t('title')} appName={'domain'} hideRootLabel />
      }
      header={header}
      backLinkLabel={t('domain_back_to_previous_page')}
      onClickReturn={() => {
        navigate(backUrl, { replace: true });
      }}
    >
      <section data-testid="modify-component">
        <Text preset={TEXT_PRESET.heading2} className="pb-8">
          {t('domain_tab_DNS_modification_title')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph} className="pb-4">
          {t('domain_tab_DNS_modification_DNS_used')}
          {currentNameServers?.length > 0 && (
            <strong>{currentNameServers?.join(', ')}</strong>
          )}
        </Text>
        <Message
          color={MESSAGE_COLOR.warning}
          className="w-full mt-4 mb-6"
          dismissible={false}
        >
          <MessageIcon name="triangle-exclamation" />
          <MessageBody>
            <strong className="text-[--ods-color-warning-800]">
              {t('domain_tab_DNS_modification_warning_message_title')}
            </strong>
            <br />
            {t('domain_tab_DNS_modification_warning_message_description1')}
            <br />
            {t('domain_tab_DNS_modification_warning_message_description2')}
            <br />
            <Link
              href={guideUrls.MODIFY_DNS_LINK}
              className="text-[--ods-color-primary-500]"
              target="_blank"
            >
              {t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
              <Icon name={ICON_NAME.externalLink} />
            </Link>
          </MessageBody>
        </Message>
        <DnsConfigurationRadio
          data-testid="dnsModify-radio"
          domainResource={domainResource}
          domainZone={domainZone}
          serviceName={serviceName}
        />
      </section>
    </BaseLayout>
  );
}
