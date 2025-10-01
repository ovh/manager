import React, { useState } from 'react';
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
  BADGE_COLOR,
  ICON_NAME,
  BUTTON_SIZE,
  MESSAGE_COLOR,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { computeActiveConfiguration } from '@/domain/utils/dnsUtils';
import { TDomainResource } from '@/domain/types/domainResource';
import { ActiveConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { TDomainZone } from '@/domain/types/domainZone';
import config from '@/web-domains.config';
import NewDnsConfigModal from '@/domain/components/ModifyNameServer/NewDnsConfigModal';
import DnsConfigurationForm from '@/domain/components/ModifyNameServer/DnsConfigurationForm';

interface DnsConfigurationRadioProps {
  readonly domainResource: TDomainResource;
  readonly domainZone: TDomainZone;
  readonly serviceName: string;
}

export default function DnsConfigurationRadio({
  domainResource,
  domainZone,
  serviceName,
}: DnsConfigurationRadioProps) {
  const { t } = useTranslation('domain');
  const activeConfig = computeActiveConfiguration(domainResource, domainZone);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'error';
    message: string;
  } | null>(null);
  const [selectedConfiguration, setSelectedConfiguration] = useState(
    activeConfig,
  );
  const navigate = useNavigate();

  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false);
  const { data: zoneUrl } = useNavigationGetUrl([
    config.rootLabel,
    `/domain/${domainResource.id}/zone`,
    {},
  ]);

  const internalServers =
    domainZone?.nameServers?.map((ns) => ({ nameServer: ns })) ?? [];

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
                  <Icon name={ICON_NAME.arrowRight} />
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
                    ? 'text-[var(--ods-color-text-disabled-default)] ml-2'
                    : 'text-[var(--ods-color-text)] ml-2'
                }
              >
                <Badge
                  className="mr-4"
                  size={BADGE_SIZE.sm}
                  color={
                    activeConfig === ActiveConfigurationTypeEnum.INTERNAL
                      ? BADGE_COLOR.success
                      : BADGE_COLOR.information
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
            {activeConfig !== selectedConfiguration &&
              selectedConfiguration ===
                ActiveConfigurationTypeEnum.INTERNAL && (
                <div className="flex gap-4 mt-4 ml-8">
                  <Button
                    size={BUTTON_SIZE.sm}
                    onClick={() => setIsSavingModalOpen(true)}
                    data-testid="apply-internal-dns"
                  >
                    {t('domain_tab_DNS_modification_button_apply')}
                  </Button>
                  <NewDnsConfigModal
                    serviceName={serviceName}
                    nameServers={internalServers}
                    isModalOpen={isSavingModalOpen}
                    onClose={() => setIsSavingModalOpen(false)}
                    onError={(msg) => {
                      setFeedbackMessage({
                        type: 'error',
                        message: `${t(
                          'domain_tab_DNS_modification_update_error',
                        )}${msg}`,
                      });
                    }}
                    onSuccess={() =>
                      navigate(`/domain/${serviceName}/dns`, {
                        state: {
                          successMessage: t(
                            'domain_tab_DNS_modification_update_success',
                          ),
                        },
                      })
                    }
                  />
                </div>
              )}
          </div>
          <div>
            <Radio value={ActiveConfigurationTypeEnum.EXTERNAL}>
              <RadioControl />
              <RadioLabel className="text-[var(--ods-color-text)] ml-2">
                {activeConfig === ActiveConfigurationTypeEnum.EXTERNAL && (
                  <Badge
                    className="mr-4"
                    size={BADGE_SIZE.sm}
                    color={BADGE_COLOR.success}
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
            {selectedConfiguration === ActiveConfigurationTypeEnum.EXTERNAL && (
              <DnsConfigurationForm
                serviceName={serviceName}
                selectedConfig={selectedConfiguration}
                domainZone={domainZone}
                currentState={domainResource.currentState}
              />
            )}
          </div>
          {!domainZone && (
            <Message dismissible={false}>
              <MessageIcon name="circle-info" />
              <MessageBody>
                {t('domain_tab_DNS_modification_mixed_activate_dns')}
                <br />
                <Link href={zoneUrl as string}>
                  {t('domain_tab_DNS_modification_activate_dns_link')}
                  <Icon name={ICON_NAME.arrowRight} />
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
                    ? 'text-[var(--ods-color-text-disabled-default)] ml-2'
                    : 'text-[var(--ods-color-text)] ml-2'
                }
              >
                <Badge
                  className="mr-4"
                  size={BADGE_SIZE.sm}
                  color={
                    activeConfig === ActiveConfigurationTypeEnum.MIXED
                      ? BADGE_COLOR.success
                      : BADGE_COLOR.warning
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
            {selectedConfiguration === ActiveConfigurationTypeEnum.MIXED && (
              <DnsConfigurationForm
                serviceName={serviceName}
                selectedConfig={selectedConfiguration}
                domainZone={domainZone}
                currentState={domainResource.currentState}
              />
            )}
          </div>
        </div>
      </RadioGroup>
      {feedbackMessage && (
        <Message
          color={MESSAGE_COLOR.critical}
          className="mt-6 w-full"
          dismissible={false}
        >
          <MessageIcon name={ICON_NAME.circleXmark} />
          <MessageBody>{feedbackMessage.message}</MessageBody>
        </Message>
      )}
    </div>
  );
}
