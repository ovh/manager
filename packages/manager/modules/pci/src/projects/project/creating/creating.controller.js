export default class ProjectCreatingCtrl {
  /* @ngInject */
  constructor(Poller) {
    this.Poller = Poller;
  }

  startCreationPolling() {
    return this.Poller.poll(`/cloud/project/${this.projectId}`, null, {
      namespace: 'pci.projects.creating',
      successRule(details) {
        return details.status === 'ok';
      },
    })
      .then(() => this.onProjectCreated());
  }

  /* =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    this.Poller.kill({
      namespace: 'pci.projects.creating',
    });

    return this.startCreationPolling();
  }

  /* -----  End of Initialization  ------ */
}
