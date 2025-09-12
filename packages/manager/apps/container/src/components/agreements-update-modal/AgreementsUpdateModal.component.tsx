import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsLink,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { useApplication } from '@/context';
import ovhCloudLogo from '@/assets/images/logo-ovhcloud.png';
import { useCheckModalDisplay } from '@/hooks/modal/useModal';
import { useTime } from '@/data/hooks/time/useTime';
import { useCreatePreference } from '@/data/hooks/preferences/usePreferences';
import {
  ACCEPT_AGREEMENTS_IAM_ACTION,
  AGREEMENTS_UPDATE_MODAL_FEATURE,
  INTERVAL_BETWEEN_DISPLAY_IN_S,
  MODAL_NAME,
} from './agreementsUpdateModal.constants';
import { useAgreementsPageNavigationParam, usePendingAgreements } from '@/data/hooks/agreements/useAgreements';
import { hasPendingAgreements } from '@/helpers/agreements/agreementsHelper';
import { toScreamingSnakeCase } from '@/helpers';

/*
 Lifecycle management:
  - If user is on the agreements page, we will not display the modal and let the page notify for modal change once the user accept non-validated agreements or leave the page
  - Wait until all necessary data (IAM authorization, non-validated agreements list) are loaded
  - Once we have the data, check if they allow the display of the modal (IAM authorized + at least one non-validated agreement), if the conditions are met, we show the modal, otherwise we switch to the next one
*/
export default function AgreementsUpdateModal() {
  const { t } = useTranslation('agreements-update-modal');
  const { shell } = useApplication();
  const navigation = shell.getPlugin('navigation');
  const ux = shell.getPlugin('ux');

  const { app, path } = useAgreementsPageNavigationParam();
  const myContractsLink = navigation.getURL(app, path);

  const preferenceKey = toScreamingSnakeCase(MODAL_NAME);

  const shouldDisplayModal = useCheckModalDisplay(
    usePendingAgreements,
    hasPendingAgreements,
    [AGREEMENTS_UPDATE_MODAL_FEATURE],
    preferenceKey,
    INTERVAL_BETWEEN_DISPLAY_IN_S,
    undefined,
    [myContractsLink],
    undefined,
    [ACCEPT_AGREEMENTS_IAM_ACTION],
  );
  const [showModal, setShowModal] = useState(shouldDisplayModal);
  const { data: time } = useTime({ enabled: Boolean(shouldDisplayModal) });
  const { mutate: updatePreference } = useCreatePreference(
    preferenceKey,
    false,
  );

  const goToContractPage = () => {
    setShowModal(false);
    navigation.navigateTo(app, path);
  };
  
  useEffect(() => {
    if (shouldDisplayModal !== undefined) {
      setShowModal(shouldDisplayModal);
      if (shouldDisplayModal) {
        updatePreference(time);
      }
      else {
        ux.notifyModalActionDone(AgreementsUpdateModal.name);
      }
    }
  }, [shouldDisplayModal]);

  return (
    showModal && (
      <>
        <OsdsModal
          dismissible={false}
          className="text-center"
          color={ODS_THEME_COLOR_INTENT.info}
          data-testid="agreements-update-modal"
        >
          <div className="w-full flex justify-center items-center mb-6">
            <img src={ovhCloudLogo} alt="ovhcloud-logo" height={40} />
          </div>
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            hue={ODS_THEME_COLOR_HUE._800}
          >
            {t('agreements_update_modal_title')}
          </OsdsText>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            hue={ODS_THEME_COLOR_HUE._800}
          >
            <p className="mt-6">
              <Trans
                i18nKey="agreements_update_modal_description"
                t={t}
                components={{
                  anchor: (
                    <OsdsLink
                      href={myContractsLink}
                      target={OdsHTMLAnchorElementTarget._top}
                      onClick={() => setShowModal(false)}
                    ></OsdsLink>
                  ),
                }}
              />
            </p>
          </OsdsText>

          <OsdsButton
            onClick={goToContractPage}
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.flat}
            size={ODS_BUTTON_SIZE.sm}
          >
            {t('agreements_update_modal_action')}
          </OsdsButton>
        </OsdsModal>
      </>
    )
  );
}
