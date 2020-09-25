import clone from 'lodash/clone';
import get from 'lodash/get';

angular.module('App').controller(
  'HostingTabModulesController',
  class HostingTabModulesController {
    constructor(
      $scope,
      $state,
      $stateParams,
      $translate,
      $window,
      Alerter,
      Hosting,
      HostingModule,
      User,
      atInternet,
    ) {
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.Hosting = Hosting;
      this.HostingModule = HostingModule;
      this.User = User;
      this.atInternet = atInternet;
    }

    $onInit() {
      this.atInternet.trackPage({ name: 'web::hosting::module-1-click' });

      this.$scope.$on('hosting.tabs.modules.refresh', () => {
        this.getModules(true);
      });

      this.Hosting.getSelected(this.$stateParams.productId)
        .then((hosting) => {
          this.serviceState = hosting.serviceState;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_configuration_tab_modules_create_step1_loading_error',
            ),
            get(err, 'data', err),
            this.$scope.alerts.main,
          );
        });

      this.User.getUrlOf('guides').then((guides) => {
        if (guides && guides.hostingModule) {
          this.guide = guides.hostingModule;
        }
      });

      this.getModules();
    }

    getModules(forceRefresh) {
      this.modules = null;

      return this.HostingModule.getModules(this.$stateParams.productId, {
        forceRefresh,
      })
        .then((moduleIds) => {
          this.modules = moduleIds.map((id) => ({ id }));
          return this.modules;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'hosting_configuration_tab_modules_create_step1_loading_error',
            ),
            err,
            this.$scope.alerts.main,
          );
        });
    }

    transformItem(item) {
      return this.HostingModule.getModule(
        this.$stateParams.productId,
        item.id,
      ).then((originalModule) => {
        const module = clone(originalModule);

        return this.HostingModule.getAvailableModule(module.moduleId).then(
          (template) => {
            module.template = template;
            module.id = item.id;
            module.href = `http://${module.targetUrl}`;
            module.adminHref = `http://${module.targetUrl}/${module.adminFolder}`;
            return module;
          },
        );
      });
    }

    goToHref(href, target = '_blank') {
      this.$window.open(href, target);
    }
  },
);
