export default class {
  /* @ngInject */
  constructor($scope, $translate, Ip) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.Ip = Ip;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.model = { description: null };
    this.$scope.loading = false;

    if (this.ipBlock && this.ipBlock.description) {
      this.$scope.model.description = angular.copy(this.ipBlock.description);
    }

    this.$scope.$watch('model.description', (newValue) => {
      this.$scope.availableChar = `${newValue ? newValue.length : 0}/255`;
    });

    /* Action */
    this.$scope.editIpDescription = () => {
      this.$scope.loading = true;
      this.Ip.editIpDescription(
        this.ipBlock.ipBlock,
        this.$scope.model.description || '',
      )
        .then(() =>
          this.goBack(
            {
              message: {
                text: this.$translate.instant('ip_description_edit_success', {
                  t0: this.ipBlock.ipBlock,
                }),
                data: 'OK',
              },
            },
            { reload: true },
          ),
        )
        .catch((reason) =>
          this.goBack({
            message: {
              text: this.$translate.instant('ip_description_edit_failure', {
                t0: this.ipBlock.ipBlock,
              }),
              data: {
                ...reason,
                type: 'ERROR',
              },
            },
          }),
        );
    };
  }
}
