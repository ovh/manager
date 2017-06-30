(function () {
    "use strict";

    /**
     *  @ngdoc directive
     *  @name ovhContact.directive:ovhContact
     *
     *  @restrict E
     *  @scope
     *
     *  @description
     *  <p>This is the base directive to load into your code. This will manage for you contact selection and/or contact creation.</p>
     *  <p><b>Note: </b>ovh-contact directive allows transclusion to display a custom loader (bouncing-box-loader for Telecom, spinner for cloud, ...).</p>
     *
     *  @example
     *  In your controller:
     *  <pre>
     *      angular.module("myModule").controller("myController", function ($q) {
     *          this.model = {
     *              contact: null
     *          };
     *
     *          this.choiceOptions = {
     *              filter: function (contacts) {
     *                  return _.filter(contacts, { id: 123 });
     *              },
     *              options: {
     *                  allowCreation: false
     *              }
     *          };
     *
     *          this.initDeferred = $q.defer();
     *
     *          this.initDeferred.promise.then(function () {
     *              console.log("Contact is automatically selected", this.model.contact);
     *          });
     *      });
     *  </pre>
     *
     *  In your HTML:
     *  <pre>
     *      <div data-ng-controller="myController as $ctrl">
     *          <ovh-contact data-ng-model="$ctrl.model.contact"
     *                       data-ovh-contact-choice-options="$ctrl.choiceOptions"
     *                       data-ovh-contact-init-deferred="$ctrl.initDeferred">
     *              <div data-my-custom-loader></div> <!-- Will be transcluded during ovh-contact directive loading phases -->
     *          </ovh-contact>
     *      </div>
     *  </pre>
     *
     *  @param {OvhContact} ngModel The contact selected or created.
     *  @param {Boolean=} [ovhContactOnlyCreate=false] Force to only create a contact.
     *  @param {Object=} ovhContactChoiceOptions Options for ovhContactChoice directive (a child directive). See {@link ovhContact.directive:ovhContactChoice ovhContactChoice} for more details.
     *  @param {Deferred=} ovhContactInitDeferred A deferred object to allow you waiting that all directives are initialized.
     */
    angular.module("ovh-angular-contact").component("ovhContact", {
        transclude: true,
        templateUrl: "ovh-angular-contact.html",
        controller: "OvhContactCtrl",
        bindings: {
            contact: "=ngModel",
            onlyCreate: "@ovhContactOnlyCreate",
            choiceOptions: "=?ovhContactChoiceOptions",
            initDeferred: "=?ovhContactInitDeferred"
        }
    });

})();
