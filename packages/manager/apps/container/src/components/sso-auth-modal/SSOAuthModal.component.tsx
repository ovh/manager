import React, { useState, useEffect, useMemo } from 'react';

import { v6 } from '@ovh-ux/manager-core-api';
import { useTranslation, Trans } from 'react-i18next';
import { User } from '@ovh-ux/manager-config';

import {
  OsdsButton,
  OsdsModal,
  OsdsText,
  OsdsChip,
  OsdsIcon,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_CHIP_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Subtitle } from '@ovh-ux/manager-react-components';
import {
  connectedToDisconnected,
  connectedToOther,
  disconnectedToConnected,
} from './ssoAuthModal.constants';
import { useApplication, useShell } from '@/context';

const ModalContent = ({ children }: { children: React.ReactNode }) => (
  <OsdsText
    level={ODS_TEXT_LEVEL.caption}
    color={ODS_THEME_COLOR_INTENT.text}
    size={ODS_TEXT_SIZE._300}
    hue={ODS_TEXT_COLOR_HUE._500}
  >
    {children}
  </OsdsText>
);
const SSOAuthModal = (): JSX.Element => {
  const [mode, setMode] = useState('');
  const shell = useShell();
  const { t } = useTranslation('sso-auth-modal');
  const show = useMemo(() => !!mode, [mode]);
  const authPlugin = shell.getPlugin('auth');
  const uxPlugin = shell.getPlugin('ux');
  const { environment } = useApplication();
  const { user } = environment;
  const [connectedUser, setConnectedUser] = useState<User>({} as User);
  const userId = uxPlugin.getUserIdCookie();

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      setMode(uxPlugin.getSSOAuthModalMode(userId));
    });
  }, []);

  useEffect(() => {
    if (mode === disconnectedToConnected || mode === connectedToOther) {
      v6.get<User>('/me').then(({ data: currentUser }: { data: User }) => {
        setConnectedUser(currentUser);
      }).catch(() => {});
    }
  }, [mode]);

  return (
    <>
      {show && (
        <OsdsModal onOdsModalClose={() => setMode('')}>
          <div>
            <Subtitle>{t('sso_modal_title')}</Subtitle>
            <div className="row p-3">
              {[connectedToDisconnected, connectedToOther].includes(mode) && (
                <div
                  className={
                    mode === connectedToDisconnected ? 'md:w-full' : 'md:w-1/2'
                  }
                >
                  <div className="mb-2">
                    <ModalContent>{t('sso_modal_user_title')}</ModalContent>
                  </div>
                  <OsdsTile>
                    <span
                      slot="start"
                      className="p-4 flex flex-wrap items-start"
                    >
                      <OsdsChip inline size={ODS_CHIP_SIZE.md}>
                        <OsdsIcon
                          name={ODS_ICON_NAME.USER}
                          size={ODS_ICON_SIZE.xs}
                        />
                      </OsdsChip>

                      <div className="inline-block ml-2">
                        <OsdsText className="break-all">
                          <div className="mr-2 font-bold">{`${user.firstname} ${user.name}`}</div>
                          <span className="block">{user.email}</span>
                          <span className="block">{user.nichandle}</span>
                        </OsdsText>
                      </div>
                    </span>
                  </OsdsTile>
                </div>
              )}
              {[disconnectedToConnected, connectedToOther].includes(mode) && (
                <div
                  className={
                    mode === disconnectedToConnected
                      ? 'pl-4 md:w-full'
                      : 'pl-4 md:w-1/2'
                  }
                >
                  <div className="mb-2">
                    <ModalContent>
                      {t('sso_modal_currentuser_title')}
                    </ModalContent>
                  </div>
                  <OsdsTile>
                    <span
                      slot="start"
                      className="p-4 flex flex-wrap items-start"
                    >
                      <OsdsChip inline size={ODS_CHIP_SIZE.md}>
                        <OsdsIcon
                          name={ODS_ICON_NAME.USER}
                          size={ODS_ICON_SIZE.xs}
                        />
                      </OsdsChip>

                      <div className="inline-block ml-2">
                        <OsdsText className="break-all">
                          <div className="mr-2 font-bold">
                            {`${connectedUser?.firstname} ${connectedUser?.name}`}
                          </div>
                          <span className="block">{connectedUser?.email}</span>
                          <span className="block">
                            {connectedUser?.nichandle}
                          </span>
                        </OsdsText>
                      </div>
                    </span>
                  </OsdsTile>
                </div>
              )}
            </div>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              hue={ODS_TEXT_COLOR_HUE._900}
            >
              {mode === connectedToDisconnected && (
                <strong>{t('sso_modal_disconnected')}</strong>
              )}
              {[disconnectedToConnected, connectedToOther].includes(mode) && (
                <strong className="flex justify-end">
                  {t('sso_modal_what')}
                </strong>
              )}
            </OsdsText>
          </div>

          {[
            connectedToDisconnected,
            disconnectedToConnected,
            connectedToOther,
          ].includes(mode) && (
            <OsdsButton
              slot="actions"
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => authPlugin.logout()}
            >
              {t('sso_modal_action_logout')}
            </OsdsButton>
          )}
          {[disconnectedToConnected, connectedToOther].includes(mode) && (
            <OsdsButton
              slot="actions"
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.flat}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => window.location.reload()}
            >
              <Trans
                t={t}
                i18nKey="sso_modal_action_reload"
                values={{
                  name: `${connectedUser?.firstname} ${connectedUser?.name}`,
                }}
              ></Trans>
            </OsdsButton>
          )}
        </OsdsModal>
      )}
    </>
  );
};

SSOAuthModal.displayName = 'SSOAuthModal';

export default SSOAuthModal;