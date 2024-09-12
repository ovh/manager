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

export default function ModalDiagnosticSRVError() {
  const { t } = useTranslation('domains/diagnostic');
  const navigate = useNavigate();
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const [searchParams] = useSearchParams();
  const domainId = searchParams.get('domainId');

  const [domain, setDomain] = useState<DomainType>();

  const { data, isLoading } = useDomain(domainId);

  useEffect(() => {
    setDomain(data);
  }, [isLoading]);

  // TODO: fetch these informations
  // check CRB-387 for this
  const isOvhDomain = true;
  // this should be in data.currentState.expectedDNSConfig.mx
  const fields = [
    { priority: 1, target: 'mx0.mail.ovh.net' },
    { priority: 5, target: 'mx1.mail.ovh.net' },
    { priority: 10, target: 'mx2.mail.ovh.net' },
    { priority: 100, target: 'mx3.mail.ovh.net' },
  ];

  const handleValidationClick = () => {
    // TODO: send the request to fix the MX record
    onClose();
  };

  return (
    <Modal
      title={t('zimbra_domain_modal_diagnostic_mx_title')}
      color={ODS_THEME_COLOR_INTENT.info}
      onDismissible={onClose}
      dismissible={true}
      isLoading={isLoading}
      primaryButton={{
        label: isOvhDomain
          ? t('zimbra_domain_modal_diagnostic_mx_action_confirm')
          : t('zimbra_domain_modal_diagnostic_mx_action_test'),
        action: handleValidationClick,
        testid: 'diagnostic-mx-error-primary-btn',
      }}
      secondaryButton={{
        label: isOvhDomain
          ? t('zimbra_domain_modal_diagnostic_mx_action_cancel')
          : t('zimbra_domain_modal_diagnostic_mx_action_close'),
        action: onClose,
        testid: 'diagnostic-mx-error-secondary-btn',
      }}
    >
      {domain && (
        <>
          <OsdsText
            className="mt-6"
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            <Trans
              t={t}
              i18nKey={
                isOvhDomain
                  ? 'zimbra_domain_modal_diagnostic_mx_content_header_ovh_hosted_domain'
                  : 'zimbra_domain_modal_diagnostic_mx_content_header'
              }
              values={{ domain: domain?.currentState?.name }}
            />
          </OsdsText>
          <div className="flex flex-col w-full">
            {!isOvhDomain && fields && (
              <div className="flex gap-4 w-full mt-4">
                <OsdsText
                  className="flex justify-end"
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  hue={ODS_THEME_COLOR_HUE._500}
                >
                  <strong>
                    {t('zimbra_domain_modal_diagnostic_mx_fields')}
                  </strong>
                </OsdsText>
                <div className="flex flex-col">
                  {fields.map(({ priority, target }) => (
                    <OsdsText
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                      hue={ODS_THEME_COLOR_HUE._500}
                    >
                      <Trans
                        t={t}
                        i18nKey={'zimbra_domain_modal_diagnostic_mx_field'}
                        values={{
                          priority,
                          target,
                        }}
                      />
                    </OsdsText>
                  ))}
                </div>
              </div>
            )}
            {!isOvhDomain ? (
              <OsdsText
                className="mt-6"
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                <Trans
                  t={t}
                  i18nKey={'zimbra_domain_modal_diagnostic_mx_content_footer'}
                />
              </OsdsText>
            ) : null}
          </div>
        </>
      )}
    </Modal>
  );
}
