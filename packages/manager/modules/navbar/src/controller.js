import get from 'lodash/get';
import has from 'lodash/has';

import { BRAND, NON_PRIMARY_ITEMS } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    $window,
    Navbar,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$window = $window;
    this.Navbar = Navbar;
  }

  $onInit() {
    this.isLoading = true;
    this.brand = this.buildBrand();

    if (has(this.navbarOptions, 'toggle')) {
      this.togglerActive = false;
      this.togglerisLoading = true;

      this.$scope.$on(get(this.navbarOptions, 'toggle.event'), () => {
        this.togglerisLoading = false;
      });
    }

    return this.getUser()
      .then(() => this.$translate.refresh())
      .then(() => this.buildMainLinks())
      .finally(() => {
        this.$scope.$emit('navbar.loaded');
        this.isLoading = false;
      });
  }

  getUser() {
    return this.Navbar.getUser()
      .then((user) => {
        this.user = user;
      });
  }

  buildBrand() {
    return ({
      label: this.brandLabel,
      url: `${this.$window.location.origin}${this.$window.location.pathname}`,
      ...BRAND,
    });
  }

  buildMainLinks() {
    return this.Navbar.getUniverses()
      .then((universes) => {
        this.mainLinks = universes.map(({ universe: name, url }) => ({
          name,
          title: this.$translate.instant(`navbar_universe_${name}`),
          url: url || '#',
          isPrimary: !NON_PRIMARY_ITEMS.includes(name),
        }));
        this.responsiveLinks = universes.map(({ universe: name, url }) => {
          const link = ({
            name,
            title: this.$translate.instant(`navbar_universe_${name}`),
            isPrimary: !NON_PRIMARY_ITEMS.includes(name),
          });

          if (name === this.navbarOptions.universe) {
            link.click = () => {
              this.toggleSidebar();
              this.$scope.$emit('navbar:onUniverseClick');
            };
            link.isActive = true;
          } else {
            link.url = url || '#';
          }

          return link;
        });
      });
  }

  toggleSidebar() {
    this.togglerActive = !this.togglerActive;
    this.$scope.$emit('navbar:toggle');
  }
}
