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
import { useApplication } from '@/context';
import { useModals } from '@/context/modals';
import { Suggestion } from '@/types/suggestion';
import { isSuggestionRelevant } from '@/components/SuggestionModal/SuggestionModal.constants';

const SuggestionModal = (): JSX.Element => {
  const { t } = useTranslation('suggestion-modal');
  const { shell } = useApplication();
  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();
  const ux = shell.getPlugin('ux');
  const accountEditionLink = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/useraccount/infos');

  const [showModal, setShowModal] = useState(true);
  const { data: suggestions } = useModals();

  const closeModal = () => {
    setShowModal(false);
    ux.notifyModalActionDone('SuggestionModal');
    // @TODO: Handle tracking (ECAN-2228)
  };
  const goToProfileEdition = () => {
    setShowModal(false);
    // @TODO: Handle tracking (ECAN-2228)
    window.top.location.href = `${accountEditionLink}?fieldToFocus=ovh_form_content_activity`;
  };

  useEffect(() => {
    // @TODO: Handle tracking (ECAN-2228)
  }, []);

  if (
    suggestions?.filter((suggestion: Suggestion) =>
      isSuggestionRelevant(suggestion, user),
    ).length === 0
  ) {
    ux.notifyModalActionDone('SuggestionModal');
    return null;
  }

  return (
    showModal && (
      <OsdsModal
        dismissible={false}
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
            {suggestions
              ?.filter((suggestion: Suggestion) =>
                isSuggestionRelevant(suggestion, user),
              )
              .map((suggestion: Suggestion) => (
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
          onClick={goToProfileEdition}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.stroked}
          size={ODS_BUTTON_SIZE.sm}
        >
          {t('suggestion_modal_action_modify')}
        </OsdsButton>

        <OsdsButton
          onClick={closeModal}
          slot="actions"
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.flat}
          size={ODS_BUTTON_SIZE.sm}
        >
          {t('suggestion_modal_action_confirm')}
        </OsdsButton>
      </OsdsModal>
    )
  );
};

export default SuggestionModal;
