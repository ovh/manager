import { useEffect, useState } from 'react';
import {
  OsdsButton,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useShell } from '@/context';
import { useSuggestionForUserProfile } from '@/hooks/suggestion/useSuggestion';

const SuggestionModal = (): JSX.Element => {
  const { t } = useTranslation('suggestion-modal');
  const shell = useShell();
  const ux = shell.getPlugin('ux');
  const accountEditionLink = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/useraccount/infos');

  const {
    isReady,
    shouldBeDisplayed,
    updatePreference,
    suggestions,
  } = useSuggestionForUserProfile(accountEditionLink);
  const [showModal, setShowModal] = useState(true);

  const onClose = () => {
    setShowModal(false);
    // @ TODO: Handle tracking (ECAN-2228)
  };
  const onAccept = () => {
    setShowModal(false);
    // @ TODO: Handle tracking (ECAN-2228)
    window.top.location.href = `${accountEditionLink}?fieldToFocus=siretForm`;
  };

  /*
   Since we don't want to display multiple modals at the same time we "watch" the `current` modal, and once it is
   the suggestion modal turn, we will try to display it (if conditions are met) or switch to the next one otherwise.
  */
  useEffect(() => {
    if (isReady) {
      if (shouldBeDisplayed) {
        // @ TODO: Handle tracking (ECAN-2228)
        updatePreference();
      } else {
        ux.notifyModalActionDone();
      }
    }
  }, [isReady]);

  return shouldBeDisplayed && showModal ? (
    <OsdsModal
      onOdsModalClose={onClose}
      headline={t('suggestion_modal_title')}
      color={ODS_THEME_COLOR_INTENT.info}
      data-testid="suggestion-modal"
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        <p>{t('suggestion_modal_description')}</p>
        <ul>
          {suggestions?.map((suggestion) => (
            <li key={`suggestion_${suggestion.type}`}>
              {t(
                `suggestion_modal_listed_type_${suggestion.type.replace(
                  ' ',
                  '_',
                )}`,
              )}{' '}
              : {suggestion.id}
            </li>
          ))}
        </ul>
        <p>{t('suggestion_modal_description_sub')}</p>
      </OsdsText>

      <OsdsButton
        onClick={onClose}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
      >
        {t('suggestion_modal_action_cancel')}
      </OsdsButton>

      <OsdsButton
        onClick={onAccept}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        size={ODS_BUTTON_SIZE.sm}
      >
        {t('suggestion_modal_action_confirm')}
      </OsdsButton>
    </OsdsModal>
  ) : null;
};

export default SuggestionModal;
