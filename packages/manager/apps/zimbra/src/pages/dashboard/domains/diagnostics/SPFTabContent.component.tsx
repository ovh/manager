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
  DomainDiagnosisTestSPFResult,
  DomainDiagnosisTestStatusEnum,
  ExpectedDNSConfig,
} from '@/data/api';
import { GUIDES_LIST, Guide } from '@/guides.constants';
import { AUTO_CONFIGURE_DOMAIN } from '@/tracking.constants';
import { DnsRecordType } from '@/utils/dnsconfig.constants';

import StatusBadge from './StatusBadge.component';

const SPFTabContent = ({
  diagnostic,
  recordType,
  expectedDNSConfig,
  trackingName,
  isAutoConfigurable,
  guide = GUIDES_LIST.dns_configuration_guide,
}: {
  diagnostic: DomainDiagnosisTestSPFResult;
  recordType: DnsRecordType;
  expectedDNSConfig: ExpectedDNSConfig;
  trackingName: string;
  isAutoConfigurable: boolean;
  guide?: Guide;
}) => {
  const { t } = useTranslation('domains/diagnostic');
  const { trackClick } = useOvhTracking();

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
              `zimbra_domain_diagnostic_information_banner_spf_${diagnostic?.status.toLowerCase()}`,
            )}
          </MessageBody>
        </Message>
      )}
      <Text preset={TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey={`zimbra_domain_diagnostic_information_message_spf_${diagnostic?.status.toLowerCase()}`}
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
                <tr key="spf">
                  <td>
                    <Text preset={TEXT_PRESET.paragraph}>
                      <strong className="mr-4">{t('zimbra_domain_diagnostic_field_value')}</strong>
                    </Text>
                    <Clipboard value={expectedDNSConfig?.spf} />
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

export default SPFTabContent;
