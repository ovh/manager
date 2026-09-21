export class UnresolvableBackupAgentServiceError extends Error {
  constructor() {
    super('No Backup Agent service could be resolved on this account');
    this.name = 'UnresolvableBackupAgentServiceError';
  }
}
