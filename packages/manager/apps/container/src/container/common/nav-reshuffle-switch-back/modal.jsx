import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import style from './style.module.scss';

export default function NavReshuffleSwitchBackModal({ onCancel, onConfirm }) {
  const { t } = useTranslation('beta-modal');
  return (
    <div className={style.backdrop}>
      <div className={style.modal}>
        <h1>{t('beta_modal_switch_title')}</h1>
        <p>{t('beta_modal_switch_infos')}</p>
        <button
          type="button"
          className="oui-button oui-button_primary float-right"
          onClick={onConfirm}
        >
          {t('beta_modal_switch_accept')}
        </button>
        <button
          type="button"
          className="oui-button oui-button_secondary float-right mr-2"
          onClick={onCancel}
        >
          {t('beta_modal_switch_cancel')}
        </button>
      </div>
    </div>
  );
}

NavReshuffleSwitchBackModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

NavReshuffleSwitchBackModal.defaultProps = {
  onCancel: () => {},
  onConfirm: () => {},
};
