export const IAM_ACTIONS = {
  backupServicesGet: 'backupServices:apiovh:get',
  vaultGet: 'backupServices:apiovh:vault/get',
  vaultEdit: 'backupServices:apiovh:vault/edit',
  vaultCredentialsGet: 'backupServices:apiovh:vault/credentials/get',
  servicesGet: 'account:apiovh:services/get',
  servicesTerminate: 'account:apiovh:services/terminate',
  servicesTerminateWithoutConfirmation: 'account:apiovh:services/terminateWithoutConfirmation',
} as const;

export const TERMINATION_DELETE_SUBSIDIARY = 'US';

/**
 * The two termination forms are guarded by two different actions, so the gate has to follow the call
 * `useDeleteService` (manager-module-common-api) actually sends: `DELETE /services/{id}`
 * (`services/terminateWithoutConfirmation`) for the US subsidiary, `POST /services/{id}/terminate`
 * (`services/terminate`) everywhere else. Both branches first resolve the `serviceId` through
 * `GET /services?resourceName=`, hence `services/get`.
 */
export const getTerminateIamActions = (ovhSubsidiary?: string): string[] => [
  IAM_ACTIONS.servicesGet,
  ovhSubsidiary === TERMINATION_DELETE_SUBSIDIARY
    ? IAM_ACTIONS.servicesTerminateWithoutConfirmation
    : IAM_ACTIONS.servicesTerminate,
];
