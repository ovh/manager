import omit from 'lodash/omit';
import Job from './job.class';

export default class PciProjectTrainingJobService {
  /* @ngInject */
  constructor($http, OvhApiCloudProjectAi) {
    this.$http = $http;
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

  resubmit(projectId, jobSpec) {
    let toSubmit = jobSpec;
    if (Object.prototype.hasOwnProperty.call(jobSpec, 'shutdown')) {
      // remove shutdown before submitting as it is forbidden server side and irrelevant when resubmitting
      toSubmit = (({ shutdown, ...j }) => j)(jobSpec);
    }
    if (jobSpec.volumes) {
      // API does not accept volumes' internal property. We remove it before sending the request.
      toSubmit.volumes = jobSpec.volumes.flatMap((volume) => {
        let toRemove = false;
        const internalKeys = [];
        let filteredVolume = volume;
        Object.keys(volume).forEach((key) => {
          if (volume[key] && volume[key].internal !== undefined) {
            if (volume[key].internal === true) {
              toRemove = true;
            } else {
              internalKeys.push(key);
            }
          }
        });
        if (toRemove) {
          return [];
        }
        // remove all 'internal' keys from object
        internalKeys.forEach((key) => {
          filteredVolume = omit(filteredVolume, `${key}.internal`);
        });
        return filteredVolume;
      });
    }
    return this.submit(projectId, toSubmit);
  }

  getAll(projectId) {
    return this.OvhApiCloudProjectAi.Training()
      .Job()
      .v6()
      .query({ serviceName: projectId })
      .$promise.then((jobs) => jobs.map((job) => new Job({ ...job })));
  }

  get(projectId, jobId) {
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

  killJob(projectId, jobId) {
    return this.$http.put(`/cloud/project/${projectId}/ai/job/${jobId}/kill`);
  }

  logs(projectId, jobId) {
    return this.OvhApiCloudProjectAi.Training()
      .Job()
      .v6()
      .log(
        {
          serviceName: projectId,
          jobId,
        },
        null,
      ).$promise;
  }

  removeJob(projectId, jobId) {
    return this.$http
      .delete(`/cloud/project/${projectId}/ai/job/${jobId}`)
      .then(({ data }) => data);
  }

  getRegions(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/ai/capabilities/region`)
      .then(({ data }) => {
        return data.map((region) => {
          return {
            ...region,
            name: region.id,
            hasEnoughQuota: () => true,
          };
        });
      });
  }

  getResources(serviceName, region) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Region()
      .Resource()
      .v6()
      .get({
        serviceName,
        region,
      }).$promise;
  }

  getFlavors(serviceName, region) {
    return this.$http.get(
      `/cloud/project/${serviceName}/ai/capabilities/region/${region}/flavor`,
    );
  }

  getGpus(serviceName, region) {
    return this.OvhApiCloudProjectAi.Capabilities()
      .Training()
      .Region()
      .Gpu()
      .v6()
      .query({
        serviceName,
        region,
      }).$promise;
  }

  getJobCliCommand(serviceName, job) {
    return this.$http.post(`/cloud/project/${serviceName}/ai/job/command`, job);
  }

  getSavedSshKeys(serviceName) {
    return this.$http.get(`/cloud/project/${serviceName}/sshkey`);
  }
}
