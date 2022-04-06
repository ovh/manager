import assignIn from 'lodash/assignIn';
import findLast from 'lodash/findLast';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import startsWith from 'lodash/startsWith';

angular.module('controllers').controller(
  'controllers.Domain.Redirection.add',
  class DomainRedirectionAddCtrl {
    constructor(
      $scope,
      $rootScope,
      $translate,
      Alerter,
      Domain,
      DomainValidator,
      WucValidator,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.DomainValidator = DomainValidator;
      this.WucValidator = WucValidator;
    }

    $onInit() {
      this.choice = {
        web: 'web',
        server: 'server',
        visible: 'visible',
        invisible: 'invisible',
        ip: 'AorAAAA',
        cname: 'CNAME',
        r301: '301',
        r302: 'TXT302',
        iframe: 'TXTiframe',
      };
      this.const = {
        limitChar: 245,
      };
      this.errors = {
        domainCname: false,
        webTarget: false,
        webTargetLength: false,

        ortTitle: false,
        ortKeywords: false,
        ortDescription: false,

        containOneError: false,
        containAllError: true,
        conflict: false,
        wwwhasError: false,

        checkValidity: false,
      };
      this.loading = {
        add: false,
        check: false,
      };
      this.newRedirection = {
        domain: this.$scope.currentActionData,
        subdomain: get(this.$scope.currentActionData, 'subdomainPreset', null),
        subdomainWww: 'www',
        addwww: false, // checkbox
        disableWww: false, // disable checkbox
        step2: null,
        step3: null,
        step4: null,
        webTarget: null, // ORT value
        webTargetdetail: {
          webTargetTitle: null, // ORT value
          webTargetKeywords: null, // ORT value
          webTargetDescription: null, // ORT value
        },
        ipTarget: null, // IP value
        serverTarget: null, // CNAME value

        listValidRedirection: [], // callback SWS

        params: {
          // sws params
          subDomain: null,
          typeRedirection: null,
          targetRedirection: null,
          visibilityType: null,
          webTargetTitle: null,
          webTargetKeywords: null,
          webTargetDescription: null,
        },
      };
      this.overwrite = false;
      this.shouldIncludeDomain = false;
      this.typeRedirection = {
        txt: 'TXT',
        cname: 'CNAME',
        ipv4: 'A',
        ipv6: 'AAAA',
      };

      this.$scope.addRedirection = () => this.addRedirection();
      this.$scope.checkValidity = () => this.checkValidity();
      this.$scope.initCheckVariable = () => this.initCheckVariable();
    }

    // --------------------UTILS--------------------

    getCompleteTarget() {
      let redirectionTarget = this.newRedirection.serverTarget;
      if (
        !isEmpty(redirectionTarget) &&
        this.shouldIncludeDomain &&
        isString(this.newRedirection.domain.name)
      ) {
        redirectionTarget += `.${this.newRedirection.domain.name}`;
      }

      return redirectionTarget ? redirectionTarget.replace(/[<>]/g, '') : '';
    }

    static getDisplayOption(value) {
      return !angular.isUndefined(value) && value !== null && value !== ''
        ? value
        : '-';
    }

    /**
     * Return concat subDomain with domain or just domain
     * @param {string} subDomain
     * @returns {string}
     */
    getDomainNameOf(subDomain) {
      return (
        (subDomain !== null && subDomain !== ''
          ? `${punycode.toUnicode(subDomain)}.`
          : '') + this.newRedirection.domain.displayName
      );
    }

    /**
     * Return concat subDomain with domain or just domain
     * @returns {string}
     */
    getSmallDomainNameOf() {
      if (
        this.errors.containOneError &&
        !this.errors.containAllError &&
        this.errors.wwwhasError
      ) {
        return this.getDomainNameOf(this.newRedirection.subdomain);
      }
      if (
        this.newRedirection.addwww &&
        !this.newRedirection.disableWww &&
        this.errors.containOneError &&
        !this.errors.containAllError &&
        !this.errors.wwwhasError
      ) {
        return this.getDomainNameOf(this.newRedirection.subdomainWww);
      }
      return (
        ((this.newRedirection.addwww &&
          !this.newRedirection.disableWww &&
          this.$translate.instant('domain_tab_REDIRECTION_add_www')) ||
          '') + this.getDomainNameOf(this.newRedirection.subdomain)
      );
    }

    /**
     * return last redirection contain conflit
     * @param {Array} table
     */
    getLastError(table) {
      const record = findLast(
        table,
        (r) => !this.constructor.isValidRedirection(r),
      );
      if (record) {
        return this.getDomainNameOf(record.subDomain);
      }
      return '';
    }

    /**
     * Return 'subdomain.domain and www.subdomain.domain' or just 'subdomain.domain'
     * @returns {Array}
     */
    getTitle() {
      return {
        t0: this.getDomainNameOf(this.newRedirection.subdomain),
        t1:
          (this.newRedirection.addwww &&
            !this.newRedirection.disableWww &&
            this.$translate.instant('domain_and', {
              t0: this.getDomainNameOf(this.newRedirection.subdomainWww),
            })) ||
          '',
      };
    }

    /**
     * Use for display type of conflit redirection
     * @param tableA
     * @param tableORT
     * @returns {boolean}
     */
    isORTiP(tableA, tableORT) {
      let bool = true;
      forEach(tableA, (itemA) => {
        if (!includes(tableORT, itemA)) {
          bool = false;
        }
      });
      this.errors.conflict = !bool;
      return bool;
    }

    /**
     * Use for display type of conflit redirection
     * @param table
     * @param searchLabel
     * @returns {boolean}
     */
    static lodashContain(table, searchLabel) {
      return includes(table, searchLabel);
    }

    testInputSize(val) {
      if (!this.newRedirection.subdomain) {
        return false;
      }
      const punySubDomain = punycode.toASCII(this.newRedirection.subdomain);
      const subDomainLength = this.newRedirection.subdomain
        ? punySubDomain.length
        : 0;
      return val && this.const.limitChar - subDomainLength - val.length < 0;
    }

    redirectionTargetChange() {
      if (isEmpty(this.newRedirection.serverTarget)) {
        this.errors.redirectionTarget = true;
        this.errors.domainCname = true;
      } else {
        const domainName = this.getCompleteTarget();
        this.errors.redirectionTarget = !this.WucValidator.isValidDomain(
          domainName,
        );
        this.errors.domainCname = this.errors.redirectionTarget;

        if (this.errors.redirectionTarget) {
          this.errorLabel = this.$translate.instant(
            'domain_tab_REDIRECTION_edit_server_cname_error',
          );
        }
      }
    }

    setTargetRedirection() {
      this.newRedirection.step3 = null;
      this.newRedirection.params.visibilityType = null;
      this.newRedirection.params.typeRedirection = null;
    }

    setTypeRedirection() {
      if (this.newRedirection.step3 === this.choice.cname) {
        this.newRedirection.params.typeRedirection = this.typeRedirection.cname;
      } else {
        this.newRedirection.params.typeRedirection = null;
      }
    }

    setTypeVisibility() {
      if (this.newRedirection.step3 === this.choice.visible) {
        this.newRedirection.params.visibilityType = 'VISIBLE';
      } else if (this.newRedirection.step3 === this.choice.invisible) {
        this.newRedirection.params.visibilityType = 'INVISIBLE';
      } else {
        this.newRedirection.params.visibilityType = null;
      }
    }

    // -------------------- VALIDATIONS -----------------------
    /**
     * Valid an ipv4 or ipv6
     * @param {string} ip
     */
    ipaddrValid(ip) {
      if (this.WucValidator.isValidIpv4(ip)) {
        return this.typeRedirection.ipv4;
      }
      if (this.WucValidator.isValidIpv6(ip)) {
        return this.typeRedirection.ipv6;
      }
      return false;
    }

    /**
     * Return if redirection has conflit with another redirection
     * @param {object} redirection
     * @returns {boolean}
     */
    static isValidRedirection(redirection) {
      return (
        redirection.state === 'OK' && isEmpty(redirection.listBlockingType)
      );
    }

    subDomainCheck(input) {
      const subDomain = this.newRedirection.subdomain;
      const isValid =
        subDomain === null ||
        subDomain === '' ||
        subDomain === '*' ||
        this.DomainValidator.isValidTarget(
          `${subDomain}.${this.newRedirection.domain.displayName}`,
          'CNAME',
        );
      input.$setValidity('subdomain', isValid);

      if (subDomain !== null && subDomain !== '') {
        this.newRedirection.disableWww =
          subDomain === 'www' || startsWith(subDomain, 'www.');
        this.newRedirection.subdomainWww = !this.newRedirection.disableWww
          ? `www.${subDomain}`
          : 'www';
      } else {
        this.newRedirection.disableWww = false;
        this.newRedirection.subdomainWww = 'www';
      }
    }

    /**
     * Valid web target on step 4 ORT
     */
    webTargetCheck() {
      const { webTarget } = this.newRedirection;
      if (webTarget) {
        this.errors.webTarget = !this.WucValidator.isValidURL(webTarget);
        this.errors.webTargetLength =
          !this.errors.webTarget && webTarget && this.testInputSize(webTarget);
      }
    }

    /**
     * Valid web target on step 4 description option
     */
    webTargetDescriptionCheck() {
      this.errors.ortDescription = this.testInputSize(
        this.newRedirection.webTargetdetail.webTargetDescription,
      );
    }

    /**
     * Valid web target on step 4 keywords option
     */
    webTargetKeywordsCheck() {
      this.errors.ortKeywords = this.testInputSize(
        this.newRedirection.webTargetdetail.webTargetKeywords,
      );
    }

    /**
     * Valid web target on step 4 title option
     */
    webTargetTitleCheck() {
      this.errors.ortTitle = this.testInputSize(
        this.newRedirection.webTargetdetail.webTargetTitle,
      );
    }

    /**
     * Step 4 validation
     * @returns {boolean}
     */
    step4Validator() {
      if (this.newRedirection.step2 === this.choice.web) {
        if (this.newRedirection.step3 === this.choice.visible) {
          if (
            this.newRedirection.webTarget &&
            !this.errors.webTarget &&
            !this.errors.webTargetLength &&
            this.newRedirection.step4 === this.choice.r301
          ) {
            this.newRedirection.params.typeRedirection = this.typeRedirection.txt;
            this.newRedirection.params.targetRedirection = this.newRedirection.webTarget;
            this.newRedirection.params.visibilityType = 'VISIBLE_PERMANENT';
            return this.WucValidator.isValidURL(
              this.newRedirection.params.targetRedirection,
            );
          }

          if (
            this.newRedirection.webTarget &&
            !this.errors.webTarget &&
            !this.errors.webTargetLength &&
            this.newRedirection.step4 === this.choice.r302
          ) {
            this.newRedirection.params.typeRedirection = this.typeRedirection.txt;
            this.newRedirection.params.targetRedirection = this.newRedirection.webTarget;
            return this.WucValidator.isValidURL(
              this.newRedirection.params.targetRedirection,
            );
          }
        } else if (this.newRedirection.step3 === this.choice.invisible) {
          if (
            this.newRedirection.webTarget &&
            !this.errors.webTarget &&
            !this.errors.webTargetLength &&
            !this.errors.ortTitle &&
            !this.errors.ortKeywords &&
            !this.errors.ortDescription &&
            this.newRedirection.step4 === this.choice.iframe
          ) {
            this.newRedirection.params.typeRedirection = this.typeRedirection.txt;
            this.newRedirection.params.targetRedirection = this.newRedirection.webTarget;
            return true;
          }
        }
      } else if (this.newRedirection.step2 === this.choice.server) {
        if (this.newRedirection.step3 === this.choice.ip) {
          const validIP =
            this.newRedirection.ipTarget &&
            this.ipaddrValid(this.newRedirection.ipTarget);
          if (validIP) {
            this.newRedirection.params.typeRedirection = validIP;
            this.newRedirection.params.targetRedirection = this.newRedirection.ipTarget;
            return true;
          }
        } else if (this.newRedirection.step3 === this.choice.cname) {
          if (this.newRedirection.serverTarget && !this.errors.domainCname) {
            this.newRedirection.params.targetRedirection = this.getCompleteTarget();
            return true;
          }
        }
      }

      return false;
    }

    // --------------------CHECK VALIDATION--------------------

    /**
     * Init check boolean
     */
    initCheckVariable() {
      this.errors.containOneError = false;
      this.errors.containAllError = true;
      this.errors.wwwhasError = false;
      this.errors.checkValidity = false;
    }

    /**
     * Call ws to check if redirection has conflits
     */
    checkValidity() {
      const subDomain = this.newRedirection.subdomain || '';
      this.loading.check = true;
      this.initCheckVariable();

      if (!this.newRedirection.params.visibilityType) {
        this.newRedirection.params.visibilityType = 'INVISIBLE';
      }

      this.Domain.checkRedirectionAdd(this.newRedirection.domain.name, {
        params: assignIn(this.newRedirection.params, { subDomain }),
        considerWww:
          this.newRedirection.addwww && !this.newRedirection.disableWww,
      })
        .then((ids) => {
          this.newRedirection.listValidRedirection = ids;

          // min 1 elt, max 2
          forEach(ids, (resultIds) => {
            if (this.constructor.isValidRedirection(resultIds)) {
              this.errors.containAllError = false;
            } else {
              this.errors.containOneError = true;
              if (get(resultIds, 'isWww', false)) {
                this.errors.wwwhasError = true;
              }
            }
          });
        })
        .catch(() => {
          this.errors.checkValidity = true;
        })
        .finally(() => {
          this.loading.check = false;
        });
    }

    // --------------------ADD REDIRECTION(S)--------------------

    addRedirection() {
      const subDomain = this.newRedirection.subdomain || '';

      if (this.newRedirection.step3 === this.choice.cname) {
        // adding a dot prevents unwanted domain name
        this.newRedirection.params.targetRedirection += '.';
      }

      this.loading.add = true;
      this.Domain.overwriteRedirection(
        this.newRedirection.domain.name,
        {
          params: assignIn(this.newRedirection.params, {
            subDomain,
            detailORT: this.newRedirection.webTargetdetail,
          }),
          considerWww:
            this.newRedirection.addwww && !this.newRedirection.disableWww,
        },
        this.errors.conflict ||
          this.errors.containAllError ||
          this.errors.containOneError
          ? this.newRedirection.listValidRedirection
          : null,
      )
        .then((tab) => {
          let nbError = 0;
          forEach(tab, (item) => {
            if (item.result && item.result.type === 'ERROR') {
              nbError += 1;
            }
          });

          if (nbError === tab.length) {
            this.Alerter.error(
              this.$translate.instant('domain_tab_REDIRECTION_add_error'),
              this.$scope.alerts.main,
            );
          } else if (nbError !== 0) {
            this.Alerter.alertFromSWS(
              this.$translate.instant('domain_tab_REDIRECTION_add_partial'),
              'PARTIAL',
              this.$scope.alerts.main,
            );
          } else {
            this.Alerter.success(
              this.$translate.instant('domain_tab_REDIRECTION_add_success'),
              this.$scope.alerts.main,
            );
          }
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_REDIRECTION_delete_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.add = false;
          this.$rootScope.$broadcast('domain.tabs.redirection.reload', true);
          this.$scope.resetAction();
        });
    }
  },
);
