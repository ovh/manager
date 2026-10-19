import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '@/context';
import { toScreamingSnakeCase } from '@/helpers';
import { useCheckModalDisplay } from '@/hooks/modal/useModal';
import { useTime } from '@/data/hooks/time/useTime';
import { useCreatePreference } from '@/data/hooks/preferences/usePreferences';
import { useSuggestionTargetUrl } from '@/data/hooks/suggestion/useSuggestion';
import { ComplianceReminderModal } from './ComplianceReminderModal.component';
import {
  MISSING_CNIN_INTERVAL_IN_S,
  MISSING_CNIN_MODAL_NAME,
  TRACKING_CONTEXT,
  TRACKING_PREFIX,
} from './complianceReminderModal.constants';
import {
  isUserConcernedByMissingCnin,
  missingCninDescriptionKey,
  missingCninFieldToFocus,
} from './complianceReminderModal.helpers';

/**
 * F1 missing CNIN — reminds a customer flagged with the missing-CNIN
 * certificate (FR/TR) to fill their company identification number. At most
 * once an hour (preference + server time); skipped on the account-edition page.
 */
const MissingCninModal: FC = () => {
  const { shell } = useApplication();
  const ux = shell.getPlugin('ux');
  const tracking = shell.getPlugin('tracking');
  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();
  const { t } = useTranslation('missing-cnin-modal');
  const preferenceKey = toScreamingSnakeCase(MISSING_CNIN_MODAL_NAME);
  const accountEditionLink = useSuggestionTargetUrl();

  const shouldDisplayModal = useCheckModalDisplay(
    undefined,
    undefined,
    undefined,
    preferenceKey,
    MISSING_CNIN_INTERVAL_IN_S,
    isUserConcernedByMissingCnin,
    [accountEditionLink],
  );
  const [showModal, setShowModal] = useState(false);
  const { data: time } = useTime({ enabled: Boolean(shouldDisplayModal) });
  const { mutate: updatePreference } = useCreatePreference(
    preferenceKey,
    false,
  );

  const onLater = useCallback(() => {
    setShowModal(false);
    updatePreference(time);
    ux.notifyModalActionDone(MISSING_CNIN_MODAL_NAME);
    tracking.trackClick({
      name: `${TRACKING_PREFIX}::pop-up::button::missing_cnin::later`,
      type: 'action',
      ...TRACKING_CONTEXT,
    });
  }, [ux, time]);

  const onUpdate = useCallback(() => {
    setShowModal(false);
    updatePreference(time);
    tracking.trackClick({
      name: `${TRACKING_PREFIX}::pop-up::button::missing_cnin::update`,
      type: 'action',
      ...TRACKING_CONTEXT,
    });
    window.top.location.href = `${accountEditionLink}?fieldToFocus=${missingCninFieldToFocus(
      user?.country,
    )}`;
  }, [accountEditionLink, time, user]);

  useEffect(() => {
    if (shouldDisplayModal === undefined) return;
    setShowModal(shouldDisplayModal);
    if (!shouldDisplayModal) {
      ux.notifyModalActionDone(MISSING_CNIN_MODAL_NAME);
    } else {
      tracking.trackPage({
        name: `${TRACKING_PREFIX}::pop-up::missing_cnin`,
        ...TRACKING_CONTEXT,
      });
    }
  }, [shouldDisplayModal]);

  return (
    showModal && (
      <ComplianceReminderModal
        testId="missing-cnin-modal"
        title={t('missing_cnin_modal_title')}
        description={t(missingCninDescriptionKey(user?.country))}
        laterLabel={t('missing_cnin_modal_action_later')}
        updateLabel={t('missing_cnin_modal_action_update')}
        onLater={onLater}
        onUpdate={onUpdate}
      />
    )
  );
};

MissingCninModal.displayName = MISSING_CNIN_MODAL_NAME;

export default MissingCninModal;
