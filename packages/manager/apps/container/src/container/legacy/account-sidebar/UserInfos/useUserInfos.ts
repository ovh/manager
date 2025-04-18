import { SupportLevel, User } from '@ovh-ux/manager-config';

interface UseUserInfos {
  getUser(): User;
  getUserNameInitials(): string;
  getUserDisplayName(): string;
  getSupportLevel(): SupportLevel;
  isSubUser(): boolean;
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

  const getUserRole = (): string => {
    return user?.auth?.method || '';
  };

  /**
   * Check if the user is a sub-user.
   * @return {Boolean}
   */
  const isSubUser = (): boolean => {
    return ['provider', 'user'].includes(getUserRole());
  };

  const getUserDisplayName = (): string => {
    return isSubUser() ? user.auth.user : `${user.firstname} ${user.name}`;
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

  return {
    getUser,
    getUserNameInitials,
    getUserDisplayName,
    getSupportLevel,
    isTrustedUser,
    getUserRole,
    isSubUser,
  };
};

export default useUserInfos;
