import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsClipboard,
  OsdsModal,
  OsdsPassword,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AccessDetail } from '../../hooks/useGenerateAccessDetail';
import { RancherService } from '../../api/api.type';

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
  const navigate = useNavigate();
  const { t } = useTranslation('pci-rancher/dashboard');
  const hasValidAccess = accessDetail?.username && accessDetail?.password;

  const onEdit = () => {
    if (hasValidAccess) {
      navigate(rancher.currentState.url);
    } else {
      onGenerateAccess();
    }
  };
  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      dismissible
      onOdsModalClose={() => toggleModal(false)}
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
        color={ODS_THEME_COLOR_INTENT.default}
        onClick={() => toggleModal(false)}
      >
        {t(hasValidAccess ? 'close' : 'cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onEdit}
        aria-label="edit-name-rancher"
      >
        {t(hasValidAccess ? 'rancher_button_acces' : 'confirm')}
      </OsdsButton>
    </OsdsModal>
  );
};

export default GenerateAccessModal;
