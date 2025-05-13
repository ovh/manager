import assign from 'lodash/assign';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import pick from 'lodash/pick';

angular.module('controllers').controller(
  'controllers.Domain.Redirection.edit',
  class RedirectionEdit {
    /* @ngInject */
    constructor(
      $scope,
      $rootScope,
      $translate,
      Alerter,
      DomainRedirection,
      WucValidator,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$translate = $translate;
      this.alerter = Alerter;
      this.service = DomainRedirection;
      this.validator = WucValidator;
    }

    $onInit() {
      this.displayName = this.$scope.currentActionData.displayName;
      this.redirection = angular.copy(
        this.$scope.currentActionData.redirection,
      );
      this.redirectionTarget = this.redirection.targetDisplayName;

      this.loading = false;
      this.errors = {
        redirectionTarget: false,
        targetLength: false,
        ortTitle: false,
        ortKeywords: false,
        ortDescription: false,
      };
      this.shouldIncludeDomain = false;
      this.unknownFieldDisplayTypeErrorMessageId =
        'domain_tab_REDIRECTION_edit_fail';

      // Binds this to the functions used in the scope
      this.$scope.editRedirection = this.editRedirection.bind(this);
      this.$scope.editContainsNoError = this.editContainsNoError.bind(this);
    }

    /**
     * @returns {Boolean} True if the length is valid and the target is not empty
     */
    isTargetValid() {
      const completeTarget = this.getCompleteTarget();
      return (
        !isEmpty(this.redirectionTarget) &&
        this.constructor.isLengthValid(completeTarget)
      );
    }

    /**
     * @returns {String} Message for the label for a non-ort redirection
     */
    getNonOrtLabel() {
      let message;

      switch (this.redirection.fieldDisplayType) {
        case 'A':
          message = 'domain_tab_REDIRECTION_edit_server_ipv4_label';
          break;
        case 'AAAA':
          message = 'domain_tab_REDIRECTION_edit_server_ipv6_label';
          break;
        case 'CNAME':
          message = 'domain_tab_REDIRECTION_edit_server_cname_label';
          break;
        default: {
          const errorMessage = this.$translate.instant(
            this.unknownFieldDisplayTypeErrorMessageId,
            { t0: this.redirection.fieldDisplayType },
          );
          this.alerter.alertFromSWS(
            this.$translate.instant('domain_tab_REDIRECTION_edit_fail', {
              t0: this.displayName,
            }),
            errorMessage,
            this.$scope.alerts.main,
          );
          this.$scope.resetAction();
        }
      }

      return this.$translate.instant(message);
    }

    /**
     * @returns {String} True if no error was detected in the different inputs
     */
    inputContainErrors() {
      return includes(this.errors, true);
    }

    /**
     * @returns {String} The target + the zone if the checkbox is selected
     */
    getCompleteTarget() {
      let { redirectionTarget } = this;

      if (this.shouldIncludeDomain && isString(this.redirection.zone)) {
        redirectionTarget += `.${this.redirection.zone}`;
      }

      return redirectionTarget;
    }

    /**
     * @returns {String} Change the error message for non-ort redirection
     */
    changeErrorLabel() {
      let message;

      if (this.inputContainErrors()) {
        switch (this.redirection.fieldDisplayType) {
          case 'A':
            message = 'domain_tab_REDIRECTION_edit_server_ipv4_error';
            break;
          case 'AAAA':
            message = 'domain_tab_REDIRECTION_edit_server_ipv6_error';
            break;
          case 'CNAME':
            message = 'domain_tab_REDIRECTION_edit_server_cname_error';
            break;
          default: {
            const errorMessage = this.$translate.instant(
              this.unknownFieldDisplayTypeErrorMessageId,
              { t0: this.redirection.fieldDisplayType },
            );
            this.alerter.alertFromSWS(
              this.$translate.instant('domain_tab_REDIRECTION_edit_fail', {
                t0: this.displayName,
              }),
              errorMessage,
              this.$scope.alerts.main,
            );
            this.$scope.resetAction();
          }
        }
      }

      this.errorLabel = this.$translate.instant(message);
    }

    /**
     * Detects errors on ort redirections
     */
    redirectionChange() {
      if (this.redirection.isOrt) {
        this.errors.ortTitle = !this.constructor.isLengthValid(
          this.redirection.title,
        );
        this.errors.ortKeywords = !this.constructor.isLengthValid(
          this.redirection.keywords,
        );
        this.errors.ortDescription = !this.constructor.isLengthValid(
          this.redirection.description,
        );
      }
    }

    /**
     * Detects errors on all redirections
     */
    redirectionTargetChange() {
      if (isEmpty(this.redirectionTarget)) {
        this.errors.redirectionTarget = true;
      } else if (this.redirection.isOrt) {
        this.errors.redirectionTarget = !this.validator.isValidURL(
          this.redirectionTarget,
        );
        this.errors.targetLength = !this.isTargetValid();
      } else {
        switch (this.redirection.fieldDisplayType) {
          case 'A':
            this.errors.redirectionTarget = !this.validator.isValidIpv4(
              this.redirectionTarget,
            );
            break;
          case 'AAAA':
            this.errors.redirectionTarget = !this.validator.isValidIpv6(
              this.redirectionTarget,
            );
            break;
          case 'CNAME': {
            const domainName = this.getCompleteTarget();
            this.errors.redirectionTarget = !this.validator.isValidDomain(
              domainName,
            );
            break;
          }
          default: {
            const errorMessage = this.$translate.instant(
              this.unknownFieldDisplayTypeErrorMessageId,
              { t0: this.redirection.fieldDisplayType },
            );
            this.alerter.alertFromSWS(
              this.$translate.instant('domain_tab_REDIRECTION_edit_fail', {
                t0: this.displayName,
              }),
              errorMessage,
              this.$scope.alerts.main,
            );
            this.$scope.resetAction();
          }
        }

        this.changeErrorLabel();
      }
    }

    /**
     * @returns {Boolean} True if the total url size (target + subdomain)
     * is less than 245
     */
    isTargetLengthValid() {
      let value = this.redirectionTarget;
      const shouldAppendZone =
        this.shouldIncludeDomain &&
        isString(this.redirection.fieldDisplayType) &&
        this.redirection.fieldDisplayType.toUpperCase() === 'CNAME';

      if (shouldAppendZone) {
        value += `${this.redirection.zone}.`;
      }

      return this.constructor.isLengthValid(value);
    }

    /**
     * Is a parameter short enough to fit in the put request ?
     * @param {String} value
     */
    static isLengthValid(value) {
      const maxSize = 245;
      const valueLength = !isString(value) ? value.length : 0;
      return maxSize - valueLength > 0;
    }

    /**
     * @returns {Boolean} If the page is not loading and doesn't contain errors
     */
    editContainsNoError() {
      return !this.isLoading && !this.inputContainErrors();
    }

    /**
     * Calls the service to put the redirection
     */
    editRedirection() {
      let data = {
        target: this.includeDomainToTarget(),
      };

      let method = 'put';
      this.isLoading = true;

      if (this.redirection.isOrt) {
        data = assign(
          data,
          pick(this.redirection, ['description', 'keywords', 'title']),
        );
        method = 'putOrt';
      }

      this.service[method](this.redirection.id, data)
        .then(() =>
          this.alerter.success(
            this.$translate.instant('domain_tab_REDIRECTION_edit_success', {
              t0: this.displayName,
            }),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.alerter.alertFromSWS(
            this.$translate.instant('domain_tab_REDIRECTION_edit_fail', {
              t0: this.displayName,
            }),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.isLoading = false;
          this.$scope.resetAction();
          this.$rootScope.$broadcast('domain.tabs.redirection.reload', true);
          this.shouldIncludeDomain = false;
        });
    }

    /**
     * Includes a dot at the end of the target name if the target is a CNAME
     * and the user doesn't want the domain included at the end of the target
     * @returns {String} Redirection target with a trailing dot if needed
     */
    includeDomainToTarget() {
      const endsWithDot = this.redirectionTarget.match(/.*\.$/);
      const targetIsCNAME =
        isString(this.redirection.fieldDisplayType) &&
        this.redirection.fieldDisplayType.toUpperCase() === 'CNAME';
      const shouldDeleteTrailingDot =
        endsWithDot && this.shouldIncludeDomain && targetIsCNAME;
      const shouldAddTrailingDot =
        !endsWithDot && !this.shouldIncludeDomain && targetIsCNAME;

      if (shouldDeleteTrailingDot) {
        return this.redirectionTarget.substring(
          0,
          this.redirectionTarget.length - 1,
        );
      }

      if (shouldAddTrailingDot) {
        return `${this.redirectionTarget}.`;
      }

      return this.redirectionTarget;
    }
  },
);
