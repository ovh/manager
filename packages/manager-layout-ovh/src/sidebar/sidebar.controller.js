import clone from 'lodash/clone';
import each from 'lodash/each';
import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import sortBy from 'lodash/sortBy';

export default class SidebarController {
  constructor(
    $translate,
    $rootScope,
    OvhApiServices,
    SIDEBAR_CONFIG,
    SIDEBAR_STATE_MAPPING_SERVICE,
    SidebarMenu,
  ) {
    'ngInject';

    this.$translate = $translate;
    this.$rootScope = $rootScope;
    this.OvhApiServices = OvhApiServices;
    this.SIDEBAR_CONFIG = SIDEBAR_CONFIG;
    this.SIDEBAR_STATE_MAPPING_SERVICE = SIDEBAR_STATE_MAPPING_SERVICE;
    this.SidebarMenu = SidebarMenu;

    this.isOpen = false;
  }

  $onInit() {
    this.$rootScope.$on('navbar:toggle', () => this.toggle());

    this.SidebarMenu.setInitializationPromise(
      this.OvhApiServices.Aapi().get().$promise
        .then((services) => { this.buildMenu(services); }),
    );
  }

  buildMenu(services) {
    const menuItems = this.buildMenuTreeConfig(services);
    this.buildMenuItems(menuItems);
    this.$rootScope.$broadcast('sidebar:loaded');
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
      state: serviceConfig.state,
      stateParams: mapValues(serviceConfig.stateParams, param => get(service, param, '')),
    };
  }

  buildMenuTreeConfig(services) {
    return sortBy(
      map(services, (service) => {
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
    each(menuTree, (menuItemConfig) => {
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

  toggle() {
    this.isOpen = !this.isOpen;
  }

  loadServices(serviceName) {
    return this.OvhApiServices.Aapi().get({ service: serviceName }).$promise
      .then((services) => {
        const parent = this.SidebarMenu.getItemById(serviceName);

        each(services, (service) => {
          this.SidebarMenu.addMenuItem(this.getServiceMenuItemConfig(service), parent);
        });
      });
  }
}
