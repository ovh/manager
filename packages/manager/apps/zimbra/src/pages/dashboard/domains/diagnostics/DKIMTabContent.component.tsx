import { Fragment, useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
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

import { ApiError } from '@ovh-ux/manager-core-api';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Clipboard, useNotifications } from '@ovh-ux/muk';

import { GuideLink } from '@/components';
import {
  DomainDiagnosisTestDKIMError,
  DomainDiagnosisTestDKIMErrorCodeEnum,
  DomainDiagnosisTestDKIMResult,
  DomainDiagnosisTestStatusEnum,
  ExpectedDNSConfig,
  getZimbraPlatformDomainsDiagnosticQueryKey,
  putZimbraDomain,
} from '@/data/api';
import { GUIDES_LIST, Guide } from '@/guides.constants';
import queryClient from '@/queryClient';
import { AUTO_CONFIGURE_DOMAIN, DOMAIN_DIAGNOSTICS_DKIM } from '@/tracking.constants';
import { DnsRecordType } from '@/utils/dnsconfig.constants';

import StatusBadge from './StatusBadge.component';

const DKIMTabContent = ({
  diagnostic,
  recordType,
  expectedDNSConfig,
  trackingName,
  isAutoConfigurable,
  guide = GUIDES_LIST.dns_configuration_guide,
}: {
  diagnostic: DomainDiagnosisTestDKIMResult;
  recordType: DnsRecordType;
  expectedDNSConfig: ExpectedDNSConfig;
  trackingName: string;
  isAutoConfigurable: boolean;
  guide?: Guide;
}) => {
  const { t } = useTranslation('domains/diagnostic');
  const { platformId, domainId } = useParams();
  const { trackClick } = useOvhTracking();
  const { addError, addSuccess } = useNotifications();

  const [isDkimDisabled, diagnosticStatus] = useMemo<
    [boolean, DomainDiagnosisTestStatusEnum]
  >(() => {
    const dkimDisabled =
      diagnostic?.errors?.length === 1 &&
      diagnostic?.errors?.some(
        (err: DomainDiagnosisTestDKIMError) =>
          err.code === DomainDiagnosisTestDKIMErrorCodeEnum.DKIM_DISABLED,
      );
    const status = dkimDisabled ? DomainDiagnosisTestStatusEnum.DISABLED : diagnostic?.status;
    return [dkimDisabled, status];
  }, [diagnostic]);

  const { mutate: enableOrDisableDkim, isPending: isSending } = useMutation({
    mutationFn: (dkimEnabled: boolean) =>
      putZimbraDomain(platformId, domainId, {
        dkimEnabled,
      }),
    onSuccess: () => {
      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: [DOMAIN_DIAGNOSTICS_DKIM],
      });
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>
          {isDkimDisabled
            ? t('zimbra_domain_diagnostic_banner_enable_success_message')
            : t('zimbra_domain_diagnostic_banner_disable_success_message')}
        </Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('common:edit_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: getZimbraPlatformDomainsDiagnosticQueryKey(platformId, [domainId]),
        });
      }, 3000);
    },
  });

  const isOk = useMemo(
    () => (diagnostic && diagnostic.status === DomainDiagnosisTestStatusEnum.OK) || isDkimDisabled,
    [diagnostic, isDkimDisabled],
  );

  if (!diagnostic) {
    return (
      <Message className="md:w-1/2" dismissible={false} color={MESSAGE_COLOR.critical}>
        <MessageIcon name={ICON_NAME.hexagonExclamation} />
        <MessageBody>{t('zimbra_domain_diagnostic_loading_error')}</MessageBody>
      </Message>
    );
  }

  const [error] = diagnostic.errors;

  return (
    <div className="flex flex-col gap-4 md:w-1/2" data-testid={`tab-content-${recordType}`}>
      <Text preset={TEXT_PRESET.paragraph}>
        <strong>{t('zimbra_domain_diagnostic_status')}</strong>
        <StatusBadge className="ml-4" status={diagnosticStatus} />
      </Text>
      {!isOk && (
        <Message className="w-full" dismissible={false} color={MESSAGE_COLOR.warning}>
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          <MessageBody>
            {t(
              `zimbra_domain_diagnostic_information_banner_dkim_${diagnostic?.status.toLowerCase()}`,
            )}
          </MessageBody>
        </Message>
      )}
      <Text preset={TEXT_PRESET.paragraph}>
        <Trans
          t={t}
          i18nKey={`zimbra_domain_diagnostic_information_message_dkim_${diagnosticStatus?.toLowerCase()}`}
          values={{
            recordType,
            errorCode: error?.code,
          }}
        />
      </Text>
      {isOk ? (
        <Button
          data-test-id="dkim_enable_disable"
          className="mt-4"
          onClick={() => enableOrDisableDkim(isDkimDisabled)}
          loading={isSending}
        >
          {isDkimDisabled
            ? t('zimbra_domain_diagnostic_dkim_enable')
            : t('zimbra_domain_diagnostic_dkim_disable')}
        </Button>
      ) : (
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
                      <Text preset={TEXT_PRESET.span}>{'CNAME'}</Text>
                    </Text>
                  </td>
                </tr>
                {expectedDNSConfig?.dkim?.cnames?.map((cname, index) => (
                  <Fragment key={cname?.name}>
                    <tr key={`CNAME ${index + 1}`}>
                      <td className="w-36">
                        <Text preset={TEXT_PRESET.heading5}>{`CNAME ${index + 1}`}</Text>
                      </td>
                    </tr>
                    <tr key={cname?.name}>
                      <td>
                        <Text preset={TEXT_PRESET.paragraph}>
                          <strong className="mr-4">
                            {t('zimbra_domain_diagnostic_field_subdomain')}
                          </strong>
                        </Text>
                      </td>
                      <td>
                        <Clipboard value={cname?.name} className="w-full" />
                      </td>
                    </tr>
                    <tr key={cname?.value}>
                      <td>
                        <Text preset={TEXT_PRESET.paragraph}>
                          <strong className="mr-4">
                            {t('zimbra_domain_diagnostic_field_value')}
                          </strong>
                        </Text>
                      </td>
                      <td>
                        <Clipboard value={cname?.value} className="w-full" />
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default DKIMTabContent;
