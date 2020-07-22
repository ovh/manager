import Job from './job.class';

export default class PciProjectTrainingJobsService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  submit(projectId, jobSpec) {
    return this.OvhApiCloudProjectAi.Training()
      .Job()
      .v6()
      .save({ serviceName: projectId }, jobSpec)
      .$promise.then(
        (job) =>
          new Job({
            ...job,
          }),
      );
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectAi.Training()
      .Job()
      .v6()
      .query({ serviceName: projectId })
      .$promise.then((jobs) => jobs.map((job) => new Job({ ...job })));
  }

  get(projectId, jobId) {
    // Uncomment when iceberg proded
    return this.OvhApiCloudProjectAi.Training()
      .Job()
      .v6()
      .get({
        serviceName: projectId,
        jobId,
      })
      .$promise.then(
        (job) =>
          new Job({
            ...job,
          }),
      );
  }
}
