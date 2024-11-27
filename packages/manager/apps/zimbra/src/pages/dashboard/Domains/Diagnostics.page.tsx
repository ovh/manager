import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  LinkType,
  Links,
  IconLinkAlignmentType,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ODS_BADGE_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  JSX as Ods,
} from '@ovhcloud/ods-components';
import {
  OdsBadge,
  OdsButton,
  OdsClipboard,
  OdsIcon,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';
import { useGenerateUrl, usePlatform } from '@/hooks';
import Loading from '@/components/Loading/Loading';
import TabsPanel, {
  activatedTabs,
  computePathMatchers,
  TabItemProps,
} from '@/components/layout-helpers/Dashboard/TabsPanel';
import { urls } from '@/routes/routes.constants';
import { useDomainDiagnostic } from '@/hooks/useDomainDiagnostic';
import { DiagnosticStatusEnum, DnsDiagnostic } from '@/api/domain';
import { DnsRecordType } from '@/utils/dnsconfig.constants';
import GuideLink from '@/components/GuideLink';
import { Guide, GUIDES_LIST } from '@/guides.constants';
import { FEATURE_FLAGS } from '@/utils';
import { useDomainZone } from '@/hooks/useDomainZone';
import queryClient from '@/queryClient';

// this should be in data.currentState.expectedDNSConfig.srv
const srvFields = {
  subdomain: '_autodiscover._tcp',
  priority: '0',
  weight: '0',
  port: '443',
  target: 'ex5.mail.ovh.net.',
};

// this should be in data.currentState.expectedDNSConfig.mx
const mxFields = [
  { priority: 1, target: 'mx0.mail.ovh.net' },
  { priority: 5, target: 'mx1.mail.ovh.net' },
  { priority: 10, target: 'mx2.mail.ovh.net' },
  { priority: 100, target: 'mx3.mail.ovh.net' },
];

// this should be in data.currentState.expectedDNSConfig.spf
const spfFields = {
  subdomain: '_autodiscover._tcp',
  target: '"v=spf1 include:mx.ovh.com ~all"',
};

// this should be in data.currentState.expectedDNSConfig.dkim
const dkimFields = [
  {
    subdomain: 'testdkim1.fr',
    target: '"v=dkim include:mx.ovh.com ~all"',
  },
  {
    subdomain: 'testdkim2.fr',
    target: '"v=dkim include:mx2.ovh.com ~all"',
  },
];

const isDiagnosticError = (diagnostic: DnsDiagnostic) => {
  return (
    diagnostic &&
    [DiagnosticStatusEnum.ERROR, DiagnosticStatusEnum.TO_CONFIGURE].includes(
      diagnostic.status,
    )
  );
};

const getStatusBadgeColor = (status: DiagnosticStatusEnum): ODS_BADGE_COLOR => {
  switch (status) {
    case DiagnosticStatusEnum.OK:
      return ODS_BADGE_COLOR.success;
    case DiagnosticStatusEnum.ERROR:
      return ODS_BADGE_COLOR.critical;
    case DiagnosticStatusEnum.UPDATING:
      return ODS_BADGE_COLOR.information;
    case DiagnosticStatusEnum.TO_CONFIGURE:
    case DiagnosticStatusEnum.DISABLED:
    default:
      return ODS_BADGE_COLOR.neutral;
  }
};

type StatusBadgeProps = StyleReactProps &
  Omit<Ods.OdsBadge, 'label' | 'color'> & {
    status: DiagnosticStatusEnum;
  };

const StatusBadge = ({ status, ...props }: StatusBadgeProps) => {
  const { t } = useTranslation('domains/diagnostic');
  return (
    <OdsBadge
      color={getStatusBadgeColor(status)}
      label={t(`zimbra_domain_diagnostic_status_${status.toLowerCase()}`)}
      {...props}
    />
  );
};

const TabTitle = ({
  title,
  hasError,
}: {
  title: string;
  hasError?: boolean;
}) => {
  return (
    <>
      {title}
      {hasError && (
        <OdsIcon
          className="diag-dns-icon ml-4"
          name={ODS_ICON_NAME.hexagonExclamation}
        />
      )}
    </>
  );
};

const useDNSRecordConfigHelp = ({
  diagnostic, // pass expectedDNSConfig instead
  recordType,
}: {
  diagnostic: DnsDiagnostic;
  recordType: DnsRecordType;
}) => {
  const { t } = useTranslation('domains/diagnostic');
  switch (recordType) {
    case DnsRecordType.MX:
      return (
        <>
          <tr key="host">
            <td>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                <strong>{t('zimbra_domain_diagnostic_field_host')} </strong>
                To be defined
              </OdsText>
            </td>
          </tr>
          {mxFields.map(({ priority, target }) => (
            <tr key={target}>
              <td>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  <strong>
                    {t('zimbra_domain_diagnostic_field_priority')}{' '}
                  </strong>
                  {priority}
                </OdsText>
              </td>
              <td>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  <strong>{t('zimbra_domain_diagnostic_field_target')} </strong>
                </OdsText>
                <OdsClipboard className="ml-4" value={target.toString()} />
              </td>
            </tr>
          ))}
        </>
      );
    case DnsRecordType.SPF:
    case DnsRecordType.SRV:
      return Object.entries(
        recordType === DnsRecordType.SRV ? srvFields : spfFields,
      ).map(([key, value]) => (
        <tr key={key}>
          <td>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <strong>{t(`zimbra_domain_diagnostic_field_${key}`)} </strong>
            </OdsText>
            <OdsClipboard className="ml-4" value={value} />
          </td>
        </tr>
      ));
    case DnsRecordType.DKIM:
      return dkimFields.map((cname, index) => (
        <Fragment key={index}>
          <tr key={`CNAME ${index + 1}`}>
            <td>
              <OdsText preset={ODS_TEXT_PRESET.heading5}>
                {`CNAME ${index + 1}`}
              </OdsText>
            </td>
          </tr>
          {Object.entries(cname).map(([key, value]) => (
            <tr key={value}>
              <td>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  <strong>{t(`zimbra_domain_diagnostic_field_${key}`)} </strong>
                </OdsText>
                <OdsClipboard className="ml-4" value={value} />
              </td>
            </tr>
          ))}
        </Fragment>
      ));
    default:
      return <></>;
  }
};

const TabContent = ({
  diagnostic,
  recordType,
  isOvh,
  guide = GUIDES_LIST.dns_configuration_guide,
}: {
  diagnostic: DnsDiagnostic;
  recordType: DnsRecordType;
  isOvh: boolean;
  guide?: Guide;
}) => {
  const { t } = useTranslation('domains/diagnostic');
  const hasError = isDiagnosticError(diagnostic);
  const fieldHelpers = useDNSRecordConfigHelp({
    diagnostic,
    recordType,
  });

  if (!diagnostic) {
    return (
      <OdsMessage
        className="md:w-1/2"
        isDismissible={false}
        color={ODS_MESSAGE_COLOR.danger}
      >
        {t('zimbra_domain_diagnostic_loading_error')}
      </OdsMessage>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:w-1/2">
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <strong>{t('zimbra_domain_diagnostic_status')}</strong>
        <StatusBadge className="ml-4" status={diagnostic.status} />
      </OdsText>
      {hasError && diagnostic?.errorMessage && (
        <OdsMessage
          className="w-full"
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.warning}
        >
          {diagnostic.errorMessage}
        </OdsMessage>
      )}
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey={`zimbra_domain_diagnostic_information_message_${diagnostic.status.toLowerCase()}`}
          values={{
            recordType,
            errorCode: diagnostic.errorCode,
          }}
        />
      </OdsText>
      {hasError && guide && (
        <GuideLink
          label={t('zimbra_domain_diagnostic_access_guide')}
          guide={guide}
        />
      )}
      {hasError && !isOvh && (
        <table className="table-auto dns-fields">
          <tbody>
            <tr key="type">
              <td>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  <strong>{t('zimbra_domain_diagnostic_type')} </strong>
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {recordType === DnsRecordType.DKIM ? 'TXT' : recordType}
                  </OdsText>
                </OdsText>
              </td>
            </tr>
            {fieldHelpers}
          </tbody>
        </table>
      )}
      {hasError && isOvh && (
        <OdsButton label={t('zimbra_domain_diagnostic_cta_auto_configure')} />
      )}
    </div>
  );
};

export default function DomainDiagnostics() {
  const { t } = useTranslation('domains/diagnostic');
  const { platformId } = usePlatform();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const domainId = searchParams.get('domainId');
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('../..', 'href');
  // const onClose = () => navigate(goBackUrl);
  const [isFetching, setIsFetching] = useState(true);

  const {
    data: domain,
    isFetching: isFetchingDiag,
    isError,
  } = useDomainDiagnostic({
    domainId,
  });

  const { data: zone, isFetching: isFetchingZone } = useDomainZone({
    name: domain?.domainName,
    enabled: !!domain,
  });

  useEffect(() => {
    setIsFetching(isFetchingDiag || isFetchingZone);
  }, [isFetchingDiag, isFetchingZone]);

  const tabsList: TabItemProps[] = [
    {
      name: DnsRecordType.MX,
      title: (
        <TabTitle
          title={DnsRecordType.MX}
          hasError={!isFetching && isDiagnosticError(domain?.diagnostic.mx)}
        />
      ),
      to: useGenerateUrl('../diagnostics/mx', 'path', params),
      pathMatchers: computePathMatchers(
        [urls.domains_diagnostic_mx],
        platformId,
      ),
      component: (
        <TabContent
          diagnostic={domain?.diagnostic?.mx}
          recordType={DnsRecordType.MX}
          isOvh={!!zone}
        />
      ),
    },
    {
      name: DnsRecordType.SRV,
      title: <TabTitle title={DnsRecordType.SRV} hasError={false} />,
      to: useGenerateUrl('../diagnostics/srv', 'path', params),
      hidden: !FEATURE_FLAGS.DOMAIN_DIAGNOSTICS_SRV,
      pathMatchers: computePathMatchers(
        [urls.domains_diagnostic_srv],
        platformId,
      ),
      component: (
        <TabContent
          diagnostic={null}
          recordType={DnsRecordType.SRV}
          isOvh={!!zone}
        />
      ),
    },
    {
      name: DnsRecordType.SPF,
      title: (
        <TabTitle
          title={DnsRecordType.SPF}
          hasError={!isFetching && isDiagnosticError(domain?.diagnostic.spf)}
        />
      ),
      to: useGenerateUrl('../diagnostics/spf', 'path', params),
      pathMatchers: computePathMatchers(
        [urls.domains_diagnostic_spf],
        platformId,
      ),
      component: (
        <TabContent
          diagnostic={domain?.diagnostic?.spf}
          recordType={DnsRecordType.SPF}
          isOvh={!!zone}
        />
      ),
    },
    {
      name: DnsRecordType.DKIM,
      title: (
        <TabTitle
          title={DnsRecordType.DKIM}
          hasError={!isFetching && isDiagnosticError(domain?.diagnostic.dkim)}
        />
      ),
      to: useGenerateUrl('../diagnostics/dkim', 'path', params),
      pathMatchers: computePathMatchers(
        [urls.domains_diagnostic_dkim],
        platformId,
      ),
      component: (
        <TabContent
          diagnostic={domain?.diagnostic?.dkim}
          recordType={DnsRecordType.DKIM}
          isOvh={!!zone}
        />
      ),
    },
  ];

  const currentTab = useMemo(
    () =>
      tabsList.find((tab) => activatedTabs(tab.pathMatchers, location))
        ?.component || tabsList[0].component,
    [location, domain, isFetching],
  );

  const handleRefreshClick = () => {
    queryClient.invalidateQueries({ queryKey: ['get', 'domain'] });
  };

  return (
    <div
      className="flex flex-col w-full gap-4"
      data-testid="domain-diagnostic-page"
    >
      <Links
        iconAlignment={IconLinkAlignmentType.left}
        type={LinkType.back}
        href={goBackUrl}
        color={ODS_LINK_COLOR.primary}
        label={t('zimbra_domain_diagnostic_cta_back')}
      />
      <Subtitle>
        {t('zimbra_domain_diagnostic_subtitle', {
          domain: domain?.domainName,
        })}
      </Subtitle>
      <div className="mt-6">
        <OdsButton
          data-testid="refresh"
          label={t('zimbra_domain_diagnostic_cta_refresh')}
          icon={ODS_ICON_NAME.refresh}
          variant={ODS_BUTTON_VARIANT.outline}
          isLoading={isFetching}
          onClick={handleRefreshClick}
        ></OdsButton>
      </div>
      <div className="mt-5 mb-8">
        <TabsPanel tabs={tabsList} />
      </div>
      {isFetching && !isError && <Loading />}
      {!isFetching && isError && (
        <OdsMessage
          className="md:w-1/2"
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.danger}
        >
          {t('zimbra_domain_diagnostics_loading_error')}
        </OdsMessage>
      )}
      {!isFetching && !isError && domain && currentTab}
    </div>
  );
}
