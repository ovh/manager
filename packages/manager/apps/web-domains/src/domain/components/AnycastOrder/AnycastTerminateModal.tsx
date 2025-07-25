import { MODAL_COLOR, Text } from '@ovhcloud/ods-react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Modal, useFormatDate } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTerminateAnycastMutation } from '@/domain/hooks/data/query';

interface AnycastTerminateModalProps {
  readonly serviceName: string;
  readonly anycastTerminateModalOpen: boolean;
  readonly onOpenAnycastTerminateModal: () => void;
  readonly expirationDate: string;
  readonly restore: boolean;
}

export default function AnycastTerminateModal({
  anycastTerminateModalOpen,
  onOpenAnycastTerminateModal,
  serviceName,
  restore,
  expirationDate,
}: AnycastTerminateModalProps) {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { t: tCommon } = useTranslation(NAMESPACES.ACTIONS);
  const formatDate = useFormatDate();

  const {
    terminateAnycast,
    isTerminateAnycastPending,
  } = useTerminateAnycastMutation(serviceName, restore);

  return (
    <Modal
      heading={t('domain_dns_tab_button_cancel_terminate_anycast', {
        action: tCommon(
          `${NAMESPACES.ACTIONS}:${restore ? 'restore' : 'terminate'}`,
        ),
      })}
      type={restore ? MODAL_COLOR.information : MODAL_COLOR.critical}
      primaryLabel={tCommon(
        `${NAMESPACES.ACTIONS}:${restore ? 'restore' : 'terminate'}`,
      )}
      onPrimaryButtonClick={() => {
        terminateAnycast();
        onOpenAnycastTerminateModal();
      }}
      isPrimaryButtonLoading={isTerminateAnycastPending}
      secondaryLabel={tCommon(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => onOpenAnycastTerminateModal()}
      isOpen={anycastTerminateModalOpen}
    >
      {restore ? (
        <Text>
          <Trans
            t={t}
            i18nKey="domain_dns_tab_restore_anycast_description"
            values={{
              expirationDate: formatDate({ date: expirationDate, format: 'P' }),
            }}
            components={{ strong: <strong /> }}
          />
        </Text>
      ) : (
        <div>
          <Text>
            <Trans
              t={t}
              i18nKey="domain_dns_tab_terminate_description_anycast"
              values={{
                expirationDate: formatDate({
                  date: expirationDate,
                  format: 'P',
                }),
              }}
              components={{ strong: <strong /> }}
            />
          </Text>
          <Text>
            {t('domain_dns_tab_terminate_description_suite_anycast', {
              action: tCommon(
                `${NAMESPACES.ACTIONS}:terminate`,
              ).toLocaleLowerCase(),
            })}
          </Text>
        </div>
      )}
    </Modal>
  );
}
