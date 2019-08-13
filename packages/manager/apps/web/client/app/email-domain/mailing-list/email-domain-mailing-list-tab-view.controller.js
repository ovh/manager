angular.module('App').controller(
  'MailingListsTabViewController',
  class MailingListsTabViewController {
    /**
     * Constructor
     */
    constructor() {
      this.setCurrentView();
    }

    setCurrentView(view = 'mailingListsView', mailingList = null) {
      this.currentView = view;
      this.currentMailingList = mailingList;
    }
  },
);
