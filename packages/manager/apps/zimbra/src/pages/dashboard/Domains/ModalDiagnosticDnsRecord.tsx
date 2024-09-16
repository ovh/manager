import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useGenerateUrl, useDomain } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import { DomainType } from '@/api/domain';
import { GUIDES_LIST } from '@/guides.constants';
import GuideLink from '@/components/GuideLink';
import {
  DnsRecordType,
  DnsRecordTypeKey,
  getDnsRecordTypeKeyFromDnsRecordType,
} from '@/utils';

type ModalDiagnosticDnsRecordProps = {
  domainId?: string;
  dnsRecordType?: DnsRecordType;
  isOvhDomain?: boolean;
};

const getContentHeaderKeys = (
  dnsRecordTypeKey: DnsRecordTypeKey,
  isOvhDomain: boolean,
): string[] => {
  switch (dnsRecordTypeKey) {
    case DnsRecordTypeKey.MX:
      return isOvhDomain
        ? [
            'zimbra_domain_modal_diagnostic_mx_content_header_ovh_hosted_domain_part1',
            'zimbra_domain_modal_diagnostic_mx_content_header_ovh_hosted_domain_part2',
            'zimbra_domain_modal_diagnostic_mx_content_header_ovh_hosted_domain_part3',
          ]
        : [
            'zimbra_domain_modal_diagnostic_mx_content_header_part1',
            'zimbra_domain_modal_diagnostic_mx_content_header_part2',
            'zimbra_domain_modal_diagnostic_mx_content_header_part3',
          ];
    case DnsRecordTypeKey.SRV:
      return isOvhDomain
        ? [
            'zimbra_domain_modal_diagnostic_srv_content_header_ovh_hosted_domain_part1',
            'zimbra_domain_modal_diagnostic_srv_content_header_ovh_hosted_domain_part2',
          ]
        : ['zimbra_domain_modal_diagnostic_srv_content_header'];

    case DnsRecordTypeKey.SPF:
      return isOvhDomain
        ? [
            'zimbra_domain_modal_diagnostic_spf_content_header_ovh_hosted_domain_part1',
            'zimbra_domain_modal_diagnostic_spf_content_header_ovh_hosted_domain_part2',
            'zimbra_domain_modal_diagnostic_spf_content_header_ovh_hosted_domain_part3',
          ]
        : ['zimbra_domain_modal_diagnostic_spf_content_header'];
    default:
      return [];
  }
};

export default function ModalDiagnosticDnsRecord(
  props: Readonly<ModalDiagnosticDnsRecordProps>,
) {
  const { t } = useTranslation('domains/diagnostic');
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const [searchParams] = useSearchParams();
  const domainId = searchParams.get('domainId') || props.domainId;

  // fetch these informations
  // check CRB-387 for this
  const isOvhDomain =
    searchParams.get('isOvhDomain') === 'true' || props.isOvhDomain;
  const dnsRecordType =
    searchParams.get('dnsRecordType') || props.dnsRecordType;
  const dnsRecordTypeKey = getDnsRecordTypeKeyFromDnsRecordType(
    dnsRecordType as DnsRecordType,
  );

  const [domain, setDomain] = useState<DomainType>();
  const { data, isLoading } = useDomain(domainId);

  useEffect(() => {
    setDomain(data);
  }, [isLoading]);

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

  const handleValidationClick = () => {
    // send the request to fix the record
    onClose();
  };

  if (dnsRecordTypeKey === DnsRecordTypeKey.NONE) {
    onClose();
  }

  const getPrimaryButtonProps = () => {
    const buttonProps = {
      label: t(
        `zimbra_domain_modal_diagnostic_${dnsRecordTypeKey}_action_validate`,
      ),
      action: handleValidationClick,
      testid: `diagnostic-${dnsRecordTypeKey}-modal-primary-btn`,
    };

    if (isOvhDomain) {
      return buttonProps;
    }

    if (dnsRecordType === DnsRecordType.MX) {
      return {
        ...buttonProps,
        label: t(`zimbra_domain_modal_diagnostic_mx_action_test`),
      };
    }

    return null;
  };

  return (
    <Modal
      title={t(`zimbra_domain_modal_diagnostic_${dnsRecordTypeKey}_title`)}
      color={ODS_THEME_COLOR_INTENT.info}
      onDismissible={onClose}
      dismissible={true}
      isLoading={isLoading}
      primaryButton={getPrimaryButtonProps()}
      secondaryButton={{
        label: isOvhDomain
          ? t(
              `zimbra_domain_modal_diagnostic_${dnsRecordTypeKey}_action_cancel`,
            )
          : t(
              `zimbra_domain_modal_diagnostic_${dnsRecordTypeKey}_action_close`,
            ),
        action: onClose,
        testid: `diagnostic-${dnsRecordTypeKey}-modal-secondary-btn`,
      }}
    >
      {domain && (
        <div className="flex flex-col w-full whitespace-pre mt-6">
          {getContentHeaderKeys(dnsRecordTypeKey, isOvhDomain).map((key) => (
            <OsdsText
              className="mt-2"
              key={key}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              <Trans
                t={t}
                i18nKey={key}
                values={{ domain: domain?.currentState?.name }}
                components={{
                  guide: (
                    <GuideLink
                      label={t(`zimbra_domain_modal_diagnostic_guide`)}
                      guide={GUIDES_LIST.dns_configuration_guide}
                    />
                  ),
                }}
              />
            </OsdsText>
          ))}
          {dnsRecordType === DnsRecordType.SRV && (
            <div className="flex gap-4 w-full mt-4">
              <OsdsText
                className="w-1/3 flex justify-end"
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                <strong>
                  {t(
                    `zimbra_domain_modal_diagnostic_${dnsRecordTypeKey}_domain`,
                  )}
                </strong>
              </OsdsText>
              <OsdsText
                className="w-2/3"
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                {domain?.currentState?.name}
              </OsdsText>
            </div>
          )}
          {!isOvhDomain && (
            <div className="flex gap-4 w-full mt-4">
              <OsdsText
                className="w-1/3 flex justify-end"
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                <strong>
                  {t(`zimbra_domain_modal_diagnostic_fields`)} {dnsRecordType}
                </strong>
              </OsdsText>
              <div className="flex flex-col w-2/3">
                {mxFields && dnsRecordType === DnsRecordType.MX && (
                  <div className="flex flex-col">
                    {mxFields.map(({ priority, target }) => (
                      <OsdsText
                        key={`${priority}-${target}`}
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                        hue={ODS_THEME_COLOR_HUE._500}
                      >
                        {t(`zimbra_domain_modal_diagnostic_field_priority`)}
                        <strong> {priority}</strong>
                        {' ; '}
                        {t(`zimbra_domain_modal_diagnostic_field_target`)}
                        <strong> {target}</strong>
                      </OsdsText>
                    ))}
                  </div>
                )}
                {(dnsRecordType === DnsRecordType.SRV ||
                  dnsRecordType === DnsRecordType.SPF) && (
                  <div className="flex flex-col">
                    {Object.entries(
                      dnsRecordType === DnsRecordType.SRV
                        ? srvFields
                        : spfFields,
                    ).map(([key, value]) => (
                      <OsdsText
                        key={key}
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                        hue={ODS_THEME_COLOR_HUE._500}
                      >
                        {t(`zimbra_domain_modal_diagnostic_field_${key}`)}
                        <strong> {value}</strong>
                      </OsdsText>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {!isOvhDomain && dnsRecordType === DnsRecordType.MX ? (
            <OsdsText
              className="mt-6"
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
            >
              <Trans
                t={t}
                i18nKey={`zimbra_domain_modal_diagnostic_${dnsRecordTypeKey}_content_footer`}
              />
            </OsdsText>
          ) : null}
        </div>
      )}
    </Modal>
  );
}
