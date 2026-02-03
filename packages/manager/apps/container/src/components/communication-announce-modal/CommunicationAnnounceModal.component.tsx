import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import backgroundImage from '@/assets/images/pnr/background.png';
import { useCreatePreference } from '@/data/hooks/preferences/usePreferences';
import { COMMUNICATION_ANNOUNCE_MODAL_PREFERENCE } from './communicationAnnounceModal.constants';
import { useCheckModalDisplay } from '@/hooks/modal/useModal';
import { useShell } from '@/context';

export const CommunicationAnnounceModal: FC = () => {
  const { t } = useTranslation('communication-announce-modal');
  const shell = useShell();
  const navigationPlugin = shell.getPlugin('navigation');
  const uxPlugin = shell.getPlugin('ux');
  const { mutateAsync: updateCommunicationAnnounceModalPreference } = useCreatePreference(COMMUNICATION_ANNOUNCE_MODAL_PREFERENCE, false);

  const shouldDisplayModal = useCheckModalDisplay(
    undefined,
    undefined,
    undefined,
    COMMUNICATION_ANNOUNCE_MODAL_PREFERENCE,
    Infinity,
  );

  const [showModal, setShowModal] = useState<boolean>(shouldDisplayModal);

  const onConfirm = useCallback(async () => {
    try {
      await updateCommunicationAnnounceModalPreference(true);
    } catch {}
    finally {
      setShowModal(false);
      navigationPlugin.navigateTo('communication', `#/`);
    }
  }, [updateCommunicationAnnounceModalPreference, navigationPlugin]);

  const onCancel = useCallback(async () => {
    try {
      await updateCommunicationAnnounceModalPreference(true);
    } catch {}
    finally {
      setShowModal(false);
      uxPlugin.notifyModalActionDone(CommunicationAnnounceModal.name);
    }
  }, [uxPlugin, updateCommunicationAnnounceModalPreference]);

  useEffect(() => {
    if (shouldDisplayModal === true) {
      setShowModal(true);
    }
    if (shouldDisplayModal === false) {
      uxPlugin.notifyModalActionDone(CommunicationAnnounceModal.name);
    }
  }, [shouldDisplayModal]);

  if (!showModal) return null;

  return (
    // eslint-disable-next-line tailwindcss/no-arbitrary-value
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(0,80,215,0.75)]">
      <div
        // eslint-disable-next-line tailwindcss/no-arbitrary-value
        className="min-w-[30rem] max-w-[40rem] bg-white bg-cover p-8"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-row gap-4">
          <div className="flex w-2/3 flex-col gap-4">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._300}
              color={ODS_THEME_COLOR_INTENT.primary}
              hue={ODS_THEME_COLOR_HUE._500}
              className="font-semibold"
            >
              {t('communication_announce_modal_title')}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              hue={ODS_THEME_COLOR_HUE._500}
              className="mt-2"
            >
              {t('communication_announce_modal_info')}
            </OsdsText>
            <div className="mt-4 flex flex-col items-start gap-4">
              <OsdsButton
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.flat}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={onConfirm}
              >
                {t('communication_announce_modal_accept')}
              </OsdsButton>
              <OsdsButton
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.ghost}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={onCancel}
              >
                <span className="flex items-center gap-2">
                  {t('communication_announce_modal_decline')}
                  <OsdsIcon
                    name={ODS_ICON_NAME.ARROW_RIGHT}
                    size={ODS_ICON_SIZE.xs}
                    aria-hidden="true"
                  />
                </span>
              </OsdsButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
