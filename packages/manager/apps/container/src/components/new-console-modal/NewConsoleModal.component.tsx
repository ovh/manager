import { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import illustration from '@/assets/images/new-console/illustration-nouvelle-console.svg?url';
import { useShell } from '@/context';
import {
  BETA_MANAGER_FEATURE,
  BETA_MANAGER_URL,
} from '@/container/common/nav-reshuffle-switch-back/BetaManagerButton.constants';
import buttonStyle from '@/container/common/nav-reshuffle-switch-back/BetaManagerButton.module.scss';
import {
  NewConsoleModalChoice,
  useNewConsoleModalPreferences,
  useSaveNewConsoleModalPreferences,
} from '@/hooks/useNewConsoleModalPreferences';
import {
  NEW_CONSOLE_MODAL_INTERVAL_IN_MS,
  NEW_CONSOLE_MODAL_TRACKING,
} from './newConsoleModal.constants';

export const NewConsoleModal: FC = () => {
  const { t } = useTranslation('new-console-modal');
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  const trackingPlugin = shell.getPlugin('tracking');

  const { data: availability, isFetched: isAvailabilityFetched } =
    useFeatureAvailability([BETA_MANAGER_FEATURE]);
  const isFeatureAvailable = Boolean(availability?.[BETA_MANAGER_FEATURE]);

  const {
    data: preferences,
    isFetched: isPreferencesFetched,
    isError: isPreferencesError,
  } = useNewConsoleModalPreferences({ enabled: isFeatureAvailable });
  const { mutateAsync: savePreferences } = useSaveNewConsoleModalPreferences();

  const [showModal, setShowModal] = useState(false);
  const hasDecided = useRef(false);

  // Decide once, when every required piece of data is known.
  useEffect(() => {
    if (hasDecided.current || !isAvailabilityFetched) return;
    if (isFeatureAvailable && !isPreferencesFetched) return;
    hasDecided.current = true;

    const isDue =
      !preferences ||
      Date.now() - preferences.lastShowDate >= NEW_CONSOLE_MODAL_INTERVAL_IN_MS;

    if (isFeatureAvailable && !isPreferencesError && isDue) {
      setShowModal(true);
      trackingPlugin.trackPage({ name: NEW_CONSOLE_MODAL_TRACKING.display });
    } else {
      uxPlugin.notifyModalActionDone(NewConsoleModal.name);
    }
  }, [isAvailabilityFetched, isFeatureAvailable, isPreferencesFetched]);

  const storeChoice = useCallback(
    async (lastChoice: NewConsoleModalChoice) => {
      try {
        await savePreferences({
          data: { lastShowDate: Date.now(), lastChoice },
          exists: Boolean(preferences),
        });
      } catch {
        // A failed save only means the modal shows again on the next load.
      }
    },
    [preferences, savePreferences],
  );

  const onClose = useCallback(async () => {
    setShowModal(false);
    trackingPlugin.trackClick({
      name: NEW_CONSOLE_MODAL_TRACKING.close,
      type: 'action',
    });
    await storeChoice('close');
    uxPlugin.notifyModalActionDone(NewConsoleModal.name);
  }, [storeChoice]);

  const onDiscover = useCallback(
    async (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      trackingPlugin.trackClick({
        name: NEW_CONSOLE_MODAL_TRACKING.discover,
        type: 'navigation',
      });
      // The preference must be saved before leaving the page.
      await storeChoice('discover');
      window.location.assign(BETA_MANAGER_URL);
    },
    [storeChoice],
  );

  useEffect(() => {
    if (!showModal) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showModal, onClose]);

  if (!showModal) return null;

  return (
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(0,14,156,0.6)] p-4">
      <div
        // eslint-disable-next-line tailwindcss/no-arbitrary-value
        className="relative w-full max-w-[40rem] overflow-hidden rounded-lg bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-console-modal-title"
        data-testid="new-console-modal"
      >
        <OsdsButton
          className="absolute right-2 top-2"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          circle
          onClick={onClose}
          aria-label={t('new_console_modal_close')}
          data-testid="new-console-modal-close"
        >
          <OsdsIcon
            name={ODS_ICON_NAME.CLOSE}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
            aria-hidden="true"
          />
        </OsdsButton>
        <div className="flex flex-col gap-4 px-8 pb-6 pr-14 pt-8">
          <OsdsText
            id="new-console-modal-title"
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.primary}
            hue={ODS_THEME_COLOR_HUE._800}
          >
            {t('new_console_modal_title')}
          </OsdsText>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('new_console_modal_subtitle')}
          </OsdsText>
        </div>
        <div className="px-8">
          <img
            src={illustration}
            alt=""
            className="block h-auto w-full rounded-md"
          />
        </div>
        <div className="flex px-8 pb-8 pt-6">
          <a
            href={BETA_MANAGER_URL}
            onClick={onDiscover}
            className={buttonStyle.betaManagerButton}
            data-testid="new-console-modal-discover"
          >
            {t('new_console_modal_discover')}
            <span className={buttonStyle.betaTag}>&gt; CONSOLE_</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewConsoleModal;
