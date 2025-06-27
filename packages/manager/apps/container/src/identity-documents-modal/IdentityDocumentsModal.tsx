import { FC, useEffect, useRef, useState } from 'react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { Trans, useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsCollapsible,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  kycIndiaFeature,
  trackingContext,
  trackingPrefix,
  MODAL_NAME,
} from './IdentityDocumentsModal.constants';
import { useShell } from '@/context';
import { useCheckModalDisplay } from '@/hooks/modal/useModal';
import { useProcedureStatus } from '@/hooks/procedure/useProcedure';
import { useTime } from '@/hooks/time/useTime';
import { useCreatePreference } from '@/hooks/preferences/usePreferences';
import { isIndiaProcedureToBeDone, isUserConcernedWithIndiaProcedure } from '@/helpers/procedures/proceduresHelper';
import { toScreamingSnakeCase } from '@/helpers';
import { Procedures } from '@/types/procedure';

export const IdentityDocumentsModal: FC = () => {
  const { t } = useTranslation('identity-documents-modal');
  const shell = useShell();
  const navigationPlugin = shell.getPlugin('navigation');
  const uxPlugin = shell.getPlugin('ux');
  const legalInformationRef = useRef<HTMLOsdsCollapsibleElement>(null);

  const preferenceKey = toScreamingSnakeCase(MODAL_NAME);

  const shouldDisplayModal = useCheckModalDisplay(
    (enabled: boolean) => useProcedureStatus(Procedures.INDIA, {
      enabled,
      retry: 1,
      refetchOnWindowFocus: false,
    }),
    isIndiaProcedureToBeDone,
    [kycIndiaFeature],
    preferenceKey,
    Infinity,
    isUserConcernedWithIndiaProcedure,
  );

  const [showModal, setShowModal] = useState<boolean>(shouldDisplayModal);
  const { data: time } = useTime({ enabled: Boolean(shouldDisplayModal) });
  const { mutate: updatePreference } = useCreatePreference(
    preferenceKey,
    false,
  );

  const trackingPlugin = shell.getPlugin('tracking');

  const onCancel = () => {
    setShowModal(false);
    uxPlugin.notifyModalActionDone(IdentityDocumentsModal.displayName);
    trackingPlugin.trackClick({
      name: `${trackingPrefix}::pop-up::link::kyc::cancel`,
      type: 'action',
      ...trackingContext,
    });
  };

  const onConfirm = () => {
    setShowModal(false);
    trackingPlugin.trackClick({
      name: `${trackingPrefix}::pop-up::button::kyc::start-verification`,
      type: 'action',
      ...trackingContext,
    });
    navigationPlugin.navigateTo('dedicated', `#/identity-documents`);
  };

  useEffect(() => {
    trackingPlugin.trackPage({
      name: `${trackingPrefix}::pop-up::kyc`,
      ...trackingContext,
    });
  }, []);
  
  useEffect(() => {
    if (shouldDisplayModal !== undefined) {
      setShowModal(shouldDisplayModal);
      if (shouldDisplayModal) {
        updatePreference(time);
      }
      else {
        uxPlugin.notifyModalActionDone(IdentityDocumentsModal.displayName);
      }
    }
  }, [shouldDisplayModal]);

  return (
    showModal && (
      <OsdsModal dismissible={false} onOdsModalClose={onCancel}>
        <div className="my-2 text-center">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._500}
            color={ODS_THEME_COLOR_INTENT.text}
            hue={ODS_THEME_COLOR_HUE._800}
          >
            {t('identity_documents_modal_title')}
          </OsdsText>
        </div>
        <div className="my-2 text-center">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            hue={ODS_THEME_COLOR_HUE._800}
          >
            {t('identity_documents_modal_description')}
          </OsdsText>
        </div>
        <div className="my-1 text-center">
          <OsdsButton
            slot="actions"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.flat}
            inline={true}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onConfirm}
          >
            {t('identity_documents_modal_button_start')}
          </OsdsButton>
        </div>
        <div className="my-1 text-center">
          <OsdsButton
            slot="actions"
            onClick={onCancel}
            inline={true}
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('identity_documents_modal_button_later')}
          </OsdsButton>
        </div>
        <div className="my-1 text-center">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="cursor-pointer underline"
            hue={ODS_THEME_COLOR_HUE._800}
            onClick={() => {
              trackingPlugin.trackClick({
                name: `${trackingPrefix}::pop-up::link::kyc::go-to-more-information`,
                type: 'action',
                ...trackingContext,
              });
              legalInformationRef.current.opened = !legalInformationRef?.current
                ?.opened;
            }}
          >
            {t('identity_documents_modal_more_info')}
          </OsdsText>
          <OsdsCollapsible ref={legalInformationRef}>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
              color={ODS_THEME_COLOR_INTENT.info}
              hue={ODS_THEME_COLOR_HUE._800}
            >
              <Trans
                t={t}
                i18nKey="identity_documents_modal_legal_information"
              ></Trans>
            </OsdsText>
          </OsdsCollapsible>
        </div>
      </OsdsModal>
    )
  );
};
