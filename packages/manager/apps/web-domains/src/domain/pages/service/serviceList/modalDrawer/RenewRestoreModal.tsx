import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOpenChangeDetail,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { RENEW_URL } from '@/common/constants';

interface RenewRestoreModalProps {
  readonly isModalOpenned: boolean;
  readonly onOpenChange: ({ open }: ModalOpenChangeDetail) => void;
  readonly serviceNames: string[];
}

export default function RenewRestoreModal({
  serviceNames,
  onOpenChange,
  isModalOpenned,
}: RenewRestoreModalProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const maxDomainsWithoutWarning = 20;
  const {
    environment: { user },
  } = useContext(ShellContext);

  const renewUrl = `${RENEW_URL[user.ovhSubsidiary] ||
    RENEW_URL.default}${serviceNames.join(',')}`;
  return (
    <Modal open={isModalOpenned} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '16px',
          }}
        >
          <Text preset={TEXT_PRESET.heading4}>
            {t('domain_table_modal_renew_restore_title', {
              count: serviceNames?.length,
            })}
          </Text>
          <Text>{t('domain_table_modal_renew_restore_description')}</Text>
          <Text>
            <Trans
              i18nKey="domain_table_modal_renew_restore_order"
              t={t}
              components={{
                strong: <strong />,
              }}
            />
          </Text>
          <Message
            dismissible={false}
            className="my-2 w-full"
            color={MESSAGE_COLOR.information}
          >
            <MessageIcon name="circle-check" />
            <MessageBody>
              {t('domain_table_modal_renew_restore_message_info')}
            </MessageBody>
          </Message>
          {serviceNames.length > maxDomainsWithoutWarning && (
            <Message
              color={MESSAGE_COLOR.warning}
              className="w-full"
              dismissible={false}
            >
              <MessageIcon name="circle-info" />
              <MessageBody>
                {t('domain_table_modal_renew_restore_message_limit_warning')}
              </MessageBody>
            </Message>
          )}
          <div
            style={{
              alignSelf: 'flex-end',
              columnGap: '8px',
              display: 'flex',
            }}
          >
            <Button
              variant="outline"
              onClick={() => onOpenChange({ open: false })}
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button onClick={() => window.open(renewUrl, '_blank')}>
              {t('domain_table_modal_renew_restore_button', {
                count: serviceNames?.length,
              })}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
