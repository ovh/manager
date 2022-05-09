import React from 'react';

import { useTranslation } from 'react-i18next';

import style from './style.module.scss';

type Props = {
  onCancel(): void;
  onConfirm(showModal?: boolean): void;
};

function NavReshuffleSwitchBackModal({
  onCancel,
  onConfirm,
}: Props): JSX.Element {
  const { t } = useTranslation('beta-modal');
  return (
    <div className={style.backdrop} onClick={onCancel}>
      <div className={style.modal}>
        <h1>{t('beta_modal_switch_title')}</h1>
        <p>{t('beta_modal_switch_infos')}</p>
        <button
          type="button"
          className="oui-button oui-button_primary float-right"
          onClick={() => onConfirm(true)}
        >
          {t('beta_modal_switch_accept')}
        </button>
        <button
          type="button"
          className="oui-button oui-button_secondary float-right mr-2"
          onClick={() => onConfirm()}
        >
          {t('beta_modal_switch_later')}
        </button>
      </div>
    </div>
  );
}

export default NavReshuffleSwitchBackModal;
