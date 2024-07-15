export default class OverTheBoxMigrationContactCtrl {
  /* @ngInject */
  constructor($scope, $translate, OvhContact) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.OvhContact = OvhContact;
  }

  $onInit() {
    this.ovhContactOptions = {
      options: {
        allowCreation: true,
        allowEdition: false,
      },
    };

    this.contact = null;
  }

  selectContact() {
    this.$scope.$emit('selectedContact', this.contact);
  }
}
