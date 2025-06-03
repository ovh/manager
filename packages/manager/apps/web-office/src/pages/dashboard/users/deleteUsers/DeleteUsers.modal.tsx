import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import {
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useGenerateUrl } from '@/hooks';
import {
  getOfficeLicenseQueryKey,
  postOfficePrepaidLicenseUnconfigure,
} from '@/data/api/license';
import { deleteOfficeUser, getOfficeUsersQueryKey } from '@/data/api/users';
import queryClient from '@/queryClient';

export default function ModalDeleteUsers() {
  const { t } = useTranslation('dashboard/users/delete');
  const navigate = useNavigate();

  const { serviceName: selectedServiceName } = useParams();
  const [searchParams] = useSearchParams();
  const activationEmail = searchParams.get('activationEmail');
  const licencePrepaidName = searchParams.get('licencePrepaidName');

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: deleteUsers, isPending: isDeleting } = useMutation({
    mutationFn: () =>
      licencePrepaidName
        ? postOfficePrepaidLicenseUnconfigure(
            selectedServiceName,
            licencePrepaidName,
          )
        : deleteOfficeUser(selectedServiceName, activationEmail),
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
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          licencePrepaidName
            ? getOfficeLicenseQueryKey(selectedServiceName)
            : getOfficeUsersQueryKey(selectedServiceName),
        ],
      });
      onClose();
    },
  });

  return (
    <Modal
      heading={t('dashboard_users_delete_title')}
      type={ODS_MODAL_COLOR.critical}
      isOpen={true}
      secondaryLabel={t('dashboard_users_delete_cta_cancel')}
      onSecondaryButtonClick={onClose}
      onDismiss={onClose}
      primaryLabel={t('dashboard_users_delete_cta_confirm')}
      isPrimaryButtonDisabled={!activationEmail}
      onPrimaryButtonClick={deleteUsers}
      isPrimaryButtonLoading={isDeleting}
    >
      <div>
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mt-4">
          <Trans
            t={t}
            i18nKey="dashboard_users_delete_confirm"
            values={{ t0: activationEmail }}
          />
        </OdsText>
        <OdsMessage
          color={ODS_MESSAGE_COLOR.critical}
          className="mt-4 mb-6"
          isDismissible={false}
        >
          <div>
            <span className="block font-bold">
              {t('dashboard_users_delete_info1')}
            </span>
            <p>{t('dashboard_users_delete_info2')}</p>
          </div>
        </OdsMessage>
      </div>
    </Modal>
  );
}
