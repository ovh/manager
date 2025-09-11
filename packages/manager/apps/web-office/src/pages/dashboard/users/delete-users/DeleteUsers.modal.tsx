import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import type { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_delete_message_success')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboard_users_delete_message_error', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
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
      type={ODS_MODAL_COLOR.critical}
      isOpen={true}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
      onDismiss={handleCancelClick}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      isPrimaryButtonDisabled={!activationEmail}
      onPrimaryButtonClick={deleteUsers}
      isPrimaryButtonLoading={isDeleting}
    >
      <div>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mt-4">
          <Trans t={t} i18nKey="dashboard_users_delete_confirm" values={{ t0: activationEmail }} />
        </OdsText>
        <OdsMessage color={ODS_MESSAGE_COLOR.critical} className="mt-4 mb-6" isDismissible={false}>
          <div>
            <span className="block font-bold">{t('dashboard_users_delete_info1')}</span>
            <p>{t('dashboard_users_delete_info2')}</p>
          </div>
        </OdsMessage>
      </div>
    </Modal>
  );
}
