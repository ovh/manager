import React, { FunctionComponent } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsModal, OsdsText } from '@ovhcloud/ods-components/react';

import { InformationIcon } from '@/components/Icons/InformationIcon';

type Props = {
  onClose: () => void;
};

export const WarningSessionModal: FunctionComponent<Props> = ({ onClose }) => {
  const { t } = useTranslation('account-disable-2fa');

  return (
    <OsdsModal dismissible onOdsModalClose={onClose}>
      <div className="flex items-center gap-x-6">
        <InformationIcon />
        <div>
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._500}
            className="block mt-2"
            hue={ODS_TEXT_COLOR_HUE._500}
          >
            {t('account-disable-2fa-session-modal-warning-message')}
          </OsdsText>
        </div>
      </div>

      <OsdsButton
        slot="actions"
        onClick={onClose}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
      >
        {t('account-disable-2fa-session-modal-warning-ok-button')}
      </OsdsButton>
    </OsdsModal>
  );
};
