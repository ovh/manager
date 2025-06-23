import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { OdsText, OdsModal, OdsButton } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';

export default function ActivateOfferModal() {
  const { t } = useTranslation('activate-offer');
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);

  const navigate = useNavigate();

  const onClose = () => {
    navigate('..');
  };

  const onActivate = () => {
    // TODO
  };

  return (
    <OdsModal color={ODS_MODAL_COLOR.information} onOdsClose={onClose} isOpen>
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.heading3}>{t('title')}</OdsText>

        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          data-testid="manager-delete-modal-description"
        >
          {t('description')}
        </OdsText>

        <div className="flex justify-end gap-2">
          <OdsButton
            slot="actions"
            data-testid="manager-delete-modal-cancel"
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.primary}
            onClick={onClose}
            label={tAction('cancel')}
          />
          <OdsButton
            slot="actions"
            data-testid="manager-delete-modal-confirm"
            onClick={onActivate}
            color={ODS_BUTTON_COLOR.primary}
            label={tAction('activate')}
          />
        </div>
      </div>
    </OdsModal>
  );
}
