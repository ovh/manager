import set from 'lodash/set';

export default /* @ngInject */ function OtrsDetailCtrl(
  $scope,
  $injector,
  $translate,
  Otrs,
  Alerter,
  goBack,
) {
  const $routerParams = $injector.has('$stateParams')
    ? $injector.get('$stateParams')
    : $injector.get('$routeParams');

  $scope.goBack = goBack;

  function loadSchemas() {
    return Otrs.getModels()
      .then((models) => {
        $scope.categories = models.models['support.TicketProductEnum'].enum;
      })
      .catch((err) => {
        Alerter.alertFromSWS(
          $translate.instant('otrs_detail_message_error'),
          err,
          'otrs_message',
        );
      });
  }

  function getCloudCategory() {
    let category = 'publiccloud';

    if (!$scope.categories) {
      loadSchemas();
    }

    if (!!$scope.categories && !!$scope.categories.publiccloud) {
      category = $scope.categories.publiccloud;
    }

    return category;
  }

  function getTicket() {
    Otrs.getTicket($scope.ticket.ticketId)
      .then(
        (ticket) => {
          if (ticket.product === getCloudCategory()) {
            Otrs.getCloudProject(ticket.serviceName)
              .then((project) => {
                if (!!project && !!project.description) {
                  set(ticket, 'serviceDescription', project.description);
                }
              })
              .finally(() => {
                angular.extend($scope.ticket, ticket);
              });
          } else {
            angular.extend($scope.ticket, ticket);
          }
        },
        (err) => {
          Alerter.error(
            $translate.instant('otrs_detail_error', {
              t0: $scope.ticket.ticketId,
            }),
            err,
            'otrs_detail',
          );
        },
      )
      .finally(() => {
        $scope.loaders.ticket = false;
      });
  }

  function loadMessage() {
    $scope.loaders.messages = true;
    Otrs.getTicketMessages($scope.ticket.ticketId)
      .then((messages) => {
        $scope.messages = messages;
      })
      .catch((err) => {
        Alerter.alertFromSWS(
          $translate.instant('otrs_detail_message_error', {
            t0: $scope.ticket.ticketId,
          }),
          err,
          'otrs_message',
        );
      })
      .finally(() => {
        $scope.loaders.messages = false;
      });
  }

  function init() {
    $scope.ticket = {
      ticketId: $routerParams.ticketId,
    };

    $scope.messages = [];

    $scope.loaders = {
      ticket: true,
      messages: true,
      close: false,
      reply: false,
    };

    $scope.answer = {
      body: null,
    };

    getTicket();

    loadMessage();
  }

  $scope.reply = () => {
    if (!$scope.loaders.reply && $scope.answer.body) {
      $scope.loaders.reply = true;

      Otrs.replyTicket($scope.ticket.ticketId, $scope.answer.body)
        .then(() => {
          $scope.answer.body = null;
          getTicket();
          loadMessage();
        })
        .catch((err) => {
          Alerter.alertFromSWS(
            $translate.instant('otrs_detail_reply_error'),
            err,
            'otrs_replyClose',
          );
        })
        .finally(() => {
          $scope.loaders.reply = false;
        });
    }
  };

  $scope.closeTicket = () => {
    if (!$scope.loaders.close) {
      $scope.loaders.close = true;

      Otrs.closeTicket($scope.ticket.ticketId)
        .then(() => {
          init();
        })
        .catch((err) => {
          Alerter.alertFromSWS(
            $translate.instant('otrs_detail_close_error'),
            err,
            'otrs_replyClose',
          );
        })
        .finally(() => {
          $scope.loaders.close = false;
        });
    }
  };

  $scope.canRespondToTicket = function canRespondToTicket() {
    // User cannot respond to ticket automatically generated by the HDD replacement tool,
    // title is generated, so we check that.
    return (
      !/Server hardware replacement : HDD/.test($scope.ticket.subject) &&
      $scope.ticket.state !== 'closed'
    );
  };

  init();
}
