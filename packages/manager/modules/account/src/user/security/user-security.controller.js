import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import some from 'lodash/some';
import values from 'lodash/values';

import { SECURITY_IMAGES } from './user-security.constants';

export default [
  '$scope',
  '$q',
  '$translate',
  'UserAccount.services.doubleAuth.sms',
  'UserAccount.services.doubleAuth.totp',
  'UserAccount.services.doubleAuth.u2f',
  'UserAccount.services.doubleAuth.backupCode',
  'Alerter',
  function UserAccountDoubleAuthController(
    $scope,
    $q,
    $translate,
    DoubleAuthSmsService,
    DoubleAuthTotpService,
    DoubleAuthU2fService,
    DoubleAuthBackupCodeService,
    Alerter,
  ) {
    $scope.doubleAuth = {
      sms: 'disabled',
      totp: 'disabled',
      u2f: 'disabled',
      backupCode: 'disabled',
      isLoading: false,
    };

    $scope.images = SECURITY_IMAGES;

    /* ===============================
    =            HELPERS            =
    =============================== */

    /**
     * Fetch SMS details.
     * @return {Promise}
     */
    function fetchSmsDetails() {
      return DoubleAuthSmsService.query()
        .then((smsIds) =>
          $q
            .all(map(smsIds, (smsId) => DoubleAuthSmsService.get(smsId)))
            .then((smsDetails) => {
              if (some(smsDetails, { status: 'enabled' })) {
                $scope.doubleAuth.sms = 'active';
              } else if (some(smsDetails, { status: 'disabled' })) {
                $scope.doubleAuth.sms = 'enabled';
              } else {
                $scope.doubleAuth.sms = 'disabled';
              }
              return smsDetails;
            }),
        )
        .catch((err) =>
          Alerter.alertFromSWS(
            $translate.instant(
              'user_account_security_double_auth_type_sms_error',
            ),
            err.data,
            'doubleAuthAlert',
          ),
        );
    }

    /**
     * Fetch TOTP details.
     * @return {Promise}
     */
    function fetchTotpDetails() {
      return DoubleAuthTotpService.query()
        .then((totpIds) =>
          $q
            .all(map(totpIds, (totpId) => DoubleAuthTotpService.get(totpId)))
            .then((totpDetails) => {
              if (some(totpDetails, { status: 'enabled' })) {
                $scope.doubleAuth.totp = 'active';
              } else if (some(totpDetails, { status: 'disabled' })) {
                $scope.doubleAuth.totp = 'enabled';
              } else {
                $scope.doubleAuth.totp = 'disabled';
              }
              return totpDetails;
            }),
        )
        .catch((err) =>
          Alerter.alertFromSWS(
            $translate.instant(
              'user_account_security_double_auth_type_totp_error',
            ),
            err.data,
            'doubleAuthAlert',
          ),
        );
    }

    /**
     * Fetch U2F details.
     * @return {Promise}
     */
    function fetchU2fDetails() {
      return DoubleAuthU2fService.query()
        .then((u2fIds) =>
          $q
            .all(map(u2fIds, (u2fId) => DoubleAuthU2fService.get(u2fId)))
            .then((u2fDetails) => {
              if (some(u2fDetails, { status: 'enabled' })) {
                $scope.doubleAuth.u2f = 'active';
              } else if (some(u2fDetails, { status: 'disabled' })) {
                $scope.doubleAuth.u2f = 'enabled';
              } else {
                $scope.doubleAuth.u2f = 'disabled';
              }
              return u2fDetails;
            }),
        )
        .catch((err) =>
          Alerter.alertFromSWS(
            $translate.instant(
              'user_account_security_double_auth_type_u2f_error',
            ),
            err.data,
            'doubleAuthAlert',
          ),
        );
    }

    /**
     * Fetch BackupCode details.
     * @return {Promise}
     */
    function fetchBackupCode() {
      return DoubleAuthBackupCodeService.get()
        .then((sotpAccount) => {
          if (get(sotpAccount, 'status') === 'enabled') {
            $scope.doubleAuth.backupCode = 'active';
          }
          return sotpAccount;
        })
        .catch((err) => {
          if (err.status !== 404) {
            Alerter.alertFromSWS(
              $translate.instant(
                'user_account_security_double_auth_type_backup_code_error',
              ),
              err.data,
              'doubleAuthAlert',
            );
          }
          $scope.doubleAuth.backupCode = 'disabled';
        });
    }

    /**
     * Check if has 2FA enabled.
     * @return {Boolean}
     */
    $scope.has2faEnabled = () =>
      indexOf(values($scope.doubleAuth), 'enabled') !== -1 ||
      $scope.has2faActivated();

    /**
     * Check if has 2FA activated.
     * @return {Boolean}
     */
    $scope.has2faActivated = () =>
      indexOf(values($scope.doubleAuth), 'active') !== -1;

    /**
     * Does 2fa Sms is available.
     * @type {Boolean}
     */
    $scope.does2faSmsIsAvailable = () => DoubleAuthSmsService.isSupported();

    /* -----  End of HELPERS  ------ */

    /* ==============================
    =            EVENTS            =
    ============================== */

    $scope.$on('doubleAuthSMS.reload', fetchSmsDetails);
    $scope.$on('doubleAuthTOTP.reload', fetchTotpDetails);
    $scope.$on('doubleAuthU2F.reload', fetchU2fDetails);
    $scope.$on('doubleAuthBackupCode.reload', fetchBackupCode);

    /* -----  End of EVENTS  ----- */

    /* ======================================
    =            INITIALIZATION            =
    ====================================== */

    /**
     * Init.
     * @return {Promise}
     */
    $scope.init = () => {
      const promises = {
        totp: fetchTotpDetails(),
        u2f: fetchU2fDetails(),
        backupCode: fetchBackupCode(),
      };
      if ($scope.does2faSmsIsAvailable()) {
        promises.sms = fetchSmsDetails();
      }
      $scope.doubleAuth.isLoading = true;
      return $q
        .all(promises)
        .catch((err) =>
          Alerter.alertFromSWS(
            $translate.instant('user_account_security_double_auth_error'),
            err.data,
            'doubleAuthAlert',
          ),
        )
        .finally(() => {
          $scope.doubleAuth.isLoading = false;
        });
    };

    /* -----  End of INITIALIZATION  ------ */
  },
];
