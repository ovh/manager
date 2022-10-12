import { SupportLevel, User } from '@ovh-ux/manager-config';

import { EXCLUDED_ROLES } from './constants';

interface UseUserInfos {
  getUser(): User;
  getUserNameInitials(): string;
  getUserDisplayName(): string;
  getSupportLevel(): SupportLevel;
  isTrustedUser(): boolean;
  getUserRole(): string;
}

/**
 * Manage data required by UserInfos component
 * @return {Object}
 */
const useUserInfos = (user: User): UseUserInfos => {
  /**
   * Get the information of the connected user.
   * @return {Object}
   */
  const getUser = (): User => {
    return user;
  };

  /**
   * Get the user initials.
   * @return {String} The concatenation of the first char of the user firstname
   *                  with the first char of the use name.
   */
  const getUserNameInitials = (): string => {
    return `${user.firstname[0]}${user.name[0]}`.toUpperCase();
  };

  const getUserDisplayName = (): string => {
    return `${user.firstname} ${user.name}`;
  };

  /**
   * Get the support level of the connected user.
   * @return {String}
   */
  const getSupportLevel = (): SupportLevel => {
    return user.supportLevel;
  };

  /**
   * Check if the user is flagged as trusted.
   * @return {Boolean}
   */
  const isTrustedUser = (): boolean => {
    return user.isTrusted;
  };

  const getUserRole = (): string => {
    return !EXCLUDED_ROLES.includes(user?.auth?.method)
      ? user?.auth?.method
      : '';
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
