import set from 'lodash/set';

angular
  .module('App')
  .controller('DedicatedCloudUserCtrl', function DedicatedCloudUserCtrl(
    $q,
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    DedicatedCloud,
    ouiDatagridService,
  ) {
    this.loading = false;
    this.usersEntrySearchSelected = null;

    $scope.$on('dedicatedCloud.users.refresh', () => {
      ouiDatagridService.refresh('pcc-user-datagrid', true);
    });

    $scope.$watch(
      '$ctrl.usersEntrySearchSelected',
      (newValue) => {
        if (this.usersEntrySearchSelected !== null) {
          if (this.usersEntrySearchSelected === '') {
            ouiDatagridService.refresh('pcc-user-datagrid', true);
          } else {
            $timeout(() => {
              if (this.usersEntrySearchSelected === newValue) {
                ouiDatagridService.refresh('pcc-user-datagrid', true);
              }
            }, 500);
          }
        }
      },
      true,
    );

    this.$onInit = () => {
      this.loading = true;
      return $q
        .all({
          policy: DedicatedCloud.getPasswordPolicy($stateParams.productId),
          nsxOptions: DedicatedCloud.getOptionState(
            'nsx',
            $stateParams.productId,
          ),
        })
        .then((response) => {
          $scope.passwordPolicy = response.policy;
          $scope.nsxOptions = response.nsxOptions;
        })
        .catch((err) => {
          $scope.setMessage(
            $translate.instant('dedicatedCloud_USER_edit_load_error'),
            angular.extend(err, { type: 'ERROR' }),
          );
        })
        .finally(() => {
          this.loading = false;
        });
    };

    this.loadUsers = ({ offset, pageSize }) =>
      DedicatedCloud.getUsers(
        $stateParams.productId,
        this.usersEntrySearchSelected,
      ).then((users) => ({
        data: users
          .slice(offset - 1, offset - 1 + pageSize)
          .map((id) => ({ id })),
        meta: {
          totalCount: users.length,
        },
      }));

    this.loadUser = ({ id }) =>
      $q
        .all({
          user: DedicatedCloud.getUserDetail($stateParams.productId, id),
        })
        .then(({ user }) => {
          set(user, 'state', user.state.toUpperCase());
          set(user, 'activationState', user.activationState.toUpperCase());
          return user;
        });

    this.modifyUserRights = ({ userId }) => {
      $state.go('app.dedicatedClouds.users.rights', { userId });
    };

    this.editUser = ({ userId }) => {
      $state.go('app.dedicatedClouds.users.edit', { userId });
    };
  });
