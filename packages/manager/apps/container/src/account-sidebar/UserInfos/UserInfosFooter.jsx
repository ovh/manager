import React from 'react';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

import { TRANSLATE_NAMESPACE } from '../constants';

/**
 * Displays a footer which allows to logout.
 * @component
 */
const UserInfosFooter = ({ cssBaseClassName, translationBase }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();

  const logoutHandler = () => {
    shell.getPlugin('tracking').trackClick({
      name: 'hub::sidebar::profile::go-to-log-out',
      type: 'action',
    });
    shell.getPlugin('auth').logout();
  };

  return (
    <div className={`text-left ${cssBaseClassName}_links`}>
      <hr className="my-1" />
      <button
        aria-label={`${translationBase}_footer_logout`}
        type="button"
        role="button"
        className="btn btn-link"
        data-navi-id="logout"
        onClick={logoutHandler}
      >
        {t(`${translationBase}_footer_logout`)}
      </button>
    </div>
  );
};

UserInfosFooter.propTypes = {
  cssBaseClassName: PropTypes.string,
  translationBase: PropTypes.string,
};

export default UserInfosFooter;
