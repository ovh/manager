import { TApiCustomError } from '@ovh-ux/manager-core-api';

import { VaultOrderChannel, setVaultOrderChannel } from '@/data/api/vaults/vaults.requests';

/**
 * What the ordering channel answers, chosen rather than served: BKP-1223's route is undelivered, so
 * there is nothing for MSW to intercept and the outcome is installed on the channel itself. It sits
 * beside the MSW handlers and is driven by the same `setupMswMock` params, so `accepted` chains into
 * `vaultCreatingCallsBeforeReady` — a mocked order lands on a list that is still provisioning.
 *
 * The day the channel is published this file mocks the route instead, and the params keep their names.
 */
export type VaultOrderOutcome = 'accepted' | 'name-rejected' | 'error';

export type TVaultOrderMockParams = {
  vaultOrderOutcome?: VaultOrderOutcome;
};

const apiFailure = (status: number, message: string): TApiCustomError =>
  ({ response: { status, data: { class: 'Client::BadRequest', message } } }) as TApiCustomError;

const CHANNELS: Record<VaultOrderOutcome, VaultOrderChannel> = {
  accepted: () => Promise.resolve(),
  'name-rejected': () => Promise.reject(apiFailure(409, 'This vault name is already taken')),
  error: () => Promise.reject(apiFailure(500, 'Internal server error')),
};

export const installVaultOrderChannel = ({ vaultOrderOutcome }: TVaultOrderMockParams): void =>
  setVaultOrderChannel(vaultOrderOutcome && CHANNELS[vaultOrderOutcome]);
