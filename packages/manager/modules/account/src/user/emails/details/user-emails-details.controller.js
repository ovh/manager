export default /* @ngInject */ function UserAccountEmailsDetailsController(
  $scope,
  $stateParams,
  AccountUserEmailsService,
  Alerter,
  $location,
  $translate,
) {
  $scope.previousPage =
    $location.search() && $location.search().previousPage
      ? $location.search().previousPage
      : 1;

  function parseBodyIfThereIsSomethingToParse(body) {
    let parsedBody = body;

    if (!angular.isString(body)) {
      return null;
    }

    /* each other links inside the text */
    parsedBody = parsedBody.replace(
      /([^"']|^)(https?:\/\/([^/\s]+\/)*([^/\s]+)\/?)(?!"|')(\s|$)/gi,
      '$1<a href="$2" target="_blank">$2</a>$5',
    );

    /* each email inside the text */
    /* eslint-disable max-len */
    parsedBody = parsedBody.replace(
      /(\[\d{1,2}\])?(\s)?([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]{2}(?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)(\s|$)/gi,
      '$2<a href="mailto:$3">$3</a>$4',
    );
    /* eslint-enable max-len */

    if (body === parsedBody) {
      return null;
    }

    return parsedBody;
  }

  function getEmail() {
    AccountUserEmailsService.getEmail($scope.email.emailId)
      .then(
        (email) => {
          angular.extend($scope.email, email);
          $scope.email.bodyCook = parseBodyIfThereIsSomethingToParse(
            $scope.email.body,
          );

          // A toggle used to display raw or cooked body
          $scope.email.displayBodyCook = !!$scope.email.bodyCook;
        },
        (err) => {
          Alerter.error(
            $translate.instant('otrs_email_detail_error', {
              t0: $scope.email.emailId,
            }),
            err.data,
            'otrs_email_detail',
          );
        },
      )
      .finally(() => {
        $scope.loaders.email = false;
      });
  }

  function init() {
    $scope.email = {
      emailId: $stateParams.emailId,
    };

    $scope.loaders = {
      email: true,
    };

    getEmail();
  }

  init();
}
