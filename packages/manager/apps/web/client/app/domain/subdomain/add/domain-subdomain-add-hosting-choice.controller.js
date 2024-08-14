angular.module('App').controller(
  'AddSubdomainHostingChoiceCtrl',
  class AddSubdomainHostingChoiceCtrl {
    /* @ngInject */
    constructor($scope, Hosting) {
      this.$scope = $scope;
      this.Hosting = Hosting;
    }

    $onInit() {
      this.hostings = [];
      this.loading = true;
      this.selected = {
        hosting: '',
      };

      this.$scope.redirect = () => this.redirect();

      this.Hosting.getHostings().then((data) => {
        if (data.length === 1) {
          [this.selected.hosting] = data;
          this.redirect();
        } else {
          this.hostings = data;
          this.loading = false;
        }
      });
    }

    goBack() {
      this.$scope.setAction('subdomain/add/domain-subdomain-add', {
        domain: this.$scope.currentActionData.domain,
        subdomain: this.$scope.currentActionData.subdomain || '',
      });
    }

    redirect() {
      this.$scope.setAction('attach/domain-attached-domain-select', {
        domain: this.$scope.currentActionData.domain,
        subdomain: this.$scope.currentActionData.subdomain || '',
        hosting: this.selected.hosting,
      });
    }
  },
);
