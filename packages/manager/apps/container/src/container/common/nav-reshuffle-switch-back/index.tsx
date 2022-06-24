import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import { useTranslation } from 'react-i18next';
import useClickAway from 'react-use/lib/useClickAway';

import NavReshuffleSwitchBackModal from './Modal';

import useContainer from '@/core/container';
import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';
import { useShell } from '@/context';

type Props = {
  onChange(show: boolean): void;
};

function NavReshuffleSwitchBack({ onChange }: Props): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const { updateBetaChoice, betaVersion, useBeta } = useContainer();
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const ref = useRef();
  const [show, setShow] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });

  useEffect(() => {
    onChange(show);
  }, [show]);

  useClickAway(ref, () => setShow(false));

  const switchBack = (openSurvey = false) => {
    if (openSurvey) {
      window.open(
        'https://survey.ovh.com/index.php/813778',
        '_blank',
        'noopener',
      );
    }
    updateBetaChoice(false);
  };

  if (!betaVersion) {
    return <></>;
  }

  return (
    <>
      {confirm && (
        <NavReshuffleSwitchBackModal
          onCancel={() => {
            setConfirm(false);
          }}
          onConfirm={(openSurvey = false) => {
            switchBack(openSurvey);
          }}
        />
      )}
      <div className="oui-navbar-dropdown" ref={ref}>
        <button
          className={`oui-navbar-link oui-navbar-link_dropdown ${
            isSmallDevice ? 'p-0' : ''
          }`}
          aria-haspopup={show}
          aria-expanded={show}
          aria-label={t('beta_switch')}
          title={t('beta_switch')}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShow(!show);
          }}
        >
          <span className="oui-navbar-link__wrapper">
            {useBeta && (
              <>
                <span className="oui-navbar-link__text">
                  {t('beta_modal_new')}
                </span>
                {!isSmallDevice && (
                  <>
                    <span className="oui-badge oui-badge_s oui-badge_beta">
                      {t('beta_modal_beta')}
                    </span>

                    <span className="oui-icon oui-icon-chevron-down ml-2"></span>
                  </>
                )}
              </>
            )}
            {!useBeta && (
              <>
                <span className="oui-navbar-link__text">
                  {t('beta_modal_old')}
                </span>
                <span className="oui-icon oui-icon-chevron-down ml-2"></span>
              </>
            )}
          </span>
        </button>
        <div className="oui-navbar-menu__wrapper">
          <div className="oui-navbar-menu">
            <div className="oui-navbar-list_dropdown">
              <ul className="oui-navbar-list">
                <li className="oui-navbar-list__item">
                  {useBeta && (
                    <button
                      className="oui-navbar-link oui-navbar-link_tertiary"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirm(true);
                        trackingPlugin.trackClick({
                          name: 'topnav::switch_version::go_to_old_version',
                          type: 'navigation',
                        });
                      }}
                    >
                      {t('beta_modal_old')}
                    </button>
                  )}
                  {!useBeta && (
                    <button
                      className="oui-navbar-link oui-navbar-link_tertiary"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        updateBetaChoice(true);
                        trackingPlugin.trackClick({
                          name: 'topnav::switch_version::go_to_new_version',
                          type: 'navigation',
                        });
                      }}
                    >
                      <span className="oui-navbar-link__text">
                        {t('beta_modal_new')}
                      </span>
                      <span className="oui-badge oui-badge_s oui-badge_beta">
                        {t('beta_modal_beta')}
                      </span>
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavReshuffleSwitchBack;
