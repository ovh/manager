export default class ProjectCreatingCtrl {
  /* @ngInject */
  constructor(Poller) {
    // dependencies injections
    this.Poller = Poller;

    // other attributes
    this.pollingNamespace = 'pci.projects.creating';
  }

  startCreationPolling() {
    return this.Poller.poll(`/cloud/project/${this.projectId}`, null, {
      namespace: this.pollingNamespace,
      successRule(details) {
        return details.status === 'ok';
      },
    })
      .then(() => this.onProjectCreated());
  }

  stopCreationPolling() {
    return this.Poller.kill({
      namespace: this.pollingNamespace,
    });
  }

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.stopCreationPolling();
    return this.startCreationPolling();
  }

  $onDestroy() {
    return this.stopCreationPolling();
  }

  /* -----  End of Hooks  ------ */
}
