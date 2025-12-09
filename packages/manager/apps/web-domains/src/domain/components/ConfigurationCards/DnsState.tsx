import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ActionMenu,
  ManagerTile,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { getDnsStateDetails } from '@/domain/utils/dnsUtils';
import { OptionStateEnum } from '@/domain/enum/optionState.enum';
import { useGenerateUrl } from '@/domain/hooks/generateUrl/useGenerateUrl';
import { urls } from '@/domain/routes/routes.constant';
import { TDomainOption, TDomainResource } from '@/domain/types/domainResource';

interface DnsStateProps {
  readonly serviceName: string;
  readonly domainResource: TDomainResource;
  readonly anycastOption: TDomainOption;
  readonly isFetchingAnycastOption: boolean;
  readonly anycastTerminateModalOpen: boolean;
  readonly setAnycastTerminateModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  readonly restoreAnycast: boolean;
  readonly setRestoreAnycast: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function DnsState({
  serviceName,
  domainResource,
  anycastOption,
  anycastTerminateModalOpen,
  isFetchingAnycastOption,
  setAnycastTerminateModalOpen,
  restoreAnycast,
  setRestoreAnycast,
}: DnsStateProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);

  const formatDate = useFormatDate();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (anycastOption) {
      switch (anycastOption.state) {
        case OptionStateEnum.RELEASED.toLowerCase(): {
          setRestoreAnycast(true);
          break;
        }
        case OptionStateEnum.SUBSCRIBED.toLowerCase(): {
          setRestoreAnycast(false);
          break;
        }
        default:
          setRestoreAnycast(false);
          break;
      }
    }
  }, [anycastOption]);

  const dnsState = getDnsStateDetails(
    domainResource.currentState.dnsConfiguration.configurationType,
  );

  const handleAnycastLabel = () => {
    if (!anycastOption) {
      return t('domain_tab_DNS_anycast_order');
    }

    if (anycastOption && restoreAnycast) {
      return t('domain_dns_tab_button_cancel_terminate_anycast', {
        action: t(`${NAMESPACES.ACTIONS}:${'restore'}`),
      });
    }

    return t('domain_dns_tab_button_cancel_terminate_anycast', {
      action: t(`${NAMESPACES.ACTIONS}:${'terminate'}`),
    });
  };

  const handleBtnClick = () => {
    if (anycastOption) {
      setAnycastTerminateModalOpen(!anycastTerminateModalOpen);
    } else {
      navigate(
        useGenerateUrl(urls.domainTabOrderAnycast, 'path', {
          serviceName,
        }),
        { replace: true },
      );
    }
  };

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('domain_tab_general_information_dns_title')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex items-center justify-between">
          <Text preset={TEXT_PRESET.label}>{t(dnsState.label)}</Text>
          {dnsState.anycastSupported && (
            <ActionMenu
              id="anycast-service"
              isCompact
              isLoading={isFetchingAnycastOption}
              items={[
                {
                  id: 1,
                  label: handleAnycastLabel(),
                  onClick: () => handleBtnClick(),
                },
              ]}
            />
          )}
        </div>
        <Text preset={TEXT_PRESET.paragraph}>
          {restoreAnycast ? (
            <Trans
              t={t}
              i18nKey="domain_dns_tab_terminate_description_anycast"
              values={{
                expirationDate: formatDate({
                  date: anycastOption?.expirationDate,
                  format: 'P',
                }),
              }}
              components={{ strong: <strong /> }}
            />
          ) : anycastOption && !restoreAnycast ? (
            <Trans
              t={t}
              i18nKey="domain_dns_table_renew_anycast"
              values={{
                expirationDate: formatDate({
                  date: anycastOption?.expirationDate,
                  format: 'P',
                }),
              }}
              components={{ strong: <strong /> }}
            />
          ) : (
            t(dnsState.notes)
          )}
        </Text>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
}
