export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.contacts', {
    url: '/contacts',
    component: 'pciProjectContactsComponent',
    resolve: {
      goToContactsPage: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
        const reload = message && type === 'success';
        const promise = $state.go('pci.projects.project.contacts', {
          projectId,
        },
        {
          reload,
        });
        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.contacts'));
        }
        return promise;
      },

      addContact: /* @ngInject */ (
        $state, projectId,
      ) => () => $state.go('pci.projects.project.contacts.add', {
        projectId,
      }),

      deleteContact: /* @ngInject */ (
        $state, projectId,
      ) => contactId => $state.go('pci.projects.project.contacts.remove', {
        contactId,
        projectId,
      }),

      projectInfo: /* @ngInject */ (
        OvhApiCloudProjectServiceInfos,
        projectId,
      ) => OvhApiCloudProjectServiceInfos.v6().get({
        serviceName: projectId,
      }).$promise,

      contacts: /* @ngInject */ (
        OvhApiCloud,
        projectId,
      ) => OvhApiCloud.Project().Acl().v6().query({
        serviceName: projectId,
      }).$promise
        .then(contactIds => contactIds.map(id => ({ accountId: id }))),

      breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_contacts_title'),
    },
  });
};
