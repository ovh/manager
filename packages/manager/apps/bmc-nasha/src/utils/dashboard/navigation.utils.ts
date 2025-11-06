import type { NavigateFunction } from 'react-router-dom';

import { urls } from '@/routes/Routes.constants';

/**
 * Builds dashboard URL for a service
 */
export function getDashboardUrl(serviceName: string): string {
  return `${urls.root}/${serviceName}`;
}

/**
 * Builds edit name URL for a service
 */
export function getEditNameUrl(serviceName: string): string {
  return `${urls.root}/${serviceName}/edit-name`;
}

/**
 * Builds partitions create URL for a service
 */
export function getPartitionsCreateUrl(serviceName: string): string {
  return `${urls.root}/${serviceName}/partitions/create`;
}

/**
 * Navigates to edit name page
 */
export function goToEditName(
  serviceName: string,
  navigate: NavigateFunction,
): void {
  navigate(getEditNameUrl(serviceName));
}

/**
 * Navigates to partitions create page
 */
export function goToPartitionsCreate(
  serviceName: string,
  navigate: NavigateFunction,
): void {
  navigate(getPartitionsCreateUrl(serviceName));
}

