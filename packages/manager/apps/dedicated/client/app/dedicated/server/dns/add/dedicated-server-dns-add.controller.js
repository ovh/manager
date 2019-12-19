import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import map from 'lodash/map';

import head from 'lodash/head';
import set from 'lodash/set';

angular.module('App').controller('AddSecondaryDnsCtrl', ($scope, $translate, Server, Alerter, IpRange, $stateParams) => {
  $scope.entry = {
    domain: '',
    ip: '',
  };
  $scope.ipdata = {
    t: [],
  };
  $scope.loading = false;

  $scope.loadIpList = function loadIpList() {
    $scope.loading = true;
    Server.listIps($stateParams.productId).then(
      (_data) => {
        const data = flatten(
          map(
            filter(
              _data,
              (ip) => ipaddr.parseCIDR(ip)[0].kind() === 'ipv4',
            ),
            (ip) => IpRange.getRangeForIpv4Block(ip),
          ),
        );

        if (data && data.length === 1) {
          $scope.entry.ip = head(data);
        } else if (data && data.length === 0) {
          // use server IP as a deafult for servers on which /ip api doesn"t return data
          // (old kimsufi)
          $scope.entry.ip = $scope.server.ip;

          $scope.ipdata.t.push({
            name: $scope.server.ip,
            data: $scope.server.ip,
          });
        }
        data.sort();

        angular.forEach(data, (ip) => {
          $scope.ipdata.t.push({
            name: ip,
            data: ip,
          });
        });
        $scope.loading = false;
      },
      (err) => {
        $scope.loading = false;
        $scope.resetAction();
        set(err, 'type', 'ERROR');
        $scope.setMessage($translate.instant('server_configuration_ips_cannotfetch'), err);
      },
    );
  };

  $scope.loadToken = function loadToken() {
    $scope.loadTokenLoading = true;

    Server.getDomainZoneInformation($stateParams.productId, $scope.entry.domain).then(
      (result) => {
        $scope.loadTokenLoading = false;
        $scope.token = result;
      },
      (data) => {
        $scope.loadTokenLoading = false;
        Alerter.alertFromSWS($translate.instant('server_configuration_secondarydns_add_step2_error'), data.data, 'addTokenAlert');
      },
    );
  };

  $scope.addSecondaryDns = function addSecondaryDns() {
    $scope.loading = true;
    Server.addSecondaryDns($stateParams.productId, $scope.entry.domain, $scope.entry.ip).then(
      () => {
        $scope.resetAction();
        $scope.loading = false;
        $scope.setMessage($translate.instant('server_configuration_secondarydns_add_success', { t0: $scope.server.name }), true);
      },
      (err) => {
        $scope.resetAction();
        $scope.loading = false;
        set(err, 'type', 'ERROR');
        $scope.setMessage($translate.instant('server_configuration_secondarydns_add_fail'), err);
      },
    );
  };
});
