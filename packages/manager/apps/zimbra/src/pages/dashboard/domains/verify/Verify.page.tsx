import React from 'react';

import { useParams } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import {
  ICON_NAME,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Clipboard, Link, LinkType } from '@ovh-ux/muk';

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
        className="flex w-full flex-col items-start gap-4 md:w-1/2"
        data-testid="validate-domain-page"
      >
        <Link
          type={LinkType.back}
          href={goBackUrl}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: [VERIFY_DOMAIN, BACK_PREVIOUS_PAGE],
            });
          }}
        >
          {t('zimbra_domains_add_domain_cta_back')}
        </Link>
        <Text preset={TEXT_PRESET.heading3} className="mb-6">
          {t('zimbra_domains_add_domain_configuration_cname_title')}
        </Text>
        {domain && cname && !isFetching && (
          <>
            <Text preset={TEXT_PRESET.paragraph}>
              <Trans
                i18nKey="zimbra_domains_add_domain_configuration_cname_description"
                t={t}
                values={{ domain: domain.currentState?.name }}
              />
            </Text>
            <Text className="dns-field mt-4" preset={TEXT_PRESET.paragraph}>
              <strong>{t('zimbra_domains_add_domain_configuration_cname_field_type')}</strong>
              {' CNAME'}
            </Text>
            <Text className="dns-field" preset={TEXT_PRESET.paragraph}>
              <strong>{t('zimbra_domains_add_domain_configuration_cname_field_subdomain')}</strong>
              <Clipboard value={`${cname}.${domain?.currentState?.name}`} />
            </Text>
            <Text className="dns-field mb-4" preset={TEXT_PRESET.paragraph}>
              <strong>{t('zimbra_domains_add_domain_configuration_cname_field_target')}</strong>
              <Clipboard value={'ovh.com'} />
            </Text>
            <Text preset={TEXT_PRESET.paragraph}>
              <Trans i18nKey="zimbra_domains_add_domain_configuration_info" t={t} />
            </Text>
            <Message dismissible={false} className="w-full" color={MESSAGE_COLOR.warning}>
              <MessageIcon name={ICON_NAME.triangleExclamation} />
              <MessageBody>
                <Text preset={TEXT_PRESET.paragraph}>
                  {t('zimbra_domains_add_domain_configuration_part_1')}{' '}
                  {t('zimbra_domains_add_domain_configuration_part_2')}
                  <span className="mt-2 block">
                    <GuideLink
                      guide={GUIDES_LIST.cname_guide}
                      label={t('zimbra_domains_add_domain_configuration_guides_referee')}
                    />
                  </span>
                </Text>
              </MessageBody>
            </Message>
          </>
        )}
        {domain && !cname && !isFetching && (
          <Text preset={TEXT_PRESET.paragraph}>
            {t('zimbra_domains_add_domain_configuration_cname_validated', {
              domain: domain.currentState?.name,
            })}
          </Text>
        )}
        {(isError || !domainId) && (
          <Message dismissible={false} className="w-full" color={MESSAGE_COLOR.critical}>
            <MessageIcon name={ICON_NAME.hexagonExclamation} />
            <MessageBody>
              <Text preset={TEXT_PRESET.paragraph}>
                {t('zimbra_domains_add_domain_configuration_cname_not_found')}
              </Text>
            </MessageBody>
          </Message>
        )}
      </div>
      {isFetching && <Loading />}
    </>
  );
};

export default VerifyDomain;
