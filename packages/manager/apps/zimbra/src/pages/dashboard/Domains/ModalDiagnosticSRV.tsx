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
  const isOvhDomain = false;
  // this should be in data.currentState.expectedDNSConfig
  const fields = {
    subdomain: '_autodiscover._tcp',
    priority: '0',
    weight: '0',
    port: '443',
    target: 'ex5.mail.ovh.net.',
  };

  const handleValidationClick = () => {
    // TODO: send the request to fix the SRV record
    onClose();
  };

  return (
    <Modal
      title={t('zimbra_domain_modal_diagnostic_srv_title')}
      color={ODS_THEME_COLOR_INTENT.info}
      onDismissible={onClose}
      dismissible={true}
      isLoading={isLoading}
      primaryButton={
        isOvhDomain
          ? {
              label: t('zimbra_domain_modal_diagnostic_srv_action_validate'),
              action: handleValidationClick,
              testid: 'diagnostic-srv-modal-primary-btn',
            }
          : null
      }
      secondaryButton={{
        label: isOvhDomain
          ? t('zimbra_domain_modal_diagnostic_srv_action_cancel')
          : t('zimbra_domain_modal_diagnostic_srv_action_close'),
        action: onClose,
        testid: 'diagnostic-srv-modal-secondary-btn',
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
                  ? 'zimbra_domain_modal_diagnostic_srv_content_header_ovh_hosted_domain'
                  : 'zimbra_domain_modal_diagnostic_srv_content_header'
              }
              components={{
                guide: (
                  <GuideLink
                    label={t('zimbra_domain_modal_diagnostic_srv_guide')}
                    guide={GUIDES_LIST.dns_configuration_guide}
                  />
                ),
              }}
            />
          </OsdsText>
          <div className="flex flex-col w-full">
            <div className="flex gap-4 w-full mt-4">
              <OsdsText
                className="w-1/3 flex justify-end"
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                <strong>
                  {t('zimbra_domain_modal_diagnostic_srv_domain')}
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
            {!isOvhDomain && fields && (
              <div className="flex gap-4 w-full mt-4">
                <OsdsText
                  className="w-1/3 flex justify-end"
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  hue={ODS_THEME_COLOR_HUE._500}
                >
                  <strong>
                    {t('zimbra_domain_modal_diagnostic_srv_fields')}
                  </strong>
                </OsdsText>
                <div className="flex flex-col w-2/3">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    hue={ODS_THEME_COLOR_HUE._500}
                  >
                    <Trans
                      t={t}
                      i18nKey={
                        'zimbra_domain_modal_diagnostic_srv_field_subdomain'
                      }
                      values={{ subdomain: fields.subdomain }}
                    />
                  </OsdsText>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    hue={ODS_THEME_COLOR_HUE._500}
                  >
                    <Trans
                      t={t}
                      i18nKey={
                        'zimbra_domain_modal_diagnostic_srv_field_priority'
                      }
                      values={{ priority: fields.priority }}
                    />
                  </OsdsText>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    hue={ODS_THEME_COLOR_HUE._500}
                  >
                    <Trans
                      t={t}
                      i18nKey={
                        'zimbra_domain_modal_diagnostic_srv_field_weight'
                      }
                      values={{ weight: fields.weight }}
                    />
                  </OsdsText>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    hue={ODS_THEME_COLOR_HUE._500}
                  >
                    <Trans
                      t={t}
                      i18nKey={'zimbra_domain_modal_diagnostic_srv_field_port'}
                      values={{ port: fields.port }}
                    />
                  </OsdsText>
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    hue={ODS_THEME_COLOR_HUE._500}
                  >
                    <Trans
                      t={t}
                      i18nKey={
                        'zimbra_domain_modal_diagnostic_srv_field_target'
                      }
                      values={{ target: fields.target }}
                    />
                  </OsdsText>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
