import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OsdsContentAddon,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useQuery } from '@tanstack/react-query';
import { useGenerateUrl, usePlatform } from '@/hooks';
import Modal from '@/components/Modals/Modal';
import {
  getZimbraPlatformAccountDetail,
  deleteZimbraPlatformAccount,
  getZimbraPlatformAccountDetailQueryKey,
} from '@/api/account';

export default function ModalDeleteOrganization() {
  const [searchParams] = useSearchParams();
  const deleteEmailAccountId = searchParams.get('deleteEmailAccountId');
  const { t } = useTranslation('accounts/delete');
  const { platformId } = usePlatform();
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const [step, setStep] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: getZimbraPlatformAccountDetailQueryKey(
      platformId,
      deleteEmailAccountId,
    ),
    queryFn: () =>
      getZimbraPlatformAccountDetail(platformId, deleteEmailAccountId),
    enabled: !!platformId,
  });

  const handleDeleteClick = () => {
    deleteZimbraPlatformAccount(platformId, deleteEmailAccountId)
      .then(() => {
        onClose();
        addSuccess(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_account_delete_success_message')}
          </OsdsText>,
          true,
        );
      })
      .catch(({ response }) => {
        onClose();
        addError(
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            hue={ODS_THEME_COLOR_HUE._500}
          >
            {t('zimbra_account_delete_error_message', {
              error: response.data.message,
            })}
          </OsdsText>,
          true,
        );
      });
  };

  return (
    <Modal
      title={t('zimbra_account_delete_modal_title')}
      color={ODS_THEME_COLOR_INTENT.warning}
      onDismissible={onClose}
      dismissible={true}
      isLoading={isLoading}
      secondaryButton={{
        label: t('zimbra_account_delete_button_cancel'),
        action: onClose,
      }}
      primaryButton={{
        label: t('zimbra_account_delete_button_delete'),
        action: step === 1 ? () => setStep(2) : handleDeleteClick,
        testid: 'primary-btn',
      }}
    >
      <>
        {step === 1 && (
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
              data-testid="text-step-1"
            >
              {t('zimbra_account_delete_modal_content_step1')}
            </OsdsText>
            <OsdsContentAddon className="mt-5">
              <span slot="start">
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                  hue={ODS_THEME_COLOR_HUE._500}
                >
                  {t('zimbra_account_delete_modal_mail_label')}
                </OsdsText>
              </span>

              <span slot="main" className="ml-5">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  hue={ODS_THEME_COLOR_HUE._500}
                >
                  {data?.currentState.email}
                </OsdsText>
              </span>
            </OsdsContentAddon>
          </>
        )}

        {step === 2 && (
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              hue={ODS_THEME_COLOR_HUE._500}
              data-testid="text-step-2"
            >
              {t('zimbra_account_delete_modal_content_step2')}
            </OsdsText>
            <OsdsMessage
              color={ODS_THEME_COLOR_INTENT.warning}
              icon={ODS_ICON_NAME.WARNING_CIRCLE}
              className="mt-4"
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                hue={ODS_THEME_COLOR_HUE._500}
              >
                {t('zimbra_account_delete_modal_warn_message')}
              </OsdsText>
            </OsdsMessage>
          </>
        )}
      </>
    </Modal>
  );
}
