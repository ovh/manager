export default class EtlService {
  /* @ngInject */
  constructor($http, $q, $translate, iceberg, CucPriceHelper, Poller) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.iceberg = iceberg;
    this.CucPriceHelper = CucPriceHelper;
    this.Poller = Poller;

    const workflow1 = {
      description: 'my first workflow',
      sourceId: '29c984bd-293d-4761-a9a4-337a59859799',
      destinationId: '91d4feff-7cf3-47ed-bebe-1d091d8cd101',
      id: 'f1b0ce32-97c6-49e4-8450-cc10353ee4ee',
      name: 'workflow n°1',
      schedule: '1 * * *',
      status: 'READY',
      activated: true,
    };
    const workflow2 = {
      description: 'my second workflow',
      sourceId: '68fd7f20-c817-449e-a6fd-05fc2b47f9b0',
      destinationId: '29c984bd-293d-4761-a9a4-337a59859799',
      id: '430d1ad6-dd28-4254-b07b-d7ccf605e53c',
      name: 'workflow n°2',
      schedule: '1 12 * *',
      status: 'ERROR',
      activated: false,
    };
    const workflow3 = {
      description: 'my third workflow',
      sourceId: '68fd7f20-c817-449e-a6fd-05fc2b47f9b0',
      destinationId: '29c984bd-293d-4761-a9a4-337a59859799',
      id: '430d1ad6-dd28-4254-b07b-d7ccf685e53c',
      name: 'workflow n°3',
      schedule: '1 14 * *',
      status: 'WAITING',
      activated: false,
    };

    const source1 = {
      connectorId: '8495f622-8c3a-4b66-90ea-362105d3ada0',
      creationDate: '2023-04-12T08:45:41+02:00',
      id: workflow1.sourceId,
      lastUpdateDate: '2023-04-10T08:52:41+02:00',
      name: 'Source 1',
      parameters: [],
      status: 'CONNECTION_SUCCEED',
    };
    const source2 = {
      connectorId: '8495f622-8c3a-4b66-90ea-362105d3ada0',
      creationDate: '2023-04-12T08:45:41+02:00',
      id: workflow2.sourceId,
      lastUpdateDate: '2023-04-10T08:52:41+02:00',
      name: 'Source 2',
      parameters: [],
      status: 'CONNECTION_RUNNING',
    };

    const dest1 = {
      connectorId: '8495f622-8c3a-4b66-90ea-362105d3ada0',
      creationDate: '2023-04-11T08:45:41+02:00',
      id: workflow1.destinationId,
      lastUpdateDate: '2023-04-11T08:52:41+02:00',
      name: 'Destination 1',
      parameters: [],
      status: 'CONNECTION_FAILED',
    };
    const dest2 = {
      connectorId: '8495f622-8c3a-4b66-90ea-362105d3ada0',
      creationDate: '2023-04-14T08:45:41+02:00',
      id: workflow2.destinationId,
      lastUpdateDate: '2023-04-14T08:52:41+02:00',
      name: 'Destination 1',
      parameters: [],
      status: 'CONNECTION_RUNNING',
    };

    this.jobs = [
      {
        createdAt: '2023-04-14T08:50:41+02:00',
        endedAt: null,
        id: '0a2a1927-71b6-4040-9583-0466da8e2ed0',
        startedAt: '2023-04-14T08:52:45+02:00',
        status: 'RUNNING',
      },
      {
        createdAt: '2023-04-14T08:51:41+02:00',
        endedAt: '2023-04-16T08:54:41+02:00',
        id: '7a993fa1-1767-4aa9-b68a-ed84f5153763',
        startedAt: '2023-04-14T08:54:41+02:00',
        status: 'COMPLETED',
      },
      {
        createdAt: '2023-04-14T08:52:41+02:00',
        endedAt: null,
        id: '0a2a1927-71b6-4040-9583-0466da8e2ed1',
        startedAt: '2023-04-14T08:53:41+02:00',
        status: 'DELETED',
      },
      {
        createdAt: '2023-04-14T08:53:41+02:00',
        endedAt: null,
        id: '0a2a1927-71b6-4040-9583-0466da8e2ed2',
        startedAt: '2023-04-14T08:52:41+02:00',
        status: 'FAILED',
      },
      {
        createdAt: '2023-04-14T08:54:41+02:00',
        endedAt: null,
        id: '0a2a1927-71b6-4040-9583-0466da8e2ed3',
        startedAt: '2023-04-14T08:52:41+02:00',
        status: 'PROVISIONING',
      },
      {
        createdAt: '2023-04-14T08:55:41+02:00',
        endedAt: null,
        id: '0a2a1927-71b6-4040-9583-0466da8e2ed4',
        startedAt: '2023-04-14T08:52:41+02:00',
        status: 'SUBMITTED',
      },
      {
        createdAt: '2023-04-14T08:56:41+02:00',
        endedAt: null,
        id: '0a2a1927-71b6-4040-9583-0466da8e2ed5',
        startedAt: '2023-04-14T08:52:41+02:00',
        status: 'TERMINATED',
      },
      {
        createdAt: '2023-04-14T08:57:41+02:00',
        endedAt: null,
        id: '0a2a1927-71b6-4040-9583-0466da8e2ed6',
        startedAt: '2023-04-14T08:52:41+02:00',
        status: 'RUNNING',
      },
    ];

    this.workflows = [workflow1, workflow2, workflow3];
    this.sources = [source1, source2];
    this.destinations = [dest1, dest2];
    this.mock = true;
  }

  static getIcebergHeaders() {
    return {
      headers: {
        Pragma: 'no-cache',
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': 50000,
      },
    };
  }

  getAuthorization(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/dataProcessing/authorization`)
      .then(({ data }) => data.authorized);
  }

  getWorkflows(serviceName) {
    if (this.mock) return new Promise((resolve) => resolve(this.workflows));
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/workflows`,
        EtlService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getWorkflow(serviceName, workflowId) {
    if (this.mock)
      return new Promise((resolve) =>
        resolve(this.workflows.filter((w) => w.id === workflowId)[0]),
      );
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/workflows/${workflowId}`,
        EtlService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getJobs(serviceName, workflowId) {
    if (this.mock)
      return new Promise((resolve) =>
        resolve(
          workflowId === this.workflows[2].id
            ? []
            : this.jobs.slice(
                workflowId === this.workflows[0].id ? 0 : this.jobs.length / 2,
                workflowId === this.workflows[0].id
                  ? this.jobs.length / 2
                  : this.jobs.length,
              ),
        ),
      );
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/workflows/${workflowId}/jobs`,
        EtlService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getJob(serviceName, workflowId, jobId) {
    if (this.mock)
      return new Promise((resolve) =>
        resolve(this.jobs.filter((j) => j.id === jobId)[0]),
      );
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/workflows/${workflowId}/jobs/${jobId}`,
        EtlService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getSources(serviceName) {
    if (this.mock) return new Promise((resolve) => resolve(this.sources));
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/sources`,
        EtlService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getSource(serviceName, sourceId) {
    if (this.mock)
      return new Promise((resolve) =>
        resolve(this.sources.filter((s) => s.id === sourceId)[0]),
      );
    return this.$http
      .get(`/cloud/project/${serviceName}/dataIntegration/sources/${sourceId}`)
      .then(({ data }) => data);
  }

  getDestinations(serviceName) {
    if (this.mock) return new Promise((resolve) => resolve(this.destinations));
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/destinations`,
        EtlService.getIcebergHeaders(),
      )
      .then(({ data }) => data);
  }

  getDestination(serviceName, destinationId) {
    if (this.mock)
      return new Promise((resolve) =>
        resolve(this.destinations.filter((d) => d.id === destinationId)[0]),
      );
    return this.$http
      .get(
        `/cloud/project/${serviceName}/dataIntegration/destinations/${destinationId}`,
      )
      .then(({ data }) => data);
  }
}
