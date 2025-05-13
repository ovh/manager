import get from 'lodash/get';
import has from 'lodash/has';

export default class ProjectCreatingNotPaidCtrl {
  /* @ngInject */
  constructor($state, CucCloudMessage, coreURLBuilder, projectCreating) {
    // dependencies injections
    this.$state = $state;
    this.CucCloudMessage = CucCloudMessage;
    this.projectCreating = projectCreating;

    // other attributes used in view
    this.loading = {
      cancel: false,
    };

    this.orderUrl = coreURLBuilder.buildURL('dedicated', '#/billing/orders', {
      status: 'all',
    });
  }

  onCancelProjectBtnClick() {
    this.loading.cancel = true;

    return this.projectCreating
      .cancelProjectCreation(this.projectId)
      .then(() => this.$state.go('app'))
      .catch((error) => {
        if (get(error, 'status') === 460) {
          return this.$state.go('pci.projects');
        }

        return this.$state.go(
          'pci.error',
          {
            detail: {
              message: get(error, 'data.message'),
              code: has(error, 'headers')
                ? error.headers('x-ovh-queryId')
                : null,
            },
          },
          {
            location: false,
          },
        );
      })
      .finally(() => {
        this.loading.cancel = false;
      });
  }
}
