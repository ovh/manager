//     THIS IS CODE IS OBSOLETE
angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureIpAddCtrl',
    function CloudProjectComputeInfrastructureIpAddCtrl(
      $rootScope,
      $scope,
      $timeout,
      $translate,
      $q,
      OvhApiCloud,
      CloudProjectComputeInfrastructureOrchestrator,
      CucRegionService,
    ) {
      const self = this;
      self.regionService = CucRegionService;

      // -------------- QUANTITY AND GEOLOC CHANGES

      self.decrementQuantity = function decrementQuantity() {
        if (self.model.quantity > self.minQuantity) {
          self.model.quantity -= 1;
        }
      };

      self.incrementQuantity = function incrementQuantity() {
        if (self.model.quantity < self.maxQuantity) {
          self.model.quantity += 1;
        }
      };

      $scope.$watch(
        'InfrastructureIpAddEditCtrl.model.geoloc',
        (value, oldValue) => {
          if (value && value !== oldValue) {
            self.backToMenu();
          }
        },
      );

      // ---

      // -------------- MENU ACTIONS

      self.openEditDetail = function openEditDetail() {
        $scope.$broadcast('adaptative.switch.page.goToPage', 2);

        $timeout(() => {
          const $checkedRadio = $('input[name=geolocChoice]:checked');
          if ($checkedRadio && $checkedRadio.length) {
            const $checkedRadioCtnr = $checkedRadio.closest('.panel-body');
            $checkedRadioCtnr.scrollTo($checkedRadio, 200, { offset: -100 });
            $checkedRadio.closest(':tabbable').focus();
          }
        }, 99);
      };

      self.backToMenu = function backToMenu() {
        $scope.$broadcast('adaptative.switch.page.goToPage', 1);
      };

      // ---

      // -------------- LEFT PAGE FOOTER ACTIONS

      self.cancelIpAdd = function cancelIpAdd() {
        $rootScope.$broadcast('ip.add.cancel');
        // reset overlay
        $rootScope.$broadcast('cuc-highlighted-element.hide');
      };

      self.launchIpCreation = function launchIpCreation() {
        CloudProjectComputeInfrastructureOrchestrator.createNewIps(this.model);
        // close popover and hide overlay
        self.cancelIpAdd();
      };

      // what to do before popover hide
      $scope.$on('adaptativePopover.before.hide', () => {
        // mmmmhhh strange but if no timeout, draft-ip is still present in dom after cancel...
        $timeout(self.cancelIpAdd);
      });

      // ---

      // -------------- INITIALIZATION

      function init() {
        // set min and max quantity available to add
        self.minQuantity = 1;
        self.maxQuantity = 32;
        // set default model
        self.model = {
          quantity: self.minQuantity,
          geoloc: 'FR',
        };
        // set focus on popover
        $timeout(() => {
          $('.cloud-ip-popover').find(':tabbable:first').focus();
        }, 99);
        // set overlay
        $rootScope.$broadcast(
          'cuc-highlighted-element.show',
          'compute,draft-ip',
        );
        // get possible geolocs
        self.locLoader = true;
        return OvhApiCloud.v6()
          .schema()
          .$promise.then((schema) => {
            self.availableGeolocs =
              schema.models['ip.FloatingIpGeolocEnum'].enum;
            self.locLoader = false;
          });
      }

      init();

      // ---
    },
  );
