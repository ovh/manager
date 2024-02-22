import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsClipboard,
  OsdsPassword,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { AccessDetail } from '../../hooks/useGenerateAccessDetail';
import { RancherService } from '@/api/api.type';
import Modal from './Modal';
import { useTrackingAction, useTrackingPage } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

export interface GenerateAccessModalProps {
  rancher: RancherService;
  toggleModal: (showModal: boolean) => void;
  onGenerateAccess: () => void;
  accessDetail: AccessDetail;
}

const GenerateAccessModal: FC<GenerateAccessModalProps> = ({
  rancher,
  toggleModal,
  onGenerateAccess,
  accessDetail,
}) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const trackAction = useTrackingAction();
  useTrackingPage(TrackingPageView.GenerateAccessModal);
  const hasValidAccess = !!accessDetail?.username && !!accessDetail?.password;

  return (
    <Modal
      color={ODS_THEME_COLOR_INTENT.info}
      onClose={() => toggleModal(false)}
    >
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
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {t('generateAccesModalDescription')}
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
          <OsdsPassword
            aria-label="password"
            color={ODS_THEME_COLOR_INTENT.primary}
            value={accessDetail.password}
          />
        </div>
      )}
      <OsdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          trackAction(
            TrackingPageView.GenerateAccessModal,
            hasValidAccess ? TrackingEvent.close : TrackingEvent.cancel,
          );
          toggleModal(false);
        }}
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
                  TrackingEvent.generateAccessConfirm,
                );
              },
            }
          : {
              onClick: () => {
                trackAction(TrackingPageView.confirm, TrackingEvent.accessUi);
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
