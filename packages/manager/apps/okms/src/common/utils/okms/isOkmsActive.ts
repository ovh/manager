import { OKMS } from '@key-management-service/types/okms.type';

/**
 * Determines whether non-read actions (POST, PUT, DELETE) can be performed on an OKMS resource and its children.
 * API calls to the OKMS resource or its children (secrets, service keys, credentials,
 * and secret versions) for non-read actions will fail if the OKMS state is not 'OK'.
 *
 * @param okms - The OKMS resource to check.
 * @returns boolean - True if the OKMS state is 'OK' and non-read actions can be performed,
 *                   false otherwise.
 */
export const isOkmsActive = (okms: OKMS | undefined) => okms?.iam?.state == 'OK';
