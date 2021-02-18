import angular from 'angular';
import set from 'lodash/set';

export default class NgOvhResponsiveSwitchController {
  /* @ngInject */
  constructor($scope) {
    this.pages = [];

    let lastActivePage;

    this.addPage = (page) => this.pages.push(page) - 1;

    this.setActivePage = (pageIndex) => {
      if (this.pages.length > pageIndex) {
        angular.forEach(this.pages, (page, index) => {
          // set all page to inactive
          if (page.active) {
            set(page, 'active', false);
            lastActivePage = index;
          }
        });
        this.pages[pageIndex].active = true;
      }
    };

    /**
     *  Responsivity
     */

    this.getTotalPageWidth = () => this.pages.length * $scope.pageWidth;

    /**
     *  Utils
     */
    this.getLastActivePage = () => lastActivePage;

    this.getDisplayMode = () => $scope.responsiveSwitchPageMode;

    this.getActivePage = () => $scope.activePageIndex;
  }
}
