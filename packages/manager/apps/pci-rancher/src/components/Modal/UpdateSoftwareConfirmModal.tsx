import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React from 'react';

import { useTranslation } from 'react-i18next';
import { RancherVersion } from '@/api/api.type';
import { useTrackingAction, useTrackingPage } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import LinkIcon from '../LinkIcon/LinkIcon';
import Modal from './Modal';

interface UpdateSoftwareModalProps {
  onClose: () => void;
  onConfirmUpdated: () => void;
  version: RancherVersion;
  isUpdatePending: boolean;
}

const UpdateSoftwareModal = ({
  onClose,
  onConfirmUpdated,
  version,
  isUpdatePending,
}: UpdateSoftwareModalProps) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  useTrackingPage(TrackingPageView.UpdateSoftware);
  const trackAction = useTrackingAction();

  const onUpdate = () => {
    trackAction(TrackingPageView.UpdateSoftware, TrackingEvent.confirm);
    onConfirmUpdated();
    onClose();
  };

  const onCloseModal = () => {
    trackAction(TrackingPageView.UpdateSoftware, TrackingEvent.cancel);
    onClose();
  };

  return (
    <Modal color={ODS_THEME_COLOR_INTENT.warning} onClose={onCloseModal}>
      {!isUpdatePending ? (
        <>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            className="my-3"
          >
            {t('updateSoftwareModalTitle')}
          </OsdsText>
          <div className="my-4">
            <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
              {t('updateSoftwareModalDescription')}
            </OsdsText>
            <LinkIcon
              iconName={ODS_ICON_NAME.EXTERNAL_LINK}
              href={version?.changelogUrl}
              text={t('updateSoftwareRancherChangelog')}
              target={OdsHTMLAnchorElementTarget._blank}
            />
          </div>
          <OsdsButton
            slot="actions"
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onCloseModal}
          >
            {t('cancel')}
          </OsdsButton>
          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onUpdate}
          >
            {t('confirm')}
          </OsdsButton>
        </>
      ) : (
        <div className="max-w-3xl">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
        </div>
      )}
    </Modal>
  );
};

export default UpdateSoftwareModal;
