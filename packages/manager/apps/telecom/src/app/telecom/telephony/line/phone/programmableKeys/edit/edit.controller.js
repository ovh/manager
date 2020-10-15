import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import includes from 'lodash/includes';
import set from 'lodash/set';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';

export default /* @ngInject */
function TelecomTelephonyLinePhoneProgammableKeysEditCtrl(
  $uibModalInstance,
  $stateParams,
  $q,
  $translate,
  $timeout,
  TelephonyGroupLinePhoneFunction,
  functionKey,
  TelephonyMediator,
  OvhApiMe,
  OvhApiTelephonyFax,
  OvhApiTelephonyMiniPabx,
  OvhApiTelephonyOvhPabx,
  OvhApiTelephonyEasyPabx,
) {
  const self = this;
  self.initialFunctionKey = cloneDeep(functionKey);

  this.loading = {
    save: false,
    parameters: false,
    init: false,
  };
  this.numberPattern = /^\+?(\d|\.| |#|-)+$/;
  this.urlPattern = /^http(?!s):/;

  this.saved = false;

  this.FunctionKey = functionKey;
  this.availableFunctions = [];
  this.availableParameters = [];

  this.save = function save() {
    self.loading.save = true;
    self.saved = false;

    self.FunctionKey.function = self.selectedFunction.value;

    return $q.all([self.FunctionKey.save(), $timeout(angular.noop, 1000)]).then(
      () => {
        self.loading.save = false;
        self.saved = true;

        return $timeout(self.close, 1000);
      },
      (error) => {
        self.FunctionKey = self.initialFunctionKey;
        return self.cancel({
          type: 'API',
          msg: error,
        });
      },
    );
  };

  this.cancel = function cancel(message) {
    return $uibModalInstance.dismiss(message);
  };

  this.close = function close() {
    return $uibModalInstance.close(true);
  };

  // Wait for a better API to avoid this kind of functions
  function orderFunctions(functionKeyParam) {
    const groupBy = {
      functions: [
        'CCL',
        'DIV',
        'ECT',
        'CONF',
        'ALT',
        'RTVL',
        'HOLD',
        'REJ',
        'BIS',
        'MEVO',
        'DIAL',
        'NONE',
        'EXT',
      ],
      services: [
        'CLIR',
        'CAW',
        'DND',
        'AAB',
        'ACR',
        'CFB',
        'CFNR',
        'CFUNUM',
        'CFUFAX',
        'CFUVM',
        'CFU',
        'COLR',
      ],
      overview: ['SUP2', 'SUP1', 'SUP0'],
      callGroup: [
        'HUNTOFF',
        'HUNTON',
        'CHUNTON',
        'CHUNTOFF',
        'CHUNTFW',
        'CHUNTSW',
      ],
      webServices: ['VXML', 'URL'],
    };
    const functionsToReturn = [];

    // ISO need to group select options and have translation for label
    forEach(groupBy, (availableValues, group) => {
      forEach(functionKeyParam, (key) => {
        if (~groupBy[group].indexOf(key)) {
          functionsToReturn.push({
            group: $translate.instant(
              `telephony_line_phone_programmableKeys_group_${group}`,
            ),
            functionLabel: $translate.instant(
              `telephony_line_phone_programmableKeys_${key}`,
            ),
            value: key,
          });
        }
      });
    });
    return sortBy(functionsToReturn, ['group', 'functionLabel']);
  }

  function findFunction(func) {
    return find(self.availableFunctions, (f) => f.value === func.function);
  }

  this.getParameterFunctions = function getParameterFunctions() {
    const type = {
      NONE: null,
      DIAL: 'number', // numero telephone,
      MEVO: null,
      BIS: null,
      REJ: null,
      HOLD: null,
      RTVL: null,
      ALT: null,
      CONF: null,
      ECT: null,
      DIV: null,
      CCL: null,
      COLR: null,
      CFU: null,
      CFUVM: 'voicefax', // Fax
      CFUFAX: 'voicefax', // Fax
      CFUNUM: 'number', // numero telephone
      CFNR: 'number', // numero telephone
      CFB: 'number', // numero telephone
      ACR: null,
      AAB: null,
      DND: null,
      CAW: null,
      CLIR: null,
      SUP0: 'sibling', // "ligne du meme groupe"
      SUP1: 'sibling', // "ligne du meme groupe"
      SUP2: 'sibling', // "ligne du meme groupe"
      HUNTON: 'hunting', // alias du groupe
      HUNTOFF: 'hunting', // alias du groupe
      CHUNTON: 'cloudhunting', // alias du groupe
      CHUNTOFF: 'cloudhunting', // alias du groupe
      CHUNTSW: 'cloudhunting', // alias du groupe
      CHUNTFW: 'number', // alias du groupe
      URL: 'url', // http
      VXML: 'url', // http
      EXT: 'dynamic', // call to  /telephony/line/offer/phones
    }[self.selectedFunction ? self.selectedFunction.value : 0];

    return type;
  };

  /* -----  End of Uggly function ------*/

  /**
   * Generate parameters for EXT function
   * Not very sexy :
   * We need to GetLine to know what phone is linked and what offers
   * Then nedd to get User to know country
   * Then need to get all availabler offers
   * Need to match available offers and current offers
   * Then get Phone available to this offer for this country
   * need to match available phone and current phone
   * And get maxLine to generere available params for EXT function...
   * */
  function getDynamicParameters() {
    return TelephonyMediator.getGroup($stateParams.billingAccount).then(
      (group) => {
        const line = group.getLine($stateParams.serviceName);
        const phone = get(line, 'phone');
        const extValues = [];

        for (let i = 0; i < phone.maxline; i += 1) {
          extValues.push(`${i + 1}`);
        }
        self.availableParameters = extValues;
        return self.availableParameters;
      },
    );
  }

  function getSiblingParameters() {
    return TelephonyMediator.getGroup($stateParams.billingAccount).then(
      (group) => {
        self.availableParameters = sortBy(group.lines, [
          'description',
          'serviceName',
        ]);
        return self.availableParameters;
      },
    );
  }

  function getFaxParameters() {
    return $q
      .all([
        OvhApiTelephonyFax.Aapi()
          .getServices()
          .$promise.then((faxList) => {
            angular.forEach(faxList, (fax) => {
              self.availableParameters.push({
                label: fax.label,
                serviceName: fax.serviceName,
                group: $translate.instant(
                  'telephony_line_phone_programmableKeys_FAX',
                ),
              });
            });
          }),
        TelephonyMediator.init().then((groups) => {
          angular.forEach(groups, (group) => {
            angular.forEach(group.lines, (line) => {
              self.availableParameters.push({
                group: group.description || group.billingAccount,
                serviceName: line.serviceName,
                label: line.description,
              });
            });
            angular.forEach(group.numbers, (number) => {
              self.availableParameters.push({
                group: group.description || group.billingAccount,
                serviceName: number.serviceName,
                label: number.description,
              });
            });
          });
        }),
      ])
      .then(() => self.availableParameters);
  }

  function getHuntingParameter() {
    return TelephonyMediator.getGroup($stateParams.billingAccount).then(
      (curGroup) => {
        const pabxState = {
          ovh: OvhApiTelephonyOvhPabx,
          easy: OvhApiTelephonyEasyPabx,
          mini: OvhApiTelephonyMiniPabx,
          request: [],
        };
        const line = curGroup.getLine($stateParams.serviceName);

        /** TODO Optimize * */
        angular.forEach(TelephonyMediator.groups, (group) => {
          angular.forEach(['ovh', 'easy', 'mini'], (type) => {
            pabxState.request.push(
              pabxState[type]
                .v6()
                .query({
                  billingAccount: group.billingAccount,
                })
                .$promise.then((pabx) => {
                  const request = [];
                  angular.forEach(pabx, (abx) => {
                    request.push(
                      pabxState[type]
                        .v6()
                        .queryAgent({
                          billingAccount: group.billingAccount,
                          serviceName: abx,
                        })
                        .$promise.then((agents) => {
                          angular.forEach(agents, (agent) => {
                            if (
                              agent.toString().indexOf(line.serviceName) > -1
                            ) {
                              let numberDetail;
                              angular.forEach(group.numbers, (detail) => {
                                if (detail.serviceName === abx) {
                                  numberDetail = detail;
                                  numberDetail.billingAccount =
                                    group.description || group.billingAccount;
                                }
                              });
                              self.availableParameters.push(numberDetail);
                            }
                          });
                        }),
                    );
                  });

                  return $q.all(request).then(() => self.availableParameters);
                }),
            );
          });
        });

        return $q
          .all(pabxState.request)
          .then(() => uniqBy(self.availableParameters, 'serviceName'));
      },
    );
  }

  function getCloudHuntingParameter() {
    const allowedFeatureTypes = [
      'cloudHunting',
      'contactCenterSolution',
      'contactCenterSolutionExpert',
    ];
    return TelephonyMediator.getGroup($stateParams.billingAccount).then(
      () => {
        angular.forEach(TelephonyMediator.groups, (group) => {
          angular.forEach(group.numbers, (number) => {
            if (includes(allowedFeatureTypes, number.feature.featureType)) {
              set(
                number,
                'billingAccount',
                group.description || group.billingAccount,
              );
              self.availableParameters.push(number);
            }
          });
        });
        return self.availableParameters;
      },
      () => [],
    );
  }

  self.setParameters = function setParameters() {
    let request;

    // self.FunctionKey.parameter = null;
    self.loading.parameters = true;
    self.availableParameters = [];

    switch (self.getParameterFunctions()) {
      case 'dynamic':
        request = getDynamicParameters();
        break;
      case 'sibling':
        request = getSiblingParameters();
        break;
      case 'voicefax':
        request = getFaxParameters();
        break;
      case 'hunting':
        request = getHuntingParameter();
        break;
      case 'cloudhunting':
        request = getCloudHuntingParameter();
        break;
      default:
        request = $q.when(self.availableParameters);
    }

    return request
      .then((availableParameters) => {
        self.availableParameters = availableParameters;
      })
      .finally(() => {
        self.loading.parameters = false;
      });
  };

  const init = function init() {
    self.loading.init = true;

    return self.FunctionKey.getAvailableFunctions()
      .then((availableFunctions) => {
        self.availableFunctions = orderFunctions(availableFunctions);
        self.selectedFunction = findFunction(self.FunctionKey);
        return self.setParameters();
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  init();
}
