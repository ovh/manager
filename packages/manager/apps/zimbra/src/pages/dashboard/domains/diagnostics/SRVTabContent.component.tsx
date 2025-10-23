import { useMemo } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { Clipboard } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { GuideLink } from '@/components';
import {
  DomainDiagnosisTestResult,
  DomainDiagnosisTestStatusEnum,
  ExpectedDNSConfig,
} from '@/data/api';
import { GUIDES_LIST, Guide } from '@/guides.constants';
import { AUTO_CONFIGURE_DOMAIN } from '@/tracking.constants';
import { DnsRecordType } from '@/utils/dnsconfig.constants';
import { parseSRVRecord } from '@/utils/domains';

import StatusBadge from './StatusBadge.component';

const SRVTabContent = ({
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
  const { subdomain, priority, weight, port, target } = useMemo(() => {
    if (expectedDNSConfig?.autodiscover) {
      return parseSRVRecord(expectedDNSConfig?.autodiscover);
    }
  }, [expectedDNSConfig?.autodiscover]);

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
            <table className="dns-fields table-auto">
              <tbody>
                <tr key="type">
                  <td>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_type')}</strong>
                      <OdsText preset={ODS_TEXT_PRESET.span}>{recordType}</OdsText>
                    </OdsText>
                  </td>
                </tr>
                <tr key="srv">
                  <td>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph} className="min-w-32">
                      <strong className="mr-4">
                        {t('zimbra_domain_diagnostic_field_subdomain')}
                      </strong>
                    </OdsText>
                    <Clipboard value={subdomain} />
                  </td>
                  <td>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph} className="min-w-32">
                      <strong className="mr-4">
                        {t('zimbra_domain_diagnostic_field_priority')}
                      </strong>
                    </OdsText>
                    <Clipboard value={String(priority)} />
                  </td>
                  <td>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph} className="min-w-32">
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_field_weight')}</strong>
                    </OdsText>
                    <Clipboard value={String(weight)} />
                  </td>
                  <td>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph} className="min-w-32">
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_field_port')}</strong>
                    </OdsText>
                    <Clipboard value={String(port)} />
                  </td>
                  <td>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph} className="min-w-32">
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_field_target')}</strong>
                    </OdsText>
                    <Clipboard value={target} />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default SRVTabContent;
