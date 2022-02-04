import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation, Trans } from 'react-i18next';
import { useReket } from '@ovh-ux/ovh-reket';
import PropTypes from 'prop-types';

import { useApplication, useShell } from '@/context';

import {
  connectedToDisconnected,
  connectedToOther,
  disconnectedToConnected,
} from './consts';

import './styles.scss';

const SSOAuthModal = () => {
  const [mode, setMode] = useState('');
  const size = useMemo(() =>
    mode === disconnectedToConnected || mode === connectedToOther ? 'lg' : 'md',
  );
  const shell = useShell();
  const reketInstance = useReket();
  const { t } = useTranslation('sso-auth-modal');
  const show = useMemo(() => !!mode);
  const authPlugin = shell.getPlugin('auth');
  const uxPlugin = shell.getPlugin('ux');
  const { environment } = useApplication();
  const { user } = environment;
  const [connectedUser, setConnectedUser] = useState({});
  const userId = uxPlugin.getUserIdCookie();

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      setMode(uxPlugin.getSSOAuthModalMode(userId));
    });
  }, []);

  useEffect(() => {
    if (mode === disconnectedToConnected || mode === connectedToOther) {
      reketInstance
        .get('/me', {
          requestType: 'apiv6',
          params: {
            target: environment.getRegion(),
            lang: environment.getUserLocale(),
          },
        })
        .then((currentUser) => {
          setConnectedUser(currentUser);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [mode]);

  return (
    <Modal size={size} show={show} backdrop="static" keyboard={false}>
      <Modal.Body>
        <div className="sso-auth">
          <h2 className="oui-modal__title">{t('sso_modal_title')}</h2>
          <div className="row">
            {(mode === connectedToDisconnected ||
              mode === connectedToOther) && (
              <div
                className={
                  mode === connectedToDisconnected ? 'col-md-12' : 'col-md-6'
                }
              >
                <p>{t('sso_modal_user_title')}</p>
                <div
                  className={`panel panel-default ${
                    mode === connectedToOther ? 'panel-disabled' : ''
                  }`}
                >
                  <div className="panel-body">
                    <div className="sso-modal-account-badge-ctnr">
                      <div
                        className="sso-modal-account-badge"
                        aria-hidden="true"
                      >
                        <span className="oui-icon oui-icon-user"></span>
                      </div>
                    </div>

                    <div className="sso-modal-account-infos-ctnr">
                      <div className="sso-modal-account-infos">
                        <strong>{`${user.firstname} ${user.name}`}</strong>
                        <br />
                        <span>{user.email}</span>
                        <br />
                        <span>{user.nichandle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(mode === disconnectedToConnected ||
              mode === connectedToOther) && (
              <div
                className={
                  mode === disconnectedToConnected
                    ? 'col-md-12 span12'
                    : 'col-md-6 span6'
                }
              >
                <p className={mode === connectedToOther ? 'bold' : ''}>
                  {t('sso_modal_currentuser_title')}
                </p>
                <div className="panel panel-default">
                  <div className="panel-body">
                    <div className="sso-modal-account-badge-ctnr">
                      <div
                        className="sso-modal-account-badge"
                        aria-hidden="true"
                      >
                        <span className="oui-icon oui-icon-user"></span>
                      </div>
                    </div>

                    <div className="sso-modal-account-infos-ctnr">
                      <div className="sso-modal-account-infos">
                        <strong>
                          {`${connectedUser?.firstname} ${connectedUser?.name}`}
                        </strong>
                        <br />
                        <span>{connectedUser?.email}</span>
                        <br />
                        <span>{connectedUser?.nichandle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {mode === connectedToDisconnected && (
            <strong>{t('sso_modal_disconnected')}</strong>
          )}
          {(mode === disconnectedToConnected || mode === connectedToOther) && (
            <strong>{t('sso_modal_what')}</strong>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {mode === connectedToDisconnected && (
          <button
            type="button"
            className="oui-button oui-button_primary modal-logout"
            onClick={() => authPlugin.logout()}
          >
            {t('sso_modal_action_logout')}
          </button>
        )}
        {(mode === disconnectedToConnected || mode === connectedToOther) && (
          <button
            type="button"
            className="oui-button oui-button_secondary modal-logout"
            onClick={() => authPlugin.logout()}
          >
            {t('sso_modal_action_logout')}
          </button>
        )}
        {(mode === disconnectedToConnected || mode === connectedToOther) && (
          <button
            type="button"
            className="oui-button oui-button_primary modal-reload"
            onClick={() => window.location.reload()}
          >
            <Trans
              t={t}
              i18nKey="sso_modal_action_reload"
              values={{
                name: `${connectedUser?.firstname} ${connectedUser?.name}`,
              }}
            ></Trans>
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

SSOAuthModal.displayName = 'SSOAuthModal';

SSOAuthModal.propTypes = {
  authPlugin: PropTypes.object,
};

export default SSOAuthModal;
