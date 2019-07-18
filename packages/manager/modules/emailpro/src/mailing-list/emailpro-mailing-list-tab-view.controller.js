export default class EmailProMXPlanMailingListsTabViewController {
  /* @ngInject */
  constructor() {
    this.setCurrentView();
  }

  setCurrentView(view = 'EmailProMXPlanMailingListsView', mailingList = null) {
    this.currentView = view;
    this.currentMailingList = mailingList;
  }
}
