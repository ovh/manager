import {
  ODS_BADGE_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  RadioGroup,
  Radio,
  RadioControl,
  RadioLabel,
  Badge,
  BADGE_SIZE,
  Button,
  Message,
  MessageIcon,
  MessageBody,
  Link,
  Icon,
} from '@ovhcloud/ods-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { computeActiveConfiguration } from '@/domain/utils/dnsUtils';
import { TDomainResource } from '@/domain/types/domainResource';
import { ActiveConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { TDomainZone } from '@/domain/types/domainZone';
import config from '@/web-domains.config';

interface DnsConfigurationRadioProps {
  readonly domainResource: TDomainResource;
  readonly domainZone: TDomainZone;
}

export default function DnsConfigurationRadio({
  domainResource,
  domainZone,
}: DnsConfigurationRadioProps) {
  const { t } = useTranslation('domain');
  const activeConfig = computeActiveConfiguration(domainResource, domainZone);
  const [selectedConfiguration, setSelectedConfiguration] = useState(
    activeConfig,
  );
  const { data: zoneUrl } = useNavigationGetUrl([
    config.rootLabel,
    `/domain/${domainResource.id}/zone`,
    {},
  ]);

  return (
    <div>
      <RadioGroup
        defaultValue={selectedConfiguration}
        onValueChange={(detail) =>
          setSelectedConfiguration(detail.value as ActiveConfigurationTypeEnum)
        }
      >
        <div className="flex flex-col gap-y-6">
          {!domainZone && (
            <Message dismissible={false}>
              <MessageIcon name="circle-info" />
              <MessageBody>
                {t('domain_tab_DNS_modification_default_activate_dns')}
                <br />
                <Link href={zoneUrl as string}>
                  {t('domain_tab_DNS_modification_activate_dns_link')}
                  <Icon name={ODS_ICON_NAME.arrowRight} />
                </Link>
              </MessageBody>
            </Message>
          )}
          <div>
            <Radio
              value={ActiveConfigurationTypeEnum.INTERNAL}
              disabled={!domainZone}
            >
              <RadioControl />
              <RadioLabel
                className={
                  !domainZone
                    ? 'text-[var(--ods-color-text-disabled-default)]'
                    : 'text-[var(--ods-color-text)]'
                }
              >
                <Badge
                  className="mr-4"
                  size={BADGE_SIZE.sm}
                  color={
                    activeConfig === ActiveConfigurationTypeEnum.INTERNAL
                      ? ODS_BADGE_COLOR.success
                      : ODS_BADGE_COLOR.information
                  }
                >
                  {activeConfig === ActiveConfigurationTypeEnum.INTERNAL
                    ? t('domain_tab_DNS_modification_badge_active')
                    : t('domain_tab_DNS_modification_badge_recommended')}
                </Badge>
                {t('domain_tab_DNS_modification_option_default')}
              </RadioLabel>
            </Radio>
            {/* Text component can't be in a radio group component */}
            <p
              className={
                !domainZone
                  ? 'text-[var(--ods-color-text-disabled-default)] text-xs ml-8 my-0 mt-1'
                  : 'text-[var(--ods-color-text)] text-xs ml-8 my-0 mt-1'
              }
            >
              {t('domain_tab_DNS_modification_option_default_description')}
            </p>
          </div>
          <div>
            <Radio value={ActiveConfigurationTypeEnum.EXTERNAL}>
              <RadioControl />
              <RadioLabel className="text-[var(--ods-color-text)]">
                {activeConfig === ActiveConfigurationTypeEnum.EXTERNAL && (
                  <Badge
                    className="mr-4"
                    size={BADGE_SIZE.sm}
                    color={ODS_BADGE_COLOR.success}
                  >
                    {t('domain_tab_DNS_modification_badge_active')}
                  </Badge>
                )}
                {t('domain_tab_DNS_modification_option_external')}
              </RadioLabel>
            </Radio>
            <p className="text-[var(--ods-color-text)] text-xs ml-8 my-0 mt-1">
              {t('domain_tab_DNS_modification_option_external_description')}
            </p>
          </div>
          {!domainZone && (
            <Message dismissible={false}>
              <MessageIcon name="circle-info" />
              <MessageBody>
                {t('domain_tab_DNS_modification_mixed_activate_dns')}
                <br />
                <Link href={zoneUrl as string}>
                  {t('domain_tab_DNS_modification_activate_dns_link')}
                  <Icon name={ODS_ICON_NAME.arrowRight} />
                </Link>
              </MessageBody>
            </Message>
          )}
          <div>
            <Radio
              value={ActiveConfigurationTypeEnum.MIXED}
              disabled={!domainZone}
            >
              <RadioControl />
              <RadioLabel
                className={
                  !domainZone
                    ? 'text-[var(--ods-color-text-disabled-default)]'
                    : 'text-[var(--ods-color-text)]'
                }
              >
                <Badge
                  className="mr-4"
                  size={BADGE_SIZE.sm}
                  color={
                    activeConfig === ActiveConfigurationTypeEnum.MIXED
                      ? ODS_BADGE_COLOR.success
                      : ODS_BADGE_COLOR.warning
                  }
                >
                  {activeConfig === ActiveConfigurationTypeEnum.MIXED
                    ? t('domain_tab_DNS_modification_badge_active')
                    : t('domain_tab_DNS_modification_badge_advanced')}
                </Badge>
                {t('domain_tab_DNS_modification_option_mixed')}
              </RadioLabel>
            </Radio>
            <p
              className={
                !domainZone
                  ? 'text-[var(--ods-color-text-disabled-default)] text-xs ml-8 my-0 mt-1'
                  : 'text-[var(--ods-color-text)] text-xs ml-8 my-0 mt-1'
              }
            >
              {t('domain_tab_DNS_modification_option_mixed_description')}
            </p>
          </div>
        </div>
      </RadioGroup>
      <div className="flex gap-4 mt-8">
        <Button variant={ODS_BUTTON_VARIANT.ghost}>
          {t('domain_tab_DNS_modification_button_cancel')}
        </Button>
        <Button disabled={activeConfig === selectedConfiguration}>
          {t('domain_tab_DNS_modification_button_apply')}
        </Button>
      </div>
    </div>
  );
}
