import {
  kycIndiaFeature,
  kycIndiaModalLocalStorageKey,
  requiredStatusKey,
  trackingContext,
  trackingPrefix,
} from './constants';
import { useIdentityDocumentsStatus } from '@/hooks/useIdentityDocumentsStatus';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalStorage } from 'react-use';
import { useShell } from '@/context';
import { OsdsButton, OsdsCollapsible, OsdsModal, OsdsText, } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useModals } from '@/context/modals';
import { ModalTypes } from '@/context/modals/modals.context';

export const IdentityDocumentsModal: FunctionComponent = () => {
  const shell = useShell();
  const navigationPlugin = shell.getPlugin('navigation');
  const [storage, setStorage] = useLocalStorage<boolean>(
    kycIndiaModalLocalStorageKey,
  );
  const { current } = useModals();

  const kycURL = navigationPlugin.getURL('dedicated', `#/identity-documents`);

  const { t } = useTranslation('identity-documents-modal');
  const legalInformationRef = useRef<any>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: availability, isLoading: isFeatureAvailabilityLoading } = useFeatureAvailability([kycIndiaFeature]);

  const isKycAvailable = useMemo(() => Boolean(availability && availability[kycIndiaFeature] && !storage), [availability, storage]);

  const { data: statusDataResponse, isLoading: isProcedureStatusLoading } = useIdentityDocumentsStatus({
    enabled: isKycAvailable && current === ModalTypes.kyc && window.location.href !== kycURL,
  });

  const trackingPlugin = shell.getPlugin('tracking');

  const onCancel = () => {
    setShowModal(false);
    setStorage(true);
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
  /*
   Since we don't want to display multiple modals at the same time we "watch" the `current` modal, and once it is
   the agreements modal turn, we will try to display it (if conditions are met) or switch to the next one otherwise.
   As a result, only once the agreements modal is the current one will we manage the modal lifecycle.
   Lifecycle management:
    - If user is on the KYC page, we will not display the modal and let the page notify for modal change
    once the user has uploaded his documents or leave the page
    - Wait until all necessary data (feature flipping, procedure status) are loaded
    - Once we have the data, check if they allow the display of the modal (FF authorized + procedure status is
    'required'), if the conditions are met, we show the modal, otherwise we switch to the next one
   */
  useEffect(() => {
    const shouldManageModal = current === ModalTypes.kyc && window.location.href !== kycURL;
    if (shouldManageModal) {
      if (!isFeatureAvailabilityLoading && availability) {
        if (!isKycAvailable) {
          shell.getPlugin('ux').notifyModalActionDone();
        }
        else if (!isProcedureStatusLoading && statusDataResponse) {
          if (statusDataResponse?.data?.status === requiredStatusKey) {
            setShowModal(true);
          }
          else if (shouldManageModal) {
            shell.getPlugin('ux').notifyModalActionDone();
          }
        }
      }
    }
  }, [
    current,
    isFeatureAvailabilityLoading,
    availability,
    isKycAvailable,
    isProcedureStatusLoading,
    statusDataResponse,
  ]);

  useEffect(() => {
    if (showModal) {
      trackingPlugin.trackPage({
        name: `${trackingPrefix}::pop-up::kyc`,
        ...trackingContext,
      });
    }
  }, [showModal]);

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
