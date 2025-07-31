import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { OdsText, OdsModal, OdsButton } from '@ovhcloud/ods-components/react';
import { useOvhTracking, PageType } from '@ovh-ux/manager-react-shell-client';

import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useActivateVmwareCloudDirectorBackupOfferGold } from '@ovh-ux/manager-module-vcd-api';
import { MessagesContext } from '@/components/Messages/Messages.context';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING, PageName } from '@/tracking.constant';

export default function ActivateOfferModal() {
  const { t } = useTranslation('activate-offer');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id } = useParams();
  const { trackClick, trackPage } = useOvhTracking();

  const navigate = useNavigate();
  const { addSuccessMessage, addCriticalMessage } = useContext(MessagesContext);

  const goBack = () => {
    navigate('..');
  };

  const onClose = () => {
    trackClick(TRACKING.activateVeeamBackupOffer.clicks.closeModal);
    goBack();
  };

  const onSuccess = () => {
    goBack();
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: PageName.successActivateOfferGold,
    });
    addSuccessMessage(t('success'), {
      veeamBackupId: id,
    });
  };

  const {
    activateGoldOffer,
    isPending,
  } = useActivateVmwareCloudDirectorBackupOfferGold({
    backupId: id,
    onSuccess,
    onError: (err) => {
      goBack();
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorActivateOfferGold,
      });
      addCriticalMessage(
        t('error', {
          errorAPI: err?.response?.data?.message,
        }),
        {
          veeamBackupId: id,
        },
      );
    },
  });

  const onActivate = () => {
    trackClick(TRACKING.activateVeeamBackupOffer.clicks.confirmActivation);
    activateGoldOffer().catch(() => {});
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
            data-testid={TEST_IDS.cancelOfferModalAction}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.primary}
            onClick={onClose}
            label={tActions('cancel')}
          />
          <OdsButton
            slot="actions"
            data-testid={TEST_IDS.activateOfferModalAction}
            onClick={onActivate}
            color={ODS_BUTTON_COLOR.primary}
            isLoading={isPending}
            isDisabled={isPending}
            label={tActions('activate')}
          />
        </div>
      </div>
    </OdsModal>
  );
}
