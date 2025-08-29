import React, { Fragment, useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import {
  ODS_BADGE_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  JSX as Ods,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsButton, OdsIcon, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';

import {
  Clipboard,
  IconLinkAlignmentType,
  LinkType,
  Links,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import {
  GuideLink,
  Loading,
  TabItemProps,
  TabsPanel,
  activatedTabs,
  useComputePathMatchers,
} from '@/components';
import {
  DomainDiagnosisTestResult,
  DomainDiagnosisTestStatusEnum,
  ExpectedDNSConfig,
} from '@/data/api';
import { useDomainDiagnostic } from '@/data/hooks';
import { GUIDES_LIST, Guide } from '@/guides.constants';
import { useGenerateUrl } from '@/hooks';
import { urls } from '@/routes/routes.constants';
import {
  AUTO_CONFIGURE_DOMAIN,
  BACK_PREVIOUS_PAGE,
  DOMAIN_DIAGNOSTICS,
  DOMAIN_DIAGNOSTICS_DKIM,
  DOMAIN_DIAGNOSTICS_MX,
  DOMAIN_DIAGNOSTICS_REFRESH,
  DOMAIN_DIAGNOSTICS_SPF,
  DOMAIN_DIAGNOSTICS_SRV,
} from '@/tracking.constants';
import { FEATURE_FLAGS } from '@/utils';
import { DnsRecordType } from '@/utils/dnsconfig.constants';

const isDiagnosticError = (diagnostic: DomainDiagnosisTestResult) => {
  return diagnostic && diagnostic?.status !== DomainDiagnosisTestStatusEnum.OK;
};

const getStatusBadgeColor = (status: DomainDiagnosisTestStatusEnum): ODS_BADGE_COLOR => {
  switch (status) {
    case DomainDiagnosisTestStatusEnum.OK:
      return ODS_BADGE_COLOR.success;
    case DomainDiagnosisTestStatusEnum.ERROR:
      return ODS_BADGE_COLOR.critical;
    case DomainDiagnosisTestStatusEnum.WARNING:
      return ODS_BADGE_COLOR.warning;
    default:
      return ODS_BADGE_COLOR.neutral;
  }
};

type StatusBadgeProps = StyleReactProps &
  Omit<Ods.OdsBadge, 'label' | 'color'> & {
    status: DomainDiagnosisTestStatusEnum;
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

const TabTitle = ({ title, hasError }: { title: string; hasError?: boolean }) => {
  return (
    <>
      {title}
      {hasError && (
        <OdsIcon className="diag-dns-icon ml-4" name={ODS_ICON_NAME.hexagonExclamation} />
      )}
    </>
  );
};

const useDNSRecordConfigHelp = ({
  expectedDNSConfig,
  recordType,
}: {
  expectedDNSConfig: ExpectedDNSConfig;
  recordType: DnsRecordType;
}) => {
  const { t } = useTranslation('domains/diagnostic');
  switch (recordType) {
    case DnsRecordType.MX:
      return (
        <>
          {expectedDNSConfig?.mx?.map(({ priority, target }) => (
            <tr key={target}>
              <td>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  <strong className="mr-4">{t('zimbra_domain_diagnostic_field_priority')}</strong>
                  {priority}
                </OdsText>
              </td>
              <td>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  <strong className="mr-4">{t('zimbra_domain_diagnostic_field_target')}</strong>
                </OdsText>
                <Clipboard value={target.toString()} />
              </td>
            </tr>
          ))}
        </>
      );
    case DnsRecordType.SPF:
      return (
        <tr key="spf">
          <td>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <strong className="mr-4">{t('zimbra_domain_diagnostic_field_value')}</strong>
            </OdsText>
            <Clipboard value={expectedDNSConfig?.spf} />
          </td>
        </tr>
      );
    case DnsRecordType.DKIM:
      return expectedDNSConfig?.dkim?.cnames?.map((cname, index) => (
        <Fragment key={cname?.name}>
          <tr key={`CNAME ${index + 1}`}>
            <td>
              <OdsText preset={ODS_TEXT_PRESET.heading5}>{`CNAME ${index + 1}`}</OdsText>
            </td>
          </tr>
          <tr key={cname?.name}>
            <td>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                <strong className="mr-4">{t('zimbra_domain_diagnostic_field_subdomain')}</strong>
              </OdsText>
              <Clipboard value={cname?.name} />
            </td>
          </tr>
          <tr key={cname?.value}>
            <td>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                <strong className="mr-4">{t('zimbra_domain_diagnostic_field_value')}</strong>
              </OdsText>
              <Clipboard value={cname?.value} />
            </td>
          </tr>
        </Fragment>
      ));
    case DnsRecordType.SRV:
    default:
      return <></>;
  }
};

const TabContent = ({
  diagnostic,
  recordType,
  expectedDNSConfig,
  trackingName,
  isAutoConfigurable,
  guide = GUIDES_LIST.dns_configuration_guide,
}: {
  diagnostic: DomainDiagnosisTestResult;
  recordType: DnsRecordType;
  expectedDNSConfig: ExpectedDNSConfig;
  trackingName: string;
  isAutoConfigurable: boolean;
  guide?: Guide;
}) => {
  const { t } = useTranslation('domains/diagnostic');
  const { trackClick } = useOvhTracking();
  const fieldHelpers = useDNSRecordConfigHelp({
    expectedDNSConfig,
    recordType,
  });

  if (!diagnostic) {
    return (
      <OdsMessage className="md:w-1/2" isDismissible={false} color={ODS_MESSAGE_COLOR.danger}>
        {t('zimbra_domain_diagnostic_loading_error')}
      </OdsMessage>
    );
  }

  const isOk = diagnostic && diagnostic.status === DomainDiagnosisTestStatusEnum.OK;
  const [error] = diagnostic.errors;

  return (
    <div className="flex flex-col gap-4 md:w-1/2" data-testid={`tab-content-${recordType}`}>
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <strong>{t('zimbra_domain_diagnostic_status')}</strong>
        <StatusBadge className="ml-4" status={diagnostic.status} />
      </OdsText>
      {!isOk && (
        <OdsMessage className="w-full" isDismissible={false} color={ODS_MESSAGE_COLOR.warning}>
          {t(
            `zimbra_domain_diagnostic_information_banner_${recordType.toLowerCase()}_${diagnostic?.status.toLowerCase()}`,
          )}
        </OdsMessage>
      )}
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey={`zimbra_domain_diagnostic_information_message_${recordType.toLowerCase()}_${diagnostic?.status.toLowerCase()}`}
          values={{
            recordType,
            errorCode: error?.code,
          }}
        />
      </OdsText>
      {!isOk && (
        <>
          {guide && <GuideLink label={t('zimbra_domain_diagnostic_access_guide')} guide={guide} />}
          {isAutoConfigurable ? (
            <OdsButton
              label={t('zimbra_domain_diagnostic_cta_auto_configure')}
              onClick={() => {
                trackClick({
                  location: PageLocation.page,
                  buttonType: ButtonType.button,
                  actionType: 'action',
                  actions: [trackingName, AUTO_CONFIGURE_DOMAIN],
                });
              }}
            />
          ) : (
            <table className="table-auto dns-fields">
              <tbody>
                <tr key="type">
                  <td>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_type')}</strong>
                      <OdsText preset={ODS_TEXT_PRESET.span}>
                        {recordType === DnsRecordType.DKIM ? 'CNAME' : recordType}
                      </OdsText>
                    </OdsText>
                  </td>
                </tr>
                {fieldHelpers}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export const DomainDiagnostics = () => {
  const { t } = useTranslation('domains/diagnostic');
  const location = useLocation();
  const { domainId } = useParams();
  const { trackClick } = useOvhTracking();
  const goBackUrl = useGenerateUrl('../../..', 'href');

  const {
    data: domain,
    isFetching,
    isError,
    refetch: refreshDiagnostic,
  } = useDomainDiagnostic({
    domainId,
  });

  // autoconfigure is not yet ready on cerbo side, they will provide
  // a boolean to let us know if it's auto configurable or no

  const expectedDNSConfig = domain?.recommendations?.expectedDNSConfig;

  const tabsList: TabItemProps[] = [
    {
      name: DnsRecordType.MX,
      trackingName: DOMAIN_DIAGNOSTICS_MX,
      title: (
        <TabTitle
          title={DnsRecordType.MX}
          hasError={!isFetching && isDiagnosticError(domain?.result?.mx)}
        />
      ),
      to: useGenerateUrl(`../diagnostics/mx`, 'path'),
      pathMatchers: useComputePathMatchers([urls.domains_diagnostic_mx]),
      component: (
        <TabContent
          diagnostic={domain?.result?.mx}
          recordType={DnsRecordType.MX}
          expectedDNSConfig={expectedDNSConfig}
          trackingName={DOMAIN_DIAGNOSTICS_MX}
          isAutoConfigurable={false}
        />
      ),
    },
    {
      name: DnsRecordType.SRV,
      trackingName: DOMAIN_DIAGNOSTICS_SRV,
      title: <TabTitle title={DnsRecordType.SRV} hasError={false} />,
      to: useGenerateUrl('../diagnostics/srv', 'path'),
      hidden: !FEATURE_FLAGS.DOMAIN_DIAGNOSTICS_SRV,
      pathMatchers: useComputePathMatchers([urls.domains_diagnostic_srv]),
      component: (
        <TabContent
          diagnostic={null}
          recordType={DnsRecordType.SRV}
          expectedDNSConfig={expectedDNSConfig}
          trackingName={DOMAIN_DIAGNOSTICS_SRV}
          isAutoConfigurable={false}
        />
      ),
    },
    {
      name: DnsRecordType.SPF,
      trackingName: DOMAIN_DIAGNOSTICS_SPF,
      title: (
        <TabTitle
          title={DnsRecordType.SPF}
          hasError={!isFetching && isDiagnosticError(domain?.result?.spf)}
        />
      ),
      to: useGenerateUrl('../diagnostics/spf', 'path'),
      pathMatchers: useComputePathMatchers([urls.domains_diagnostic_spf]),
      component: (
        <TabContent
          diagnostic={domain?.result?.spf}
          recordType={DnsRecordType.SPF}
          expectedDNSConfig={expectedDNSConfig}
          trackingName={DOMAIN_DIAGNOSTICS_SPF}
          isAutoConfigurable={false}
        />
      ),
    },
    {
      name: DnsRecordType.DKIM,
      trackingName: DOMAIN_DIAGNOSTICS_DKIM,
      title: (
        <TabTitle
          title={DnsRecordType.DKIM}
          hasError={!isFetching && isDiagnosticError(domain?.result?.dkim)}
        />
      ),
      to: useGenerateUrl('../diagnostics/dkim', 'path'),
      pathMatchers: useComputePathMatchers([urls.domains_diagnostic_dkim]),
      component: (
        <TabContent
          diagnostic={domain?.result?.dkim}
          recordType={DnsRecordType.DKIM}
          expectedDNSConfig={expectedDNSConfig}
          trackingName={DOMAIN_DIAGNOSTICS_DKIM}
          isAutoConfigurable={false}
        />
      ),
    },
  ];

  const currentTab = useMemo(
    () =>
      tabsList.find((tab) => activatedTabs(tab.pathMatchers, location))?.component ||
      tabsList[0].component,
    [location, domain, isFetching, tabsList],
  );

  const handleRefreshClick = async () => {
    await refreshDiagnostic();
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DOMAIN_DIAGNOSTICS_REFRESH],
    });
  };

  return (
    <div className="flex flex-col w-full gap-4" data-testid="domain-diagnostic-page">
      <Links
        iconAlignment={IconLinkAlignmentType.left}
        type={LinkType.back}
        href={goBackUrl}
        color={ODS_LINK_COLOR.primary}
        onClickReturn={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'navigation',
            actions: [DOMAIN_DIAGNOSTICS, BACK_PREVIOUS_PAGE],
          });
        }}
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
        <OdsMessage className="md:w-1/2" isDismissible={false} color={ODS_MESSAGE_COLOR.danger}>
          {t('zimbra_domain_diagnostics_loading_error')}
        </OdsMessage>
      )}
      {!isFetching && !isError && domain && currentTab}
    </div>
  );
};

export default DomainDiagnostics;
