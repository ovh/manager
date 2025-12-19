import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsClipboard,
  OsdsIcon,
  OsdsMessage,
  OsdsPassword,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { FC } from 'react';

import { useTranslation, Trans } from 'react-i18next';

import { AccessDetail } from '@/data/hooks/useGenerateAccessDetail/useGenerateAccessDetail';
import { RancherService } from '@/types/api.type';
import Modal from '../Modal.component';
import {
  useTrackingAction,
  useTrackingPage,
} from '@/hooks/useTrackingPage/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useIamActivated } from '@/hooks/useIamActivated';

export interface GenerateAccessModalProps {
  rancher: RancherService;
  onClose: () => void;
  onGenerateAccess: () => void;
  accessDetail: AccessDetail;
}

const GenerateAccessModal: FC<GenerateAccessModalProps> = ({
  rancher,
  onClose,
  onGenerateAccess,
  accessDetail,
}) => {
  const { t } = useTranslation('dashboard');
  const trackAction = useTrackingAction();
  const iamIsEnabled = useIamActivated();
  useTrackingPage(TrackingPageView.GenerateAccessModal);
  const hasValidAccess = !!accessDetail?.username && !!accessDetail?.password;

  return (
    <Modal color={ODS_THEME_COLOR_INTENT.info} onClose={onClose}>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="my-3"
      >
        {t('generateAccesModalTitle', {
          rancherName: rancher.currentState.name,
        })}
      </OsdsText>
      {!hasValidAccess && (
        <div className="mt-3">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
          >
            {t('generateAccesModalDescription', {
              rancherName: rancher.currentState.name,
            })}
          </OsdsText>
        </div>
      )}
      {accessDetail && (
        <div>
          <OsdsClipboard
            aria-label="clipboard"
            value={accessDetail.username}
            className="my-6"
          >
            <span slot="success-message">{t('copy')}</span>
            <span slot="error-message">{t('error')}</span>
          </OsdsClipboard>
          <div className="flex items-center justify-center">
            <OsdsPassword
              className="w-full"
              aria-label="password"
              color={ODS_THEME_COLOR_INTENT.primary}
              value={accessDetail.password}
            />
            <OsdsIcon
              className="cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(accessDetail.password)
              }
              size={ODS_ICON_SIZE.sm}
              name={ODS_ICON_NAME.COPY}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </div>

          <div className="my-4">
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('generateAccessModalPasswordDescription', {
                rancherName: rancher.currentState.name,
              })}
            </OsdsText>
          </div>
        </div>
      )}
      {iamIsEnabled && rancher.currentState.iamAuthEnabled && !accessDetail && (
        <OsdsMessage
          color={ODS_THEME_COLOR_INTENT.warning}
          type={ODS_MESSAGE_TYPE.warning}
          className="my-6"
        >
          <div>
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              className="text-[--ods-color-warning-700]"
              color={ODS_THEME_COLOR_INTENT.text}
            >
              <strong>
                {t('iam_authentication_warning')} {':'}
              </strong>
            </OsdsText>

            <OsdsText
              className={'text-[--ods-color-warning-700] inline-block'}
              size={ODS_TEXT_SIZE._400}
            >
              <Trans i18nKey={'iam_modal_activation_warning_text'} />
            </OsdsText>
          </div>
        </OsdsMessage>
      )}
      <OsdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onClose}
      >
        {t(hasValidAccess ? 'close' : 'cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        aria-label="edit-name-rancher"
        {...(hasValidAccess
          ? {
              target: OdsHTMLAnchorElementTarget._blank,
              href: rancher.currentState.url,
              onClick: () => {
                trackAction(
                  TrackingPageView.GenerateAccessModal,
                  TrackingEvent.accessUi,
                );
              },
            }
          : {
              onClick: () => {
                trackAction(
                  TrackingPageView.GenerateAccessModal,
                  TrackingEvent.confirm,
                );
                onGenerateAccess();
              },
            })}
      >
        {t(hasValidAccess ? 'rancher_button_acces' : 'confirm')}
      </OsdsButton>
    </Modal>
  );
};

export default GenerateAccessModal;
