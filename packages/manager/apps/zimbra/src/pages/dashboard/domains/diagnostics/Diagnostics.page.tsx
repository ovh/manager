import { useMemo } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_COLOR,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsIcon, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { IconLinkAlignmentType, LinkType, Links } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import {
  Loading,
  TabItemProps,
  TabsPanel,
  activatedTabs,
  useComputePathMatchers,
} from '@/components';
import { DomainDiagnosisTestResult, DomainDiagnosisTestStatusEnum } from '@/data/api';
import { useDomainDiagnostic } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { urls } from '@/routes/routes.constants';
import {
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

import DKIMTabContent from './DKIMTabContent.component';
import MXTabContent from './MXTabContent.component';
import SPFTabContent from './SPFTabContent.component';
import SRVTabContent from './SRVTabContent.component';

const isDiagnosticError = (diagnostic: DomainDiagnosisTestResult) => {
  return diagnostic && diagnostic?.status !== DomainDiagnosisTestStatusEnum.OK;
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
        <MXTabContent
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
        <SRVTabContent
          diagnostic={null}
          recordType={DnsRecordType.SRV}
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
        <SPFTabContent
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
        <DKIMTabContent
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
    [location, domain],
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
      <OdsText preset="heading-3">
        {t('zimbra_domain_diagnostic_subtitle', {
          domain: domain?.domainName,
        })}
      </OdsText>
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
