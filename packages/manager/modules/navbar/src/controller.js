import angular from 'angular';

import get from 'lodash/get';
import has from 'lodash/has';
import omit from 'lodash/omit';

import { BRAND, NON_PRIMARY_ITEMS } from './constants';
import { KEY } from './walk-me/walkme.constants';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    $window,
    atInternet,
    Navbar,
    ovhUserPref,
    WalkMe,
  ) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.Navbar = Navbar;
    this.ovhUserPref = ovhUserPref;
    this.WalkMe = WalkMe;
  }

  $onInit() {
    this.isLoading = true;
    this.brand = this.buildBrand();
    this.isResponsiveMode = false;
    this.isSidebarVisible = false;

    if (has(this.navbarOptions, 'toggle')) {
      this.togglerisLoading = true;

      this.$scope.$on(get(this.navbarOptions, 'toggle.event'), () => {
        this.togglerisLoading = false;

        if (this.mainLinks) {
          this.buildResponsiveLinks();
        }
      });
    }

    this.fixed = get(this.navbarOptions, 'fixed', false);

    return this.getUser()
      .then(() => this.$translate.refresh())
      .then(() => this.buildMainLinks())
      .then(() => this.buildResponsiveLinks())
      .finally(() => {
        this.$scope.$emit('navbar.loaded');
        this.isLoading = false;
      });
  }

  getUser() {
    return this.Navbar.getUser().then((user) => {
      this.user = user;
    });
  }

  buildBrand() {
    return {
      label: this.brandLabel,
      url: `${this.$window.location.origin}${this.$window.location.pathname}`,
      ...BRAND,
    };
  }

  buildMainLinks() {
    return this.Navbar.getUniverses(get(this.navbarOptions, 'version')).then(
      (universes) => {
        this.mainLinks = universes.map(({ universe: name, url }) => ({
          name,
          title: this.$translate.instant(`navbar_universe_${name}`),
          url: url || '#',
          isPrimary: !NON_PRIMARY_ITEMS.includes(name),
        }));
      },
    );
  }

  buildResponsiveLinks() {
    if ((this.sidebarLinks || this.universeClick) && !this.responsiveLinks) {
      this.responsiveLinks = this.mainLinks.map((link) => {
        if (link.name === get(this.navbarOptions, 'universe')) {
          return {
            ...omit(link, 'url'),
            subLinks: this.sidebarLinks,
            click: () => this.universeClick(),
          };
        }

        return link;
      });
    }
  }

  startWalkMe() {
    return this.ovhUserPref
      .getValue(KEY)
      .then(({ value }) => {
        this.shouldShowWalkMe = value;
      })
      .catch(({ status }) => {
        if (status === 404) {
          this.shouldShowWalkMe = true;
        }
      })
      .finally(() => {
        if (this.shouldShowWalkMe) {
          this.tour = this.WalkMe.start();
          angular.element('oui-navbar').on('click', () => this.endWalkMe());
        }
      });
  }

  endWalkMe() {
    this.tour.end();
    this.WalkMe.end();
    this.shouldShowWalkMe = false;
  }

  onUserClick() {
    let toggleSidebar = true;

    // with sidebarExpand option, toggle sidebar only in responsive mode
    // (since it's otherwise always visible)
    if (this.sidebarExpand) {
      toggleSidebar = this.isResponsiveMode === true;
    }

    if (toggleSidebar) {
      this.isSidebarVisible = !this.isSidebarVisible;
      if (this.isSidebarVisible) {
        this.atInternet.trackClick({
          name: 'navbar::action::user-bar',
          type: 'action',
        });
      }
    }
  }

  onBreakpointChange(isResponsive) {
    this.isResponsiveMode = isResponsive;

    // hide the sidebar when switching to responsive mode
    if (isResponsive) {
      this.isSidebarVisible = false;
    } else if (this.sidebarExpand) {
      this.isSidebarVisible = true;
    }
  }
}
