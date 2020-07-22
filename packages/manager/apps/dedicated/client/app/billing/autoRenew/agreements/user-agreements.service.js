import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';

angular.module('UserAccount').service('UserAccountServicesAgreements', [
  '$cacheFactory',
  '$http',
  '$q',
  '$translate',
  'accountMigrationService',
  'UserAccount.constants',
  'GDPR_AGREEMENTS_INFOS',
  function UserAccountAgreementsService(
    cache,
    $http,
    $q,
    $translate,
    accountMigrationService,
    constants,
    GDPR_AGREEMENTS_INFOS,
  ) {
    const userAgreementsCache = cache('USER_AGREEMENTS');

    const proxyPath = `${constants.swsProxyRootPath}me`;

    function getSuccessDataOrReject(response) {
      return response.status < 300 ? response.data : $q.reject(response.data);
    }

    function formatList(response) {
      if (
        response.data.list &&
        response.data.list.results &&
        response.data.list.results.length
      ) {
        response.data.list.results.forEach((agreement) => {
          if (
            find(GDPR_AGREEMENTS_INFOS, { agreementId: agreement.contractId })
          ) {
            set(
              agreement,
              'name',
              $translate.instant('user_agreement_GDPR_title'),
            );
          }
        });
      }
      return response;
    }

    this.getList = function getList(count, offset) {
      return $http
        .get('/sws/agreements', {
          cache: userAgreementsCache,
          params: {
            count,
            offset,
          },
          serviceType: 'aapi',
        })
        .then(formatList)
        .then(getSuccessDataOrReject);
    };

    this.getAgreementIds = function getAgreementIds() {
      return $http
        .get(`${proxyPath}/agreements`)
        .then((response) => response.data);
    };

    this.getAgreement = function getAgreement(agreementId) {
      return this.getAgreementIds().then((agreementIds) =>
        agreementIds.includes(agreementId)
          ? $http
              .get(`${proxyPath}/agreements/${agreementId}`)
              .then((response) => {
                if (response.data && response.data.contractId) {
                  const gdprAgreement = find(GDPR_AGREEMENTS_INFOS, {
                    agreementId: response.data.contractId,
                  });
                  if (gdprAgreement) {
                    response.data.title = $translate.instant(
                      'user_agreement_GDPR_title',
                    );
                    response.data.helperText = $translate.instant(
                      'user_agreement_GDPR_helper_text',
                      { agreementLink: gdprAgreement.url },
                    );
                  }
                }
                return response;
              })
              .then(getSuccessDataOrReject)
          : accountMigrationService.getAgreementDetails(agreementId),
      );
    };

    this.getContract = function getContract(contractId) {
      return this.getAgreementIds().then((agreementIds) =>
        agreementIds.includes(contractId)
          ? $http
              .get(`${proxyPath}/agreements/${contractId}/contract`)
              .then(getSuccessDataOrReject)
          : accountMigrationService.getContractInfo(contractId),
      );
    };

    this.getPendingAgreements = function getPendingAgreements() {
      return $http
        .get('/sws/agreements', {
          cache: userAgreementsCache,
          params: {
            count: 0,
            offset: 0,
            agreed: 'todo',
          },
          serviceType: 'aapi',
        })
        .then(formatList)
        .then(getSuccessDataOrReject);
    };

    this.getToValidate = function getToValidate() {
      return $q
        .all([
          this.getPendingAgreements(),
          this.getPendingAccountMigrationAgreements(),
        ])
        .then(([pendingAgreements, pendingAccountMigrationAgreements]) => {
          const sortByDate = (a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
          };
          pendingAccountMigrationAgreements.sort(sortByDate);
          pendingAgreements.list.results.sort(sortByDate);
          set(
            pendingAgreements,
            'list.results',
            pendingAgreements.list.results.concat(
              pendingAccountMigrationAgreements,
            ),
          );
          set(
            pendingAgreements,
            'count',
            pendingAgreements.list.results.length,
          );
          return pendingAgreements;
        });
    };

    this.getPendingAccountMigrationAgreements = function getAccountMigrationAgreements() {
      return accountMigrationService
        .getAllContracts()
        .then((agreements) => filter(agreements, { agreed: 'todo' }))
        .then((agreements) =>
          map(agreements, (agreement) => ({
            ...agreement,
            pdfUrl: agreement.pdf,
          })),
        );
    };

    this.accept = function accept(contract) {
      return contract.migrationId
        ? accountMigrationService.acceptAgreement(contract.contractId)
        : $http
            .post(`${proxyPath}/agreements/${contract.id}/accept`)
            .then(formatList)
            .then(getSuccessDataOrReject)
            .then((response) => {
              userAgreementsCache.removeAll();
              return response;
            });
    };
  },
]);
