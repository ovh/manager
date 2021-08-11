angular.module('App').controller(
  'AppCtrl',
  class AppCtrl {
    constructor($scope, $rootScope, $timeout, $translate, coreConfig, WucUser) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.coreConfig = coreConfig;
      this.WucUser = WucUser;
    }

    $onInit() {
      this.$scope.worldPart = this.coreConfig.getRegion();
      this.$scope.stepPath = '';
      this.$scope.currentAction = null;
      this.$scope.currentActionData = null;

      this.$scope.resetAction = () => {
        $('#currentActionApp').modal('hide');
        this.$scope.currentActionData = null;

        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      };

      // Prevents a bug with CKEditor.
      // See: https://stackoverflow.com/a/23667151 and includes updates from https://github.com/twbs/bootstrap-sass/blob/5d6b2ebba0c2a5885ce2f0e01e9218db3d3b5e47/assets/javascripts/bootstrap/modal.js#L139
      this.$timeout(() => {
        $.fn.modal.Constructor.prototype.enforceFocus = function enforceFocus() {
          $(document)
            .off('focusin.bs.modal')
            .on(
              'focusin.bs.modal',
              $.proxy((event) => {
                const $parent = $(event.target.parentNode);
                if (
                  document !== event.target &&
                  this.$element[0] !== event.target &&
                  !this.$element.has(event.target).length &&
                  !$parent.hasClass('cke_dialog_ui_input_select') &&
                  !$parent.hasClass('cke_dialog_ui_input_text')
                ) {
                  this.$element.trigger('focus');
                }
              }, this),
            );
        };
      });
    }

    setAction(action, data) {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      if (action) {
        this.$scope.stepPath = `${this.$scope.currentAction}.html`;
        $('#currentActionApp').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        this.$scope.resetAction();
      }
    }

    getIncidentInformations() {
      this.setAction('incident/incident');
    }
  },
);
