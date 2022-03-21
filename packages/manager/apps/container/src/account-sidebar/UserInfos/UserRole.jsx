import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';

import { getUserRole } from './utils';
import { TRANSLATE_NAMESPACE } from '../constants';

/**
 * Displays user's role.
 * @component
 */
const UserRole = ({ user, cssBaseClassName, translationBase }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const [ role, setRole ] = useState('');

  useEffect(() => {
    setRole(getUserRole(user));
  }, [ user ])

  return (
    <div
      className={`${cssBaseClassName}_user-name mb-2`}
      data-navi-id="account-sidebar-block"
    >
     { role && (
        <div>
          <span
              className={`${cssBaseClassName}_role oui-badge oui-badge_warning`}
          >
            { t(`${translationBase}_role_${role}`) }
          </span>
        </div>
      )}
    </div>
  );
};

UserRole.propTypes = {
  user: PropTypes.shape({
  }).isRequired,
  cssBaseClassName: PropTypes.string,
  translationBase: PropTypes.string,
};

UserRole.defaultProps = {
  user: {},
};

export default UserRole;
