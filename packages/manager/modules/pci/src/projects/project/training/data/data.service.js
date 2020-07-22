import Data from './data.class';

export default class PciProjectTrainingDataService {
  /* @ngInject */
  constructor(OvhApiCloudProjectAi) {
    this.OvhApiCloudProjectAi = OvhApiCloudProjectAi;
  }

  attach(projectId, dataSpec) {
    return this.OvhApiCloudProjectAi.Training()
      .Data()
      .v6()
      .save({ serviceName: projectId }, dataSpec)
      .$promise.then(
        (data) =>
          new Data({
            ...data,
          }),
      );
  }

  getAll(projectId) {
    // Uncomment when iceberg proded
    return this.OvhApiCloudProjectAi.Training()
      .Data()
      .v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((allData) => allData.map((data) => new Data({ ...data })));

    /* const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            id: '123',
            name: 'odp-logs',
            region: "GRA",
            user: 'toto',
            created: '2020-06-05T14:02:40.919661Z',
          },
          {
            id: '345',
            name: 'test2',
            region: "GRA",
            user: 'toto',
            created: '2020-06-05T14:02:40.919661Z',
          },
        ]);
      }, 300);
    });

    return promise.then((allData) =>
      allData.map((data) => new Data({...data}))
    ); */
  }

  get(projectId, jobId) {
    // Uncomment when iceberg proded
    return this.OvhApiCloudProjectAi.Training()
      .Data()
      .v6()
      .get({
        serviceName: projectId,
        jobId,
      })
      .$promise.then(
        (data) =>
          new Data({
            ...data,
          }),
      );

    /* const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          var result = {
            id: '123',
            state: 'SUCCEEDED',
            image: 'hello-world:latest',
            creator: 'mael.le-gal@ovhcloud.com',
            command: [
              './script.sh',
              '--help'
            ],
            data: [
              "9c4c8b8e-c9fe-4736-a6f6-6549769fc798:/app/data/sentiment_sentences:rw",
              "a972b234-b13a-48e4-bacd-ab9b31f63a6b:/app/data/output:rw",
              "b1d52785-bbd0-4627-a701-f47dca294233:/app/runs:rw"
            ],
            resources: {
              cpu: 1,
              mem: 24,
              gpu: 2
            },
            created: "2020-06-05T14:02:40.919661Z",
            region: "GRA"
          };
          const proj2 = {
            id: '789',
            state: 'FAILED',
            image: 'hello-world:latest',
            creator: 'mael.le-gal@ovhcloud.com',
            region: "GRA"
          }
          if (jobId === '789') {
            result = proj2;
          }
          resolve(result);
        }, 300);
      });
      
      return promise.then(
        (data) =>
          new Data({
            ...data,
          }),
      ); */
  }
}
