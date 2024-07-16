import find from 'lodash/find';
import set from 'lodash/set';

import { GDPR_AGREEMENTS_INFOS } from './user-agreements.constant';

export default /* @ngInject */ function UserAccountAgreementsService(
  $cacheFactory,
  $http,
  $q,
  $translate,
  constants,
) {
  const userAgreementsCache = $cacheFactory('USER_AGREEMENTS');

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
    return $http
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
      .then(getSuccessDataOrReject);
  };

  this.getContract = function getContract(contractId) {
    return $http
      .get(`${proxyPath}/agreements/${contractId}/contract`)
      .then(getSuccessDataOrReject);
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
    return $q.all([this.getPendingAgreements()]).then(([pendingAgreements]) => {
      const sortByDate = (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      };
      pendingAgreements.list.results.sort(sortByDate);
      set(pendingAgreements, 'count', pendingAgreements.list.results.length);
      return pendingAgreements;
    });
  };

  this.accept = function accept(contract) {
    return $http
      .post(`${proxyPath}/agreements/${contract.id}/accept`)
      .then(formatList)
      .then(getSuccessDataOrReject)
      .then((response) => {
        userAgreementsCache.removeAll();
        return response;
      });
  };
}
