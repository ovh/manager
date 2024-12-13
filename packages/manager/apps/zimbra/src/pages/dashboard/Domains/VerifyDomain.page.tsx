/* eslint-disable prettier/prettier */
import React from 'react';
import {
  LinkType,
  Links,
  Subtitle,
  Clipboard,
  IconLinkAlignmentType,
} from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { OdsText, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_PRESET,
  ODS_MESSAGE_COLOR,
  ODS_LINK_COLOR,
} from '@ovhcloud/ods-components';
import { useGenerateUrl, useDomain } from '@/hooks';
import { GUIDES_LIST } from '@/guides.constants';
import GuideLink from '@/components/GuideLink';
import Loading from '@/components/Loading/Loading';

export enum DomainOwnership {
  OVH = 'ovhDomain',
  EXTERNAL = 'externalDomain',
}

export default function ValidateOwnership() {
  const { t } = useTranslation('domains/addDomain');

  const [searchParams] = useSearchParams();
  const domainId = searchParams.get('domainId');
  const { data: domain, isFetching, isError } = useDomain(domainId);

  const cname = domain?.currentState?.expectedDNSConfig?.ownership?.cname;
  const goBackUrl = useGenerateUrl('..', 'href');

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
            <OdsText
              className="dns-field mt-4"
              preset={ODS_TEXT_PRESET.paragraph}
            >
              <strong>
                {t('zimbra_domains_add_domain_configuration_cname_field_type')}
              </strong>
              {' CNAME'}
            </OdsText>
            <OdsText className="dns-field" preset={ODS_TEXT_PRESET.paragraph}>
              <strong>
                {t(
                  'zimbra_domains_add_domain_configuration_cname_field_subdomain',
                )}
              </strong>
              <Clipboard value={`${cname}.${domain?.currentState?.name}`} />
            </OdsText>
            <OdsText
              className="dns-field mb-4"
              preset={ODS_TEXT_PRESET.paragraph}
            >
              <strong>
                {t(
                  'zimbra_domains_add_domain_configuration_cname_field_target',
                )}
              </strong>
              <Clipboard value={'ovh.com'} />
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              <Trans
                i18nKey="zimbra_domains_add_domain_configuration_info"
                t={t}
              />
            </OdsText>
            <OdsMessage
              isDismissible={false}
              className="w-full"
              color={ODS_MESSAGE_COLOR.warning}
            >
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_domains_add_domain_configuration_part_1')}{' '}
                {t('zimbra_domains_add_domain_configuration_part_2')}
                <span className="block mt-2">
                  <GuideLink
                    guide={GUIDES_LIST.cname_guide}
                    label={t(
                      'zimbra_domains_add_domain_configuration_guides_referee',
                    )}
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
          <OdsMessage
            isDismissible={false}
            className="w-full"
            color={ODS_MESSAGE_COLOR.critical}
          >
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_domains_add_domain_configuration_cname_not_found')}
            </OdsText>
          </OdsMessage>
        )}
      </div>
      {isFetching && <Loading />}
    </>
  );
}
