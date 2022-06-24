import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
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

  this.currentGroup = null;
  this.parameterGroup = null;
  this.voicefaxPopoverOptions = {
    popoverPlacement: 'auto right',
    popoverClass: 'telephony-service-choice-popover pretty-popover',
    popoverAppendToBody: true,
    popoverIsOpen: false,
  };

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
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        const line = group.getLine($stateParams.serviceName);
        return line.getPhone();
      })
      .then((phone) => {
        const { maxline: length } = phone;
        self.availableParameters = Array.from({ length }, (v, i) => i + 1);
        return self.availableParameters;
      });
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
    self.parameterGroup = '';
    return OvhApiTelephonyFax.Aapi()
      .getServices()
      .$promise.then((faxList) => {
        const { availableParameters } = self;
        const { parameter } = self.FunctionKey;

        angular.forEach(faxList, (fax) => {
          availableParameters.push({
            label: fax.label,
            serviceName: fax.serviceName,
            group: $translate.instant(
              'telephony_line_phone_programmableKeys_FAX',
            ),
          });
        });

        if (
          parameter &&
          !availableParameters.find(
            ({ serviceName }) => parameter === serviceName,
          )
        ) {
          return TelephonyMediator.findService(self.FunctionKey.parameter).then(
            (service) => {
              if (service) {
                self.parameterGroup = service.billingAccount;
                availableParameters.push({
                  group: service.billingAccount,
                  serviceName: service.serviceName,
                  label: service.description,
                });
              }
              return availableParameters;
            },
          );
        }

        return availableParameters;
      });
  }

  function getHuntingParameter() {
    self.parameterGroup = '';
    return TelephonyMediator.getGroup($stateParams.billingAccount).then(
      (group) => {
        const { parameter } = self.FunctionKey;
        self.currentGroup = group;

        if (parameter) {
          return TelephonyMediator.findService(parameter).then((service) => {
            self.parameterGroup = service?.billingAccount;
            return self.availableParameters;
          });
        }

        return self.availableParameters;
      },
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
      case 'cloudhunting':
        request = getHuntingParameter();
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

  self.onVoicefaxParameterChanged = (selectedService) => {
    self.voicefaxPopoverOptions.popoverIsOpen = false;
    if (
      !self.availableParameters.find(
        ({ group, serviceName }) =>
          serviceName === selectedService.serviceName &&
          group === selectedService.billingAccount,
      )
    ) {
      self.availableParameters.push({
        group: selectedService.billingAccount,
        serviceName: selectedService.serviceName,
        label: selectedService.description,
      });
    }
  };

  self.filterHuntingParameters = (group) => {
    const { billingAccount } = group;
    const line = self.currentGroup.getLine($stateParams.serviceName);

    return $q
      .all(
        [
          OvhApiTelephonyOvhPabx,
          OvhApiTelephonyEasyPabx,
          OvhApiTelephonyMiniPabx,
        ].map((pabxResource) =>
          pabxResource
            .v6()
            .query({ billingAccount })
            .$promise.then((serviceNames) =>
              $q
                .all(
                  serviceNames.map((serviceName) =>
                    pabxResource
                      .v6()
                      .queryAgent({ billingAccount, serviceName })
                      .$promise.catch(() => [])
                      .then((agents) =>
                        agents.some((agent) =>
                          agent.toString().match(line.serviceName),
                        )
                          ? group.getNumber(serviceName)
                          : null,
                      ),
                  ),
                )
                .then((numbers) => numbers.filter(Boolean)),
            ),
        ),
      )
      .then((services) => services.flat());
  };

  self.filterCloudHuntingParameters = (group) => {
    const allowedFeatureTypes = [
      'cloudHunting',
      'contactCenterSolution',
      'contactCenterSolutionExpert',
    ];
    return group.numbers.filter((number) =>
      allowedFeatureTypes.includes(number.feature.featureType),
    );
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
