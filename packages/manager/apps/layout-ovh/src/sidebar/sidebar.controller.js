import _ from 'lodash';

export default class SidebarController {
  /* @ngInject */

  constructor(
    $translate,
    $rootScope,
    OvhApiServices,
    SIDEBAR_CONFIG,
    SIDEBAR_STATE_MAPPING_SERVICE,
    SidebarMenu,
  ) {
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

  hasMenuItemConfig(serviceName) {
    return _.has(this.SIDEBAR_CONFIG, serviceName);
  }

  getMenuItemConfig(serviceName) {
    const config = _.clone(_.get(this.SIDEBAR_CONFIG, serviceName, this.SIDEBAR_CONFIG.default));

    config.id = serviceName;
    if (!_.has(config, 'title')) {
      config.title = serviceName;
    }
    config.title = this.$translate.instant(config.title);

    if (_.has(config, 'error')) {
      config.error = this.$translate.instant(config.error);
    }
    config.allowSearch = false;
    config.allowSubItems = true;
    return config;
  }

  getServiceMenuItemConfig(service) {
    const serviceConfig = _.get(
      this.SIDEBAR_STATE_MAPPING_SERVICE,
      service.route.path,
      this.SIDEBAR_STATE_MAPPING_SERVICE.default,
    );
    return {
      id: service.resource.name,
      title: service.resource.displayName || service.resource.name,
      prefix: this.$translate.instant(serviceConfig.prefix),
      state: serviceConfig.state,
      stateParams: _.mapValues(serviceConfig.stateParams, param => _.get(service, param, '')),
    };
  }

  buildMenuTreeConfig(services) {
    const filteredServices = _.filter(services, service => this.hasMenuItemConfig(service.name));
    return _.sortBy(
      _.map(filteredServices, (service) => {
        const menuItem = this.getMenuItemConfig(service.name);
        if (_.has(service, 'subServices') && !_.isEmpty(service.subServices)) {
          menuItem.subServices = this.buildMenuTreeConfig(service.subServices);
        }
        return menuItem;
      }),
      'title',
    );
  }

  buildMenuItems(menuTree, parent) {
    _.each(menuTree, (menuItemConfig) => {
      let children = [];
      if (_.has(menuItemConfig, 'subServices')) {
        children = menuItemConfig.subServices;
      }
      let menuItem;

      if (parent) {
        menuItem = this.SidebarMenu.addMenuItem(menuItemConfig, parent);
      } else {
        menuItem = this.SidebarMenu.addMenuItem(menuItemConfig);
      }

      if (!_.isEmpty(children)) {
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

        _.each(services, (service) => {
          this.SidebarMenu.addMenuItem(this.getServiceMenuItemConfig(service), parent);
        });
      });
  }
}
