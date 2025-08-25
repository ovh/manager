import React from 'react';

import { useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { ODS_LINK_COLOR, ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import {
  Clipboard,
  IconLinkAlignmentType,
  LinkType,
  Links,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { GuideLink, Loading } from '@/components';
import { useDomain } from '@/data/hooks';
import { GUIDES_LIST } from '@/guides.constants';
import { useGenerateUrl } from '@/hooks';
import { BACK_PREVIOUS_PAGE, VERIFY_DOMAIN } from '@/tracking.constants';

export enum DomainOwnership {
  OVH = 'ovhDomain',
  EXTERNAL = 'externalDomain',
}

export const VerifyDomain = () => {
  const { t } = useTranslation('domains/form');
  const { trackClick } = useOvhTracking();
  const { domainId } = useParams();
  const {
    data: domain,
    isFetching,
    isError,
  } = useDomain({
    domainId,
    gcTime: 0,
  });

  const cname = domain?.currentState?.expectedDNSConfig?.ownership?.cname;
  const goBackUrl = useGenerateUrl('../..', 'href');

  return (
    <>
      <div
        className="flex flex-col items-start w-full md:w-1/2 gap-4"
        data-testid="validate-domain-page"
      >
        <Links
          iconAlignment={IconLinkAlignmentType.left}
          type={LinkType.back}
          href={goBackUrl}
          onClickReturn={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: [VERIFY_DOMAIN, BACK_PREVIOUS_PAGE],
            });
          }}
          color={ODS_LINK_COLOR.primary}
          label={t('zimbra_domains_add_domain_cta_back')}
        />
        <Subtitle className="mb-6">
          {t('zimbra_domains_add_domain_configuration_cname_title')}
        </Subtitle>
        {domain && cname && !isFetching && (
          <>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <Trans
                i18nKey="zimbra_domains_add_domain_configuration_cname_description"
                t={t}
                values={{ domain: domain.currentState?.name }}
              />
            </OdsText>
            <OdsText className="dns-field mt-4" preset={ODS_TEXT_PRESET.paragraph}>
              <strong>{t('zimbra_domains_add_domain_configuration_cname_field_type')}</strong>
              {' CNAME'}
            </OdsText>
            <OdsText className="dns-field" preset={ODS_TEXT_PRESET.paragraph}>
              <strong>{t('zimbra_domains_add_domain_configuration_cname_field_subdomain')}</strong>
              <Clipboard value={`${cname}.${domain?.currentState?.name}`} />
            </OdsText>
            <OdsText className="dns-field mb-4" preset={ODS_TEXT_PRESET.paragraph}>
              <strong>{t('zimbra_domains_add_domain_configuration_cname_field_target')}</strong>
              <Clipboard value={'ovh.com'} />
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <Trans i18nKey="zimbra_domains_add_domain_configuration_info" t={t} />
            </OdsText>
            <OdsMessage isDismissible={false} className="w-full" color={ODS_MESSAGE_COLOR.warning}>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_domains_add_domain_configuration_part_1')}{' '}
                {t('zimbra_domains_add_domain_configuration_part_2')}
                <span className="block mt-2">
                  <GuideLink
                    guide={GUIDES_LIST.cname_guide}
                    label={t('zimbra_domains_add_domain_configuration_guides_referee')}
                  />
                </span>
              </OdsText>
            </OdsMessage>
          </>
        )}
        {domain && !cname && !isFetching && (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_domains_add_domain_configuration_cname_validated', {
              domain: domain.currentState?.name,
            })}
          </OdsText>
        )}
        {(isError || !domainId) && (
          <OdsMessage isDismissible={false} className="w-full" color={ODS_MESSAGE_COLOR.critical}>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_domains_add_domain_configuration_cname_not_found')}
            </OdsText>
          </OdsMessage>
        )}
      </div>
      {isFetching && <Loading />}
    </>
  );
};

export default VerifyDomain;
