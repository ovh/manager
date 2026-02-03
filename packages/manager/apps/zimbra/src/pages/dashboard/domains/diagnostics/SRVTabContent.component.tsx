import { useMemo } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import {
  Button,
  ICON_NAME,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Clipboard } from '@ovh-ux/muk';

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
  const { subdomain, priority, weight, port, target } =
    useMemo(() => {
      if (expectedDNSConfig?.autodiscover) {
        return parseSRVRecord(expectedDNSConfig?.autodiscover);
      }
    }, [expectedDNSConfig?.autodiscover]) ?? {};

  if (!diagnostic) {
    return (
      <Message className="md:w-1/2" dismissible={false} color={MESSAGE_COLOR.critical}>
        <MessageIcon name={ICON_NAME.hexagonExclamation} />
        <MessageBody>{t('zimbra_domain_diagnostic_loading_error')}</MessageBody>
      </Message>
    );
  }

  const isOk = diagnostic && diagnostic.status === DomainDiagnosisTestStatusEnum.OK;
  const [error] = diagnostic.errors;

  return (
    <div className="flex flex-col gap-4 md:w-1/2" data-testid={`tab-content-${recordType}`}>
      <Text preset={TEXT_PRESET.paragraph}>
        <strong>{t('zimbra_domain_diagnostic_status')}</strong>
        <StatusBadge className="ml-4" status={diagnostic.status} />
      </Text>
      {!isOk && (
        <Message className="w-full" dismissible={false} color={MESSAGE_COLOR.warning}>
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          <MessageBody>
            {t(
              `zimbra_domain_diagnostic_information_banner_${recordType.toLowerCase()}_${diagnostic?.status.toLowerCase()}`,
            )}
          </MessageBody>
        </Message>
      )}
      <Text preset={TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey={`zimbra_domain_diagnostic_information_message_${recordType.toLowerCase()}_${diagnostic?.status.toLowerCase()}`}
          values={{
            recordType,
            errorCode: error?.code,
          }}
        />
      </Text>
      {!isOk && (
        <>
          {guide && <GuideLink label={t('zimbra_domain_diagnostic_access_guide')} guide={guide} />}
          {isAutoConfigurable ? (
            <Button
              onClick={() => {
                trackClick({
                  location: PageLocation.page,
                  buttonType: ButtonType.button,
                  actionType: 'action',
                  actions: [trackingName, AUTO_CONFIGURE_DOMAIN],
                });
              }}
            >
              {t('zimbra_domain_diagnostic_cta_auto_configure')}
            </Button>
          ) : (
            <table className="dns-fields table-auto">
              <tbody>
                <tr key="type">
                  <td>
                    <Text preset={TEXT_PRESET.paragraph}>
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_type')}</strong>
                      <Text preset={TEXT_PRESET.span}>{recordType}</Text>
                    </Text>
                  </td>
                </tr>
                <tr key="subdomain">
                  <td className="w-32">
                    <Text preset={TEXT_PRESET.paragraph}>
                      <strong className="mr-4">
                        {t('zimbra_domain_diagnostic_field_subdomain')}
                      </strong>
                    </Text>
                  </td>
                  <td>
                    <Clipboard value={subdomain} className="min-w-32" />
                  </td>
                </tr>
                <tr key="priority">
                  <td className="w-32">
                    <Text preset={TEXT_PRESET.paragraph}>
                      <strong className="mr-4">
                        {t('zimbra_domain_diagnostic_field_priority')}
                      </strong>
                    </Text>
                  </td>
                  <td>
                    <Clipboard value={String(priority)} className="min-w-32" />
                  </td>
                </tr>
                <tr key="weight">
                  <td className="w-32">
                    <Text preset={TEXT_PRESET.paragraph}>
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_field_weight')}</strong>
                    </Text>
                  </td>
                  <td>
                    <Clipboard value={String(weight)} className="min-w-32" />
                  </td>
                </tr>
                <tr key="port">
                  <td className="w-32">
                    <Text preset={TEXT_PRESET.paragraph}>
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_field_port')}</strong>
                    </Text>
                  </td>
                  <td>
                    <Clipboard value={String(port)} className="min-w-32" />
                  </td>
                </tr>
                <tr key="target">
                  <td className="w-32">
                    <Text preset={TEXT_PRESET.paragraph}>
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_field_target')}</strong>
                    </Text>
                  </td>
                  <td>
                    <Clipboard value={target} className="min-w-32" />
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
