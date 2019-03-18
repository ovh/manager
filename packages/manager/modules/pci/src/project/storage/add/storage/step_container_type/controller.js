import forEach from 'lodash/forEach';
import set from 'lodash/set';

export default /* @ngInject */ function (
  $scope,
  $translate,
  TranslateService,
  OvhApiMe,
  PCI_URLS,
  TARGET,
) {
  const self = this;

  $scope.childStep = 'name';

  $scope.categories = [{
    code: 'pcs',
    name: $translate.instant('add_storage_category_pcs'),
    moreInfo: {
      url: PCI_URLS[TARGET].website_order.pcs.GB || PCI_URLS[TARGET].website_order.pcs.WE,
    },
    options: [{
      type: 'static',
      name: $translate.instant('add_storage_type_static_hosting'),
      description: $translate.instant('add_storage_type_static_hosting_description'),
      shortcut: 'swift_cname',
      visible: true,
    },
    {
      type: 'private',
      name: $translate.instant('add_storage_type_private'),
      description: $translate.instant('add_storage_type_private_description'),
      shortcut: 'swift_private',
      visible: true,
    },
    {
      type: 'public',
      name: $translate.instant('add_storage_type_public'),
      description: $translate.instant('add_storage_type_public_description'),
      shortcut: 'swift_public',
      visible: true,
    }],
  }, {
    code: 'pca',
    name: $translate.instant('add_storage_category_pca'),
    moreInfo: {
      url: PCI_URLS[TARGET].website_order.pca.GB || PCI_URLS[TARGET].website_order.pca.WE,
    },
    options: [{
      type: 'archive',
      name: $translate.instant('add_storage_type_cold'),
      description: $translate.instant('add_storage_type_cold_description'),
      shortcut: 'pca',
      visible: true,
    }],
  }];

  $scope.clickOnContainerType = function clickOnContainerTypeFn() {
    $scope.loadStep($scope.childStep);
  };

  self.$onInit = function onInitFn() {
    OvhApiMe.v6().get().$promise.then((me) => {
      const lang = me.ovhSubsidiary;
      forEach($scope.categories, (category) => {
        set(category, 'moreInfo.url', PCI_URLS[TARGET].website_order[category.code][lang]);
      });
    });
  };
}
