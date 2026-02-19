import IcebergUtilsService from '../../icebergUtils.services';
import {
  BACKUP_AGENT_AGENT_STATUS_TO_GLOBAL_STATUS,
  BACKUP_AGENT_GLOBAL_STATUS,
} from './backupAgent.constants';

const moduleName = 'ovhManagerBackupAgentService';

export const URLS = {
  TENANTS: '/engine/api/v2/backupServices/tenant',
  VSPC_TENANTS: (backupServicesId) =>
    `/engine/api/v2/backupServices/tenant/${backupServicesId}/vspc`,
  VSPC_AGENTS: (backupServicesId, vspcTenantId, backupAgentId) =>
    `/engine/api/v2/backupServices/tenant/${backupServicesId}/vspc/${vspcTenantId}/backupAgent/${backupAgentId}`,
};

class BackupAgentService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  getTenants() {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: URLS.TENANTS,
    })
      .then(({ data }) => data)
      .catch(() => []);
  }

  getVspcTenants(backupServicesId) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: URLS.VSPC_TENANTS(backupServicesId),
    }).then(({ data }) => data);
  }

  getAgent(backupServicesId, vspcId, backupAgentId) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: URLS.VSPC_AGENTS(backupServicesId, vspcId, backupAgentId),
    }).then(({ data }) => data);
  }

  static getGlobalStatusOfAgent(agent) {
    return (
      BACKUP_AGENT_AGENT_STATUS_TO_GLOBAL_STATUS[agent.status] ??
      BACKUP_AGENT_GLOBAL_STATUS.NOT_INSTALLED
    );
  }

  getServerBackupAgent(resourceName) {
    return this.getTenants().then(([tenant]) => {
      if (!tenant) {
        return { globalStatus: BACKUP_AGENT_GLOBAL_STATUS.NOT_ENABLED };
      }

      return this.getVspcTenants(tenant.id)
        .then(([vspcTenant]) => {
          const agentLinked = vspcTenant.currentState.backupAgents.find(
            ({ productResourceName }) => productResourceName === resourceName,
          );

          if (!agentLinked) {
            return { globalStatus: BACKUP_AGENT_GLOBAL_STATUS.NOT_INSTALLED };
          }

          return this.getAgent(tenant.id, vspcTenant.id, agentLinked.id).then(
            (agent) => {
              return {
                ...agent,
                globalStatus: BackupAgentService.getGlobalStatusOfAgent(agent),
              };
            },
          );
        })
        .catch(() => {
          return { globalStatus: BACKUP_AGENT_GLOBAL_STATUS.NOT_ENABLED };
        });
    });
  }
}

angular
  .module(moduleName, [IcebergUtilsService])
  .service('BackupAgent', BackupAgentService);

export default moduleName;
