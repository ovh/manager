import { EXCLUDED_ROLES } from './constants';

/**
 * Formats the user name as initials.
 * @param {Object} user
 * @returns {string} Formatted user initials
 */
export function getUserNameInitials(user) {
  return user.firstname && user.name
    ? `${user.firstname[0]}${user.name[0]}`.toUpperCase()
    : '';
}

/**
 * Formats the user name as a displayable name.
 * @param {Object} user
 * @returns {string} Formatted user name
 */
export function getUserDisplayName(user) {
  return `${user.firstname} ${user.name}`;
}

/**
 * Returns the support level of the user.
 * @param {Object} user
 * @returns {string} user support level
 */
export function getSupportLevel(user) {
  return user.supportLevel;
}

/**
 * Check whether or not the user is flagged as trusted.
 * @param {Object} user
 * @returns {boolean}
 */
export function isTrustedUser(user) {
  return user.isTrusted;
}

/**
 * Returns the role associated to the user.
 * @param {Object} user
 * @returns {string}
 */
export function getUserRole(user) {
  return !EXCLUDED_ROLES.includes(user?.auth?.method) ? user?.auth?.method : '';
}
