import { FC, useCallback, useEffect, useState } from "react";
import { INTERVAL_BETWEEN_DISPLAY_IN_S, MODAL_NAME, TRACKING_PREFIX, TRACKING_CONTEXT, ELECTRONIC_BILLING_REGULATION_LINK } from "./companyInformationModal.constants";
import { useCheckModalDisplay } from "@/hooks/modal/useModal";
import { useTime } from "@/data/hooks/time/useTime";
import { toScreamingSnakeCase } from "@/helpers";
import { useSuggestionTargetUrl } from "@/data/hooks/suggestion/useSuggestion";
import { useCreatePreference } from "@/data/hooks/preferences/usePreferences";
import { OsdsButton, OsdsModal, OsdsText, OsdsLink } from "@ovhcloud/ods-components/react";
import { ODS_THEME_TYPOGRAPHY_SIZE, ODS_THEME_COLOR_INTENT } from "@ovhcloud/ods-common-theming";
import { useApplication } from "@/context";
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from "@ovhcloud/ods-components";
import { Trans, useTranslation } from "react-i18next";
import { isUserConcernedByBusinessVerification, useBusinessVerificationRequired } from "./companyInformationModal.helpers";
import { OdsHTMLAnchorElementRel, OdsHTMLAnchorElementTarget } from "@ovhcloud/ods-common-core";


const CompanyInformationModal: FC = () => {

  const { shell } = useApplication();
  const ux = shell.getPlugin('ux');
  const tracking = shell.getPlugin('tracking');
  const { t } = useTranslation('company-information-modal');

  const preferenceKey = toScreamingSnakeCase(MODAL_NAME);
  const accountEditionLink = useSuggestionTargetUrl();

  const shouldDisplayModal = useCheckModalDisplay(
    useBusinessVerificationRequired,
    (data) => Boolean(data),
    undefined,
    preferenceKey,
    INTERVAL_BETWEEN_DISPLAY_IN_S,
    isUserConcernedByBusinessVerification,
    [accountEditionLink],
  );

  const [showModal, setShowModal] = useState(shouldDisplayModal);
  const { data: time } = useTime({ enabled: Boolean(shouldDisplayModal) });
  const { mutate: updatePreference } = useCreatePreference(
    preferenceKey,
    false,
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
    ux.notifyModalActionDone(CompanyInformationModal.name);
    // Update preference so the modal is not display until 30 days later, time for the update to be done on our side
    const DAYS_DELAY = 30;
    updatePreference(time + DAYS_DELAY * 24 * 60 * 60);
    tracking.trackClick({
      name: `${TRACKING_PREFIX}::pop-up::button::business_verification_required::confirm`,
      type: 'action',
      ...TRACKING_CONTEXT,
    });
  }, [ux, time]);

  const goToProfileEdition = useCallback(() => {
    setShowModal(false);
    // Update preference so the modal is not displayed until a day later
    updatePreference(time);
    tracking.trackClick({
      name: `${TRACKING_PREFIX}::pop-up::button::business_verification_required::cancel`,
      type: 'action',
      ...TRACKING_CONTEXT,
    });
    window.top.location.href = `${accountEditionLink}?fieldToFocus=siretForm`;
  }, [accountEditionLink, time]);

  useEffect(() => {
    if (shouldDisplayModal !== undefined) {
      setShowModal(shouldDisplayModal);
      if (!shouldDisplayModal) {
        ux.notifyModalActionDone(CompanyInformationModal.name);
      } else {
        // only trigger tracking if the modal is actually displayed and not skipped
        tracking.trackPage({
          name: `${TRACKING_PREFIX}::pop-up::business_verification_required`,
          ...TRACKING_CONTEXT,
        })
      }
    }
  }, [shouldDisplayModal]);

  return (
    showModal && (
      <OsdsModal
        dismissible={true}
        onOdsModalClose={closeModal}
        headline={t('company_information_modal_title')}
        color={ODS_THEME_COLOR_INTENT.info}
        data-testid="company-information-modal"
      >
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          <Trans
            i18nKey="company_information_modal_description"
            t={t}
            components={{
              anchor: (
                <OsdsLink href={ELECTRONIC_BILLING_REGULATION_LINK} color={ODS_THEME_COLOR_INTENT.primary} target={OdsHTMLAnchorElementTarget._blank} rel={OdsHTMLAnchorElementRel.noopener} />
              ),
            }}
          />
        </OsdsText>
        <OsdsButton
          onClick={goToProfileEdition}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
        >
          {t('company_information_modal_action_modify')}
        </OsdsButton>
      </OsdsModal>
    )
  );
};

export default CompanyInformationModal;
