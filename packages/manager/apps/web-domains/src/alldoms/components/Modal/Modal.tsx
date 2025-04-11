import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import { t } from 'i18next';
import React from 'react';

export default function Modal() {
  return (
    <OdsModal isOpen={true} color={ODS_MODAL_COLOR.warning}>
      <hgroup className="mb-4">
        <OdsText preset={ODS_TEXT_PRESET.heading3} class="mb-8">
          {t('alldom_modal_title')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('alldom_modal_subtitle')}
        </OdsText>
      </hgroup>

      <div>
        <OdsText preset={ODS_TEXT_PRESET.heading6} className="mb-4">
          Je souhaite supprimer :
        </OdsText>
        <div className="domain-all">
          <input type="checkbox" name="alldomains" id="alldomains" />
          <label htmlFor="alldomains">Tout mes domaines</label>
        </div>
      </div>
    </OdsModal>
  );
}
