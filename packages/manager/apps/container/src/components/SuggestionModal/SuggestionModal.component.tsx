import { useEffect, useMemo, useState } from 'react';
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
import { isSuggestionRelevant } from '@/helpers/suggestions/suggestionsHelper';

const SuggestionModal = (): JSX.Element => {
  const { t } = useTranslation('suggestion-modal');
  const { shell } = useApplication();
  const environment = shell.getPlugin('environment').getEnvironment();
  const user = environment.getUser();
  const ux = shell.getPlugin('ux');
  const appName = environment.getApplicationURL('new-account')
    ? 'new-account'
    : 'dedicated';
  const accountEditionLink = shell
    .getPlugin('navigation')
    .getURL(appName, '#/useraccount/infos');

  const [showModal, setShowModal] = useState(true);
  const { data } = useModals();
  const suggestions: Suggestion[] = useMemo(() => 
    (data as Suggestion[] | undefined)?.filter((suggestion: Suggestion) =>
      isSuggestionRelevant(suggestion, user),
    ) || [],
    [data],
  );

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

  if (suggestions.length === 0) {
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
