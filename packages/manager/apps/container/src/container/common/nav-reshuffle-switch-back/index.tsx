import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useClickAway from 'react-use/lib/useClickAway';

import NavReshuffleSwitchBackModal from './Modal';

import useProductNavReshuffle from '@/core/product-nav-reshuffle';

type Props = {
  onChange(): void;
};

function NavReshuffleSwitchBack({ onChange }: Props): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const { updateBetaChoice, isBeta } = useProductNavReshuffle();
  const ref = useRef();
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    onChange({ show });
  }, [show]);

  useClickAway(ref, () => setShow(false));

  return (
    <>
      {confirm && (
        <NavReshuffleSwitchBackModal
          onCancel={() => setConfirm(false)}
          onConfirm={() => updateBetaChoice(false)}
        />
      )}
      <div className="oui-navbar-dropdown" ref={ref}>
        <button
          className="oui-navbar-link oui-navbar-link_dropdown"
          aria-haspopup={show}
          aria-expanded={show}
          aria-label={t('language_change')}
          title={t('language_change')}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShow(!show);
          }}
        >
          <span className="oui-navbar-link__wrapper">
            {isBeta && (
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
            {!isBeta && (
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
                  {isBeta && (
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
                  {!isBeta && (
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

NavReshuffleSwitchBack.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default NavReshuffleSwitchBack;
