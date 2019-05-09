import clone from 'lodash/clone';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import sortBy from 'lodash/sortBy';

import { MENU } from './sidebar.constant';

export default class SidebarController {
  /* @ngInject */

  constructor(
    $translate,
    $rootScope,
    $stateParams,
    $transitions,
    OvhApiServices,
    OvhApiCloudProject,
    SidebarMenu,
  ) {
    this.$translate = $translate;
    this.$transitions = $transitions;
    this.$rootScope = $rootScope;

    this.$stateParams = $stateParams;
    this.OvhApiServices = OvhApiServices;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.SidebarMenu = SidebarMenu;

    this.isOpen = false;
    this.isLoading = false;
    this.isDisplayingProjectsList = false;
  }

  toggleProjectsList() {
    this.isDisplayingProjectsList = !this.isDisplayingProjectsList;
  }

  setProject(serviceName) {
    this.isLoading = true;

    this.SidebarMenu.setInitializationPromise(
      this.OvhApiCloudProject
        .v6()
        .get({
          serviceName,
        })
        .$promise
        .then((project) => {
          this.project = project;

          return this
            .$translate
            .refresh() // Waiting for translations ./translations
            .then(() => new Promise((resolve) => {
              this.SidebarMenu.setShouldToggleMenuItemOpenState(false);
              this.SidebarMenu.clearMenuItems();

              forEach(MENU.filter(el => el !== null), ({ options, subitems, translation }) => {
                const menuItem = this.SidebarMenu.addMenuItem(Object.assign({
                  title: this.$translate.instant(translation),
                  allowSubItems: true,
                  isOpen: true,
                  stateParams: {
                    projectId: this.project.project_id,
                  },
                }, options));

                // eslint-disable-next-line no-shadow
                forEach(subitems.filter(el => el !== null), ({ options, translation }) => {
                  this.SidebarMenu.addMenuItem(Object.assign({
                    title: this.$translate.instant(translation),
                  }, options), menuItem);
                });
              });
              resolve();
            }));
        })
        .finally(() => {
          this.$rootScope.$broadcast('sidebar:loaded');
          this.isLoading = false;
        }),
    );
  }

  $onInit() {
    let currentProjectId = this.$stateParams.projectId;
    this.setProject(this.$stateParams.projectId);
    this.$transitions.onSuccess({}, () => {
      if (currentProjectId !== this.$stateParams.projectId) {
        this.setProject(this.$stateParams.projectId);
        currentProjectId = this.$stateParams.projectId;
      }
      this.isDisplayingProjectsList = false;
    });
  }

  buildMenu(services) {
    const menuItems = this.buildMenuTreeConfig(services);
    this.buildMenuItems(menuItems);
    this.$rootScope.$broadcast('sidebar:loaded');
  }

  hasMenuItemConfig(serviceName) {
    return has(this.SIDEBAR_CONFIG, serviceName);
  }

  getMenuItemConfig(serviceName) {
    const config = clone(get(this.SIDEBAR_CONFIG, serviceName, this.SIDEBAR_CONFIG.default));

    config.id = serviceName;
    if (!has(config, 'title')) {
      config.title = serviceName;
    }
    config.title = this.$translate.instant(config.title);

    if (has(config, 'error')) {
      config.error = this.$translate.instant(config.error);
    }
    config.allowSearch = false;
    config.allowSubItems = true;
    return config;
  }

  getServiceMenuItemConfig(service) {
    const serviceConfig = get(
      this.SIDEBAR_STATE_MAPPING_SERVICE,
      service.route.path,
      this.SIDEBAR_STATE_MAPPING_SERVICE.default,
    );
    return {
      id: service.resource.name,
      title: service.resource.displayName || service.resource.name,
      prefix: this.$translate.instant(serviceConfig.prefix),
      state: serviceConfig.state,
      stateParams: mapValues(serviceConfig.stateParams, param => get(service, param, '')),
    };
  }

  buildMenuTreeConfig(services) {
    const filteredServices = filter(services, service => this.hasMenuItemConfig(service.name));
    return sortBy(
      map(filteredServices, (service) => {
        const menuItem = this.getMenuItemConfig(service.name);
        if (has(service, 'subServices') && !isEmpty(service.subServices)) {
          menuItem.subServices = this.buildMenuTreeConfig(service.subServices);
        }
        return menuItem;
      }),
      'title',
    );
  }

  buildMenuItems(menuTree, parent) {
    forEach(menuTree, (menuItemConfig) => {
      let children = [];
      if (has(menuItemConfig, 'subServices')) {
        children = menuItemConfig.subServices;
      }
      let menuItem;

      if (parent) {
        menuItem = this.SidebarMenu.addMenuItem(menuItemConfig, parent);
      } else {
        menuItem = this.SidebarMenu.addMenuItem(menuItemConfig);
      }

      if (!isEmpty(children)) {
        this.buildMenuItems(children, menuItem);
      } else {
        menuItem.onLoad = () => this.loadServices(menuItemConfig.id);
      }
    });
  }

  loadServices(serviceName) {
    return this.OvhApiServices.Aapi().get({ service: serviceName }).$promise
      .then((services) => {
        const parent = this.SidebarMenu.getItemById(serviceName);

        forEach(services, (service) => {
          this.SidebarMenu.addMenuItem(this.getServiceMenuItemConfig(service), parent);
        });
      });
  }
}
