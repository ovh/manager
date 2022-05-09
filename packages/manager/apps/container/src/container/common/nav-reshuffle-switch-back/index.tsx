import React, { useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import useClickAway from 'react-use/lib/useClickAway';

import NavReshuffleSwitchBackModal from './Modal';

import useContainer from '@/core/container';

type Props = {
  onChange(show: boolean): void;
};

function NavReshuffleSwitchBack({ onChange }: Props): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const { updateBetaChoice, betaVersion, useBeta } = useContainer();
  const ref = useRef();
  const [show, setShow] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);

  if (!betaVersion) {
    return <></>;
  }

  useEffect(() => {
    onChange(show);
  }, [show]);

  useClickAway(ref, () => setShow(false));

  const switchBack = () => {
    window.open(
      'https://survey.ovh.com/index.php/813778',
      '_blank',
      'noopener',
    );
    updateBetaChoice(false);
  };

  return (
    <>
      {confirm && (
        <NavReshuffleSwitchBackModal
          onCancel={() => setConfirm(false)}
          onConfirm={() => switchBack()}
        />
      )}
      <div className="oui-navbar-dropdown" ref={ref}>
        <button
          className="oui-navbar-link oui-navbar-link_dropdown"
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
                <span className="oui-badge oui-badge_s oui-badge_beta">
                  {t('beta_modal_beta')}
                </span>
                <span className="oui-icon oui-icon-chevron-down ml-2"></span>
              </>
            )}
            {!useBeta && (
              <>
                <span className="oui-navbar-link__text">Version classique</span>
                <span className="oui-icon oui-icon-chevron-down ml-2"></span>
              </>
            )}
          </span>
        </button>
        <div className="oui-navbar-menu__wrapper">
          <div className="oui-navbar-menu oui-navbar-menu_fixed oui-navbar-menu_end">
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
