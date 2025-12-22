import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import {
  ICON_NAME,
  MESSAGE_COLOR,
  MODAL_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError } from '@ovh-ux/manager-core-api';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

import { CANCEL, CONFIRM, DELETE_ACCOUNT } from '@/Tracking.constants';
import { postOfficePrepaidLicenseUnconfigure } from '@/data/api/license/api';
import { getOfficeLicenseQueryKey } from '@/data/api/license/key';
import { deleteOfficeUser } from '@/data/api/users/api';
import { getOfficeUsersQueryKey } from '@/data/api/users/key';
import { useGenerateUrl } from '@/hooks/generate-url/useGenerateUrl';
import queryClient from '@/queryClient';

export default function ModalDeleteUsers() {
  const { t } = useTranslation(['dashboard/users/delete', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const { serviceName: selectedServiceName } = useParams();
  const [searchParams] = useSearchParams();
  const activationEmail = searchParams.get('activationEmail');
  const licencePrepaidName = searchParams.get('licencePrepaidName');

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const tracking = (action: string) =>
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_ACCOUNT, action],
    });

  const handleCancelClick = () => {
    tracking(CANCEL);
    onClose();
  };

  const { mutate: deleteUsers, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      tracking(CONFIRM);
      return licencePrepaidName
        ? postOfficePrepaidLicenseUnconfigure(selectedServiceName, licencePrepaidName)
        : deleteOfficeUser(selectedServiceName, activationEmail);
    },
    onSuccess: () => {
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>{t('dashboard_users_delete_message_success')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('dashboard_users_delete_message_error', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          licencePrepaidName
            ? getOfficeLicenseQueryKey(selectedServiceName)
            : getOfficeUsersQueryKey(selectedServiceName),
          selectedServiceName,
        ],
      });
      onClose();
    },
  });

  return (
    <Modal
      heading={t(`${NAMESPACES.ACTIONS}:delete_account`)}
      type={MODAL_COLOR.critical}
      open={true}
      onOpenChange={handleCancelClick}
      secondaryButton={{ label: t(`${NAMESPACES.ACTIONS}:cancel`), onClick: handleCancelClick }}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:delete`),
        disabled: !activationEmail,
        onClick: deleteUsers,
        loading: isDeleting,
      }}
    >
      <div>
        <Text preset={TEXT_PRESET.paragraph} className="mt-4">
          <Trans t={t} i18nKey="dashboard_users_delete_confirm" values={{ t0: activationEmail }} />
        </Text>
        <Message color={MESSAGE_COLOR.critical} className="mb-6 mt-4" dismissible={false}>
          <MessageIcon name={ICON_NAME.hexagonExclamation} />
          <MessageBody>
            <span className="block font-bold">{t('dashboard_users_delete_info1')}</span>
            <p>{t('dashboard_users_delete_info2')}</p>
          </MessageBody>
        </Message>
      </div>
    </Modal>
  );
}
