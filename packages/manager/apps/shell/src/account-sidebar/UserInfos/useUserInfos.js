import { EXCLUDED_ROLES } from './constants';

/**
 * Manage data required by UserInfos component
 * @return {Object}
 */
const useUserInfos = (user) => {
  /**
   * Get the information of the connected user.
   * @return {Object}
   */
  const getUser = () => {
    return user;
  };

  /**
   * Get the user initials.
   * @return {String} The concatenation of the first char of the user firstname
   *                  with the first char of the use name.
   */
  const getUserNameInitials = () => {
    return `${user.firstname[0]}${user.name[0]}`.toUpperCase();
  };

  const getUserDisplayName = () => {
    return `${user.firstname} ${user.name}`;
  };

  /**
   * Get the support level of the connected user.
   * @return {String}
   */
  const getSupportLevel = () => {
    return user.supportLevel;
  };

  /**
   * Check if the user is flagged as trusted.
   * @return {Boolean}
   */
  const isTrustedUser = () => {
    return user.isTrusted;
  };

  const getUserRole = () => {
    return !EXCLUDED_ROLES.includes(user.auth.method) ? user.auth.method : '';
  };

  return {
    getUser,
    getUserNameInitials,
    getUserDisplayName,
    getSupportLevel,
    isTrustedUser,
    getUserRole,
  };
};

export default useUserInfos;
