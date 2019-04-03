export default class {
  /* @ngInject */
  constructor() {
    // MOCK DATA : Will be removed after integrating with API
    this.filters = [
      'Role',
      'Region',
    ];
    this.regions = [
      'Beauharnois(BHS3)',
    ];
    this.roles = [
      'MASTER',
      'UTILITY',
      'BASTION',
      'WORKER',
      'EDGE',
    ];
    this.filterBy = null;
    this.selectedRegion = null;
    this.selectedRole = null;
  }

  selectFilter() {
    this.selectedRole = null;
    this.selectedRegion = null;
  }
}
