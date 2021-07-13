import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import set from 'lodash/set';

import { GDPR_AGREEMENTS_INFOS } from './user-agreements.constant';

export default /* @ngInject */ function UserAccountAgreementsService(
  $cacheFactory,
  $http,
  $q,
  $translate,
  accountMigrationService,
) {
  const userAgreementsCache = $cacheFactory('USER_AGREEMENTS');

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
    return $http.get('/me/agreements').then((response) => response.data);
  };

  this.getAgreement = function getAgreement(agreementId) {
    return this.getAgreementIds().then((agreementIds) =>
      agreementIds.includes(agreementId)
        ? $http
            .get(`/me/agreements/${agreementId}`)
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
            .get(`/me/agreements/${contractId}/contract`)
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
        set(pendingAgreements, 'count', pendingAgreements.list.results.length);
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
          .post(`/me/agreements/${contract.id}/accept`)
          .then(formatList)
          .then(getSuccessDataOrReject)
          .then((response) => {
            userAgreementsCache.removeAll();
            return response;
          });
  };
}
