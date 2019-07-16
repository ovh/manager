angular.module('App').controller(
  'EmailProMXPlanMailingListsTabViewController',
  class EmailProMXPlanMailingListsTabViewController {
    /**
     * Constructor
     */
    constructor() {
      this.setCurrentView();
    }

    setCurrentView(view = 'EmailProMXPlanMailingListsView', mailingList = null) {
      this.currentView = view;
      this.currentMailingList = mailingList;
    }
  },
);
