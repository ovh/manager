export default {
  template: `
    <img class="storage-table-type-icon"
         data-ng-src="{{$ctrl.image}}"
         data-ng-if="!$ctrl.loading && $ctrl.image" />
    <oui-spinner data-size="s"
                 data-ng-if="$ctrl.loading || !$ctrl.type">
    </oui-spinner>
    <i class="glyphicon glyphicon-exclamation-sign"
       data-ng-if="$ctrl.missingImage">
    </i>
  `,
  controller: /* @ngInject */ function controller($q, $timeout) {
    const ctrl = this;

    function loadImage() {
      let deferred = $q.when(false);
      const moduleDefault = m => (m.default ? m.default : m);
      ctrl.loading = true;
      ctrl.missingImage = false;
      switch (ctrl.type) {
        case 'pca':
          deferred = import('./assets/pca.svg').then(moduleDefault);
          break;
        case 'swift_cname':
          deferred = import('./assets/swift_cname.svg').then(moduleDefault);
          break;
        case 'swift_private':
          deferred = import('./assets/swift_private.svg').then(moduleDefault);
          break;
        case 'swift_public':
          deferred = import('./assets/swift_public.svg').then(moduleDefault);
          break;
        default:
          break;
      }
      deferred.then((image) => {
        $timeout(() => {
          if (image) {
            ctrl.image = image;
          } else {
            ctrl.missingImage = true;
          }
          ctrl.loading = false;
        });
      });
    }

    ctrl.$onChanges = (changes) => {
      if (!changes.type || changes.type.currentValue === undefined) return;
      if (changes.type.currentValue !== changes.type.previousValue) {
        loadImage();
      }
    };

    ctrl.$onInit = () => {
      ctrl.loading = false;
      ctrl.missingImage = false;
    };
  },
  bindings: {
    type: '<',
  },
};
