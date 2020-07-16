import { keyBy } from 'lodash';
import { summarizeJob } from './data-processing.utils';

export default class DataProcessingService {
  /* @ngInject */
  constructor($q, CucPriceHelper, OvhApiCloudProjectDataProcessing) {
    this.logs = [];
    this.$q = $q;
    this.CucPriceHelper = CucPriceHelper;
    this.OvhApiCloudProjectDataProcessingJobs = OvhApiCloudProjectDataProcessing.Jobs().iceberg();
    this.OvhApiCloudProjectDataProcessingCapabilities = OvhApiCloudProjectDataProcessing.Capabilities().iceberg();
    this.OvhApiCloudProjectDataProcessingAuthorization = OvhApiCloudProjectDataProcessing.Authorization().iceberg();
    this.OvhApiCloudProjectDataProcessingMetrics = OvhApiCloudProjectDataProcessing.Metrics().iceberg();
  }

  /**
   * Retrieve authorization status
   * @param projectId string Project to list activations from
   * @return {Promise<any>}
   */
  getAuthorization(projectId) {
    return this.OvhApiCloudProjectDataProcessingAuthorization.query().execute({
      serviceName: projectId,
    }).$promise;
  }

  /**
   * Authorize project with the given id
   * @param projectId string Project id to activate
   * @return {*}
   */
  authorize(projectId) {
    return this.OvhApiCloudProjectDataProcessingAuthorization.post().execute({
      serviceName: projectId,
    }).$promise;
  }

  /**
   * Retrieve list of jobs
   * @param projectId string List jobs related to this project id
   * @param offset int Offset to start from
   * @param pageSize int Number of results to retrieve from API
   * @param sort string Name of field to sort from
   * @param filters Array List of Iceberg filters to apply
   * @return {Promise<any>}
   */
  getJobs(
    projectId,
    offset = 0,
    pageSize = 25,
    sort = 'creationDate',
    filters = null,
  ) {
    let res = this.OvhApiCloudProjectDataProcessingJobs.query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(offset)
      .sort(sort, 'desc');
    if (filters !== null) {
      filters.forEach((filter) => {
        res = res.addFilter(filter.name, filter.operator, filter.value);
      });
    }
    // The execute function will skip the cache as the job status are changing too quickly and can create an understanding problem for the service user
    return res
      .execute({ serviceName: projectId }, true)
      .$promise.then((jobs) => {
        return {
          data: jobs.data.map((job) => summarizeJob(job)),
          meta: {
            totalCount: jobs.headers['x-pagination-elements'],
          },
        };
      });
  }

  /**
   * Retrieve a single job
   * @param projectId string Project id containing the job
   * @param jobId string Job id
   * @return {Promise<any>}
   */
  getJob(projectId, jobId) {
    // The execute function will skip the cache as the job status are changing too quickly and can create an understanding problem for the service user
    return this.OvhApiCloudProjectDataProcessingJobs.get()
      .execute(
        {
          serviceName: projectId,
          jobId,
        },
        true,
      )
      .$promise.then((job) => summarizeJob(job.data));
  }

  /**
   * Retrieve capabilities
   * @param projectId string Project to get capabilities from
   * @return {Promise<any>}
   */
  getCapabilities(projectId) {
    return this.OvhApiCloudProjectDataProcessingCapabilities.query()
      .execute({ serviceName: projectId })
      .$promise.then((capabilities) => keyBy(capabilities.data, (e) => e.name));
  }

  /**
   * Submit a new job to the API
   * @param projectId string Id of the project to submit job to
   * @param job Job object
   * @return {Promise<any>}
   */
  submitJob(projectId, job) {
    return this.OvhApiCloudProjectDataProcessingJobs.post().execute({
      serviceName: projectId,
      ...job,
    }).$promise;
  }

  /**
   * Terminate a running job
   * @param projectId string Id of the project
   * @param jobId string Id of the job to terminate
   * @return {Promise<any>}
   */
  terminateJob(projectId, jobId) {
    return this.OvhApiCloudProjectDataProcessingJobs.delete().execute({
      serviceName: projectId,
      jobId,
    }).$promise;
  }

  /**
   * Retrieve logs from a job
   * @param projectId string Id of the project
   * @param jobId string Id of the job to terminate
   * @param from string From how long ago we want logs.
   * Example: from=now-2h. Or since when we want the logs.
   * Example: 2019-10-28T12:00:00.000 (must be UTC).
   * @return {*}
   */
  getLogs(projectId, jobId, from) {
    // The execute function will skip the cache as the logs are changing too quickly and can create an understanding problem for the service user
    return this.OvhApiCloudProjectDataProcessingJobs.logs()
      .execute(
        {
          serviceName: projectId,
          from,
          jobId,
        },
        true,
      )
      .$promise.then((res) => res.data);
  }

  /**
   * Retrieve metrics token for the given project
   * @param projectId string Id of the project
   * @return {*}
   */
  getMetricsToken(projectId) {
    return this.OvhApiCloudProjectDataProcessingMetrics.query().execute({
      serviceName: projectId,
    }).$promise;
  }

  /**
   * Retrieve the data processing cores and memory prices from the catalog
   * @param projectId string Id of the project
   * @returns {Promise<{core: *, memory: *}>}
   */
  getPricesFromCatalog(projectId) {
    return this.CucPriceHelper.getPrices(projectId).then((prices) => {
      return {
        core: prices[`data-processing-job.core.minute.consumption`],
        memory: prices[`data-processing-job.memory-gib.minute.consumption`],
      };
    });
  }
}
