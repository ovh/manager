import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';

import { isTrustedUser, getSupportLevel } from './utils';
import { TRANSLATE_NAMESPACE } from '../constants';

/**
 * Displays user's support level.
 * @component
 */
const UserSupportLevel = ({ user, cssBaseClassName, translationBase }) => {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const [ level, setLevel ] = useState(getSupportLevel(user));

  useEffect(() => {
    setLevel(getSupportLevel(user));
  }, [ user ]);

  return (
    <p className="oui-chip mb-1">
      <span className={`${cssBaseClassName}_text-small`}>
        {t(
          `${translationBase}_support_level_${level}${
            isTrustedUser(user) ? '_trusted' : ''
          }`,
        )}
      </span>
    </p>
  );
};

UserSupportLevel.propTypes = {
  user: PropTypes.shape({
    auth: PropTypes.shape({
      method: PropTypes.string,
    }),
  }).isRequired,
  cssBaseClassName: PropTypes.string,
  translationBase: PropTypes.string,
};

UserSupportLevel.defaultProps = {
  user: {},
  translationBase: 'user_infos',
};

export default UserSupportLevel;
