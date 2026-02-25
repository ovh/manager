import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@ovhcloud/ods-react';
import { useNavigate } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useGetDomainAnycastOption } from '@/domain/hooks/data/query';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { urls } from '@/domain/routes/routes.constant';
import { OptionStateEnum } from '@/domain/enum/optionState.enum';
import AnycastTerminateModal from '@/domain/components/AnycastOrder/AnycastTerminateModal';
import { AnycastPreviousPages } from '@/domain/enum/navigation.enum';

interface AnycastOrderButtonComponentProps {
  readonly serviceName: string;
  readonly anycastTerminateModalOpen: boolean;
  readonly goBack?: AnycastPreviousPages;
  readonly onOpenAnycastTerminateModal: () => void;
}

export default function AnycastOrderButtonComponent({
  serviceName,
  anycastTerminateModalOpen,
  onOpenAnycastTerminateModal,
  goBack,
}: AnycastOrderButtonComponentProps) {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);

  const [restoreAnycast, setRestoreAnycast] = useState<boolean>(false);

  const navigate = useNavigate();
  const { anycastOption, isFetchingAnycastOption } = useGetDomainAnycastOption(
    serviceName,
  );

  useEffect(() => {
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

  if (isFetchingAnycastOption) {
    return <Button data-testid={'anycast-loading-button'} loading={true} />;
  }

  return (
    <>
      {!anycastOption && (
        <Button
          name="anycast-order-button"
          data-testid={'anycast-order-button'}
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.outline}
          onClick={() =>
            navigate(
              useGenerateUrl(urls.domainTabOrderAnycast, 'path', {
                serviceName,
              }),
              {
                replace: true,
                state: {
                  from: goBack ?? AnycastPreviousPages.GENERAL_INFORMATION,
                },
              },
            )
          }
        >
          {t('domain_tab_DNS_anycast_order')}
        </Button>
      )}
      {anycastOption && restoreAnycast && (
        <Button
          name="anycast-cancel-anycast-button"
          data-testid={'anycast-cancel-anycast-button'}
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.outline}
          onClick={() => onOpenAnycastTerminateModal()}
        >
          {t('domain_dns_tab_button_cancel_terminate_anycast', {
            action: tCommon(`${NAMESPACES.ACTIONS}:${'restore'}`),
          })}
        </Button>
      )}
      {!restoreAnycast && anycastOption && (
        <Button
          name="anycast-terminate-button"
          data-testid={'anycast-terminate-button'}
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.outline}
          color={BUTTON_COLOR.critical}
          onClick={() => onOpenAnycastTerminateModal()}
        >
          {t('domain_dns_tab_button_cancel_terminate_anycast', {
            action: tCommon(`${NAMESPACES.ACTIONS}:${'terminate'}`),
          })}
        </Button>
      )}
      <AnycastTerminateModal
        serviceName={serviceName}
        restore={restoreAnycast}
        anycastTerminateModalOpen={anycastTerminateModalOpen}
        expirationDate={anycastOption?.expirationDate}
        onOpenAnycastTerminateModal={onOpenAnycastTerminateModal}
      />
    </>
  );
}
