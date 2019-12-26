/**
 *  Cloud Project Orchestrator. Gonna touch the stars!
 *  ==================================================
 *
 *  =README=
 *  This orchestrator is used to globally manage a cloud project.
 *
 *  /!\ Make sure to ALWAYS:
 *      - use this service to init a section
 *      - use this service to trigger cross sections actions (e.g.: create a vm from snapshot)
 */
angular
  .module('managerApp')
  .service('CloudProjectOrchestrator', function CloudProjectOrchestratorService(
    $q,
    CloudProjectFactory,
    CloudProjectComputeInfrastructureOrchestrator,
    CloudProjectComputeVolumesOrchestrator,
    OvhApiCloudProject,
    OvhApiCloudProjectIpV6,
    CLOUD_PROJECT_OVERVIEW_THRESHOLD,
  ) {
    const self = this;

    this.project = {}; // by serviceName

    let createInstanceFromSnapshot = null;

    /**
     *  At next infrastructure init, ask to create a vm via a snapshot.
     */
    this.askToCreateInstanceFromSnapshot = function askToCreateInstanceFromSnapshot(
      snapshot,
    ) {
      createInstanceFromSnapshot = snapshot;
      return $q.when(true);
    };

    this.hasTooManyInstances = function hasTooManyInstances(projectId) {
      return OvhApiCloudProject.Instance()
        .v6()
        .query({
          serviceName: projectId,
        })
        .$promise.then(
          (instances) =>
            instances.length > CLOUD_PROJECT_OVERVIEW_THRESHOLD.instances,
        );
    };

    this.hasTooManyIps = function hasTooManyIps(projectId) {
      return OvhApiCloudProjectIpV6.query({
        serviceName: projectId,
      }).$promise.then(
        (ips) => ips.length > CLOUD_PROJECT_OVERVIEW_THRESHOLD.ips,
      );
    };

    /*= =====================================
    =            INITIALISATION            =
    ====================================== */

    // Init Project factory, or return it if already created
    this.init = function init(opts) {
      if (self.project[opts.serviceName]) {
        return $q.when(self.project[opts.serviceName]);
      }
      return $q.when(new CloudProjectFactory(opts)).then((project) => {
        self.project[opts.serviceName] = project;
        return project;
      });
    };

    /**
     *  Init infrastructure section
     */
    function initInfrastructure(opts) {
      return CloudProjectComputeInfrastructureOrchestrator.init(opts)
        .then((infra) => {
          self.project[opts.serviceName].compute.infrastructure = infra;
          return self.project[opts.serviceName].compute.infrastructure;
        })
        .then((infra) => {
          if (createInstanceFromSnapshot) {
            return CloudProjectComputeInfrastructureOrchestrator.addNewVmToList(
              {
                name: createInstanceFromSnapshot.name,
                imageId: createInstanceFromSnapshot.id,
                region: createInstanceFromSnapshot.region,
              },
            ).then((vm) => {
              CloudProjectComputeInfrastructureOrchestrator.turnOnVmEdition(vm);
              createInstanceFromSnapshot = null;
              return infra;
            });
          }
          return infra;
        });
    }

    /**
     *  Init volumes section
     */
    function initVolumes(opts) {
      return CloudProjectComputeVolumesOrchestrator.init(opts).then(
        (volumes) => {
          self.project[opts.serviceName].compute.volumes = volumes;
          return self.project[opts.serviceName].compute.volumes;
        },
      );
    }

    // Init infrastructure factory only
    this.initInfrastructure = function initInfrastructureFn(opts) {
      return this.init(opts).then(() => initInfrastructure(opts));
    };

    // Init volumes factory only
    this.initVolumes = function initVolumesFn(opts) {
      return this.init(opts).then(() => initVolumes(opts));
    };
  });
