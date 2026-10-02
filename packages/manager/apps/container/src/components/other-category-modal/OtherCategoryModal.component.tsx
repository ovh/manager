import { FC, useCallback, useEffect, useState } from "react";
import { OsdsButton, OsdsModal, OsdsText, OsdsLink } from "@ovhcloud/ods-components/react";
import { ODS_THEME_TYPOGRAPHY_SIZE, ODS_THEME_COLOR_INTENT } from "@ovhcloud/ods-common-theming";
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from "@ovhcloud/ods-components";
import { OdsHTMLAnchorElementRel, OdsHTMLAnchorElementTarget } from "@ovhcloud/ods-common-core";
import { Trans, useTranslation } from "react-i18next";
import {
  ELECTRONIC_BILLING_REGULATION_LINK,
  LEGALFORM_FIELD_TO_FOCUS,
  OTHER_CATEGORY_FEATURE,
  TRACKING_CONTEXT,
  TRACKING_PREFIX,
} from "./otherCategoryModal.constants";
import {
  isTurkishAccount,
  setOtherCategoryDismissed,
  shouldRemindOtherCategory,
} from "./otherCategoryModal.helpers";
import { useCheckModalDisplay } from "@/hooks/modal/useModal";
import { useSuggestionTargetUrl } from "@/data/hooks/suggestion/useSuggestion";
import { useApplication } from "@/context";

const OtherCategoryModal: FC = () => {
  const { shell } = useApplication();
  const ux = shell.getPlugin('ux');
  const tracking = shell.getPlugin('tracking');
  const { t } = useTranslation('other-category-modal');
  // F1: no French e-invoicing link for Turkish accounts.
  const isTurkey = isTurkishAccount(
    shell.getPlugin('environment')?.getEnvironment?.()?.getUser?.(),
  );

  const accountEditionLink = useSuggestionTargetUrl();

  // RG1 "at every login": no preference/interval throttling, but once dismissed
  // the modal stays closed for the rest of the browser session. It is skipped on
  // the account edition page itself so it does not overlap the form the CTA
  // leads to.
  const shouldDisplayModal = useCheckModalDisplay(
    undefined,
    undefined,
    [OTHER_CATEGORY_FEATURE],
    undefined,
    undefined,
    shouldRemindOtherCategory,
    [accountEditionLink],
  );

  const [showModal, setShowModal] = useState(shouldDisplayModal);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setOtherCategoryDismissed();
    ux.notifyModalActionDone(OtherCategoryModal.name);
    tracking.trackClick({
      name: `${TRACKING_PREFIX}::pop-up::button::other_category::dismiss`,
      type: 'action',
      ...TRACKING_CONTEXT,
    });
  }, [ux]);

  const goToCategoryEdition = useCallback(() => {
    setShowModal(false);
    setOtherCategoryDismissed();
    ux.notifyModalActionDone(OtherCategoryModal.name);
    tracking.trackClick({
      name: `${TRACKING_PREFIX}::pop-up::button::other_category::update`,
      type: 'action',
      ...TRACKING_CONTEXT,
    });
    window.top.location.href = `${accountEditionLink}?fieldToFocus=${LEGALFORM_FIELD_TO_FOCUS}`;
  }, [accountEditionLink]);

  useEffect(() => {
    if (shouldDisplayModal !== undefined) {
      setShowModal(shouldDisplayModal);
      if (!shouldDisplayModal) {
        ux.notifyModalActionDone(OtherCategoryModal.name);
      } else {
        tracking.trackPage({
          name: `${TRACKING_PREFIX}::pop-up::other_category`,
          ...TRACKING_CONTEXT,
        });
      }
    }
  }, [shouldDisplayModal]);

  return (
    showModal && (
      <OsdsModal
        dismissible={true}
        onOdsModalClose={closeModal}
        headline={t('other_category_modal_title')}
        color={ODS_THEME_COLOR_INTENT.info}
        data-testid="other-category-modal"
      >
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {isTurkey ? (
            t('other_category_modal_description_tr')
          ) : (
          <Trans
            i18nKey="other_category_modal_description"
            t={t}
            components={{
              anchor: (
                <OsdsLink
                  href={ELECTRONIC_BILLING_REGULATION_LINK}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  target={OdsHTMLAnchorElementTarget._blank}
                  rel={OdsHTMLAnchorElementRel.noopener}
                />
              ),
            }}
          />
          )}
        </OsdsText>
        <OsdsButton
          onClick={goToCategoryEdition}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
        >
          {t('other_category_modal_action_modify')}
        </OsdsButton>
      </OsdsModal>
    )
  );
};

export default OtherCategoryModal;
