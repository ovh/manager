import React, { FC } from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsText,
  OsdsSpinner,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import Modal from '@/components/Modal/Modal.component';
import { useRancher } from '@/data/hooks/useRancher/useRancher';
import useEditRancher from '@/data/hooks/useEditRancher/useEditRancher';

import { selectIamContent } from './iamActivationViewModel';

const ActivateIamModal: FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { projectId, rancherId } = useParams();
  const { data: rancher, refetch } = useRancher();

  const { addError, addSuccess } = useNotifications();

  const iamEnabled =
    rancher?.currentState.iamAuthEnabled ||
    rancher?.targetSpec.iamAuthEnabled ||
    false;

  const { mutate: updateRancher, isPending } = useEditRancher({
    projectId,
    rancherId,

    onSuccess: () => {
      refetch();
      addSuccess(
        !iamEnabled
          ? t('iam_authentication_enable_success_message', {
              rancherId,
            })
          : t('iam_authentication_disable_success_message', {
              rancherId,
            }),
        true,
      );
      navigate('..');
    },
    onError: () => {
      addError(t('editNameRancherError'));
    },
  });

  const {
    title,
    content: Content,
    warning,
    showWarningTitle,
  } = selectIamContent(!iamEnabled);
  const onClose = () => {
    navigate('..');
  };

  const handleActivate = () => {
    if (rancher) {
      updateRancher({
        rancher: {
          targetSpec: {
            ...rancher.targetSpec,
            iamAuthEnabled: !iamEnabled,
          },
        },
      });
    }
  };

  return (
    <Modal color={ODS_THEME_COLOR_INTENT.info} onClose={onClose}>
      {!isPending ? (
        <>
          <div className="">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.heading}
              size={ODS_TEXT_SIZE._400}
              className="my-3"
            >
              {t(title)}
            </OsdsText>

            <Content />
            <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="my-6">
              <div className="flex flex-col items-start gap-2">
                {showWarningTitle && (
                  <OsdsText
                    size={ODS_TEXT_SIZE._400}
                    className="text-[--ods-color-warning-700]"
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    <strong>
                      {t('iam_authentication_warning')} {':'}
                    </strong>
                  </OsdsText>
                )}
                <div>
                  {warning.map((warn) => (
                    <OsdsText
                      size={ODS_TEXT_SIZE._400}
                      className="text-[--ods-color-warning-700] block"
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      <Trans
                        i18nKey={warn}
                        components={{ strong: <strong /> }}
                      />
                    </OsdsText>
                  ))}
                </div>
              </div>
            </OsdsMessage>
          </div>
          <OsdsButton
            slot="actions"
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onClose}
          >
            {t('cancel')}
          </OsdsButton>

          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={handleActivate}
            aria-label="activate-iam"
          >
            {t(`iam_modal_${iamEnabled ? 'deactivate' : 'activate'}_button`)}
          </OsdsButton>
        </>
      ) : (
        <div className="flex justify-center items-center p-6">
          <OsdsSpinner inline />
        </div>
      )}
    </Modal>
  );
};

export default ActivateIamModal;
