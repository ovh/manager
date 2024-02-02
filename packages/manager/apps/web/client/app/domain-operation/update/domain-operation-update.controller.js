import clone from 'lodash/clone';
import isArray from 'lodash/isArray';
import join from 'lodash/join';
import map from 'lodash/map';
import { ALERTER_ID } from '../operation-table/operation-table.constants';

angular.module('App').controller(
  'DomainOperationUpdateCtrl',
  class DomainOperationUpdateCtrl {
    constructor(
      $scope,
      $q,
      $translate,
      Alerter,
      WucUser,
      coreURLBuilder,
      domainOperationService,
    ) {
      this.$scope = $scope;
      this.$q = $q;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.WucUser = WucUser;
      this.coreURLBuilder = coreURLBuilder;
      this.domainOperationService = domainOperationService;
    }

    $onInit() {
      this.operation = angular.copy(this.$scope.currentActionData);
      this.type = !this.operation.domain ? 'dns' : 'domain';

      this.baseArgs = [];
      this.canContinue =
        this.operation.canAccelerate ||
        this.operation.canCancel ||
        this.operation.canRelaunch;
      this.constraints = {};
      this.document = false;
      this.documents = {};
      this.files = {};
      this.loading = false;
      this.previousValue = {};
      this.todoOperation = null;
      this.uploadMode = {};
      this.viewMode = {};

      if (this.operation.canCancel) {
        this.todoOperation = 'cancel';
      } else if (this.operation.canRelaunch) {
        this.todoOperation = 'relaunch';
      } else if (this.operation.canAccelerate) {
        this.todoOperation = 'accelerate';
      }

      this.contactUrl = this.coreURLBuilder.buildURL('dedicated', '#/contact');

      this.$scope.updateOperation = () => this.updateOperation();

      this.loadOperationsArguments(this.operation.id);
    }

    static capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    loadOperationsArguments(operationId) {
      this.loading = true;

      return this.domainOperationService
        .getDomainOperationArguments(operationId)
        .then((argumentIds) => {
          const promises = map(argumentIds, (key) =>
            this.domainOperationService
              .getDomainOperationArgument(operationId, key)
              .then((originalArgument) => {
                const argument = clone(originalArgument);

                this.document =
                  this.document || argument.type === '/me/document';

                // add user friendly translations for some known tasks
                if (
                  [
                    'action',
                    'memberContactXXX',
                    'firstname',
                    'name',
                    'identificationNumber',
                  ].includes(argument.key)
                ) {
                  argument.keyTranslation = this.$translate.instant(
                    `domain_operations_update_key_${argument.key}`,
                  );
                }

                // set a default value
                if (
                  isArray(argument.acceptedValues) &&
                  argument.acceptedValues.length > 1
                ) {
                  [argument.value] = argument.acceptedValues;
                }

                if (argument.type === '/me/document') {
                  this.constraints[argument.key] = {};
                  this.constraints[argument.key].template =
                    argument.template || false;
                  this.constraints[argument.key].maximumSize =
                    argument.maximumSize || false;
                  this.constraints[argument.key].minimumSize =
                    argument.minimumSize || false;

                  if (argument.acceptedFormats) {
                    this.constraints[
                      argument.key
                    ].acceptedFormatsDisplay = argument.acceptedFormats.join(
                      ', ',
                    );
                    this.constraints[argument.key].acceptedFormats = join(
                      map(argument.acceptedFormats, (value) => `.${value}`),
                      ', ',
                    );
                  } else {
                    this.constraints[argument.key].acceptedFormats = '*';
                  }

                  if (argument.value) {
                    this.WucUser.getDocument(argument.value).then(
                      (documentInfo) => {
                        this.documents[argument.value] = documentInfo;
                        this.previousValue[argument.key] =
                          argument.value !== null;
                        this.viewMode[argument.key] = argument.value !== null;
                      },
                    );
                  }
                }

                return argument;
              }),
          );

          return this.$q
            .all(promises)
            .then((args) => {
              this.args = args;
              this.baseArgs = angular.copy(args);
              this.loading = false;
            })
            .catch((err) => {
              this.Alerter.alertFromSWS(
                this.$translate.instant('domain_operations_error'),
                err,
                ALERTER_ID,
              );
              this.$scope.resetAction();
            });
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_operations_error'),
            err,
            ALERTER_ID,
          );
          this.$scope.resetAction();
        });
    }

    static getNicParams(arg) {
      return `?${$.param({ fields: arg.fields })}`;
    }

    upload(file, arg) {
      if (
        !!this.constraints[arg.key].maximumSize &&
        file.size > this.constraints[arg.key].maximumSize
      ) {
        this.canContinue = false;
        // eslint-disable-next-line no-param-reassign
        file.uploadError = true;
      } else {
        this.canContinue =
          this.operation.canAccelerate ||
          this.operation.canCancel ||
          this.operation.canRelaunch;
        this.files[arg.key] = file;
        // eslint-disable-next-line no-param-reassign
        arg.value = file;
        // eslint-disable-next-line no-param-reassign
        file.uploadError = false;
      }
    }

    updateOperation() {
      this.loading = true;

      const promises = map(this.args, (arg) => {
        let rtn;
        if (arg.type === '/me/document') {
          if (this.files[arg.key]) {
            rtn = this.WucUser.uploadFile(arg.key, this.files[arg.key]).then(
              (documentId) =>
                this.domainOperationService.updateOperation({
                  id: this.operation.id,
                  key: arg.key,
                  data: { value: documentId },
                }),
            );
          }
        } else if (!arg.readOnly) {
          rtn = this.domainOperationService.updateOperation({
            id: this.operation.id,
            key: arg.key,
            data: { value: arg.value },
          });
        }
        return rtn;
      });

      return this.$q
        .all(promises)
        .then(() => {
          switch (this.todoOperation) {
            case 'relaunch':
              return this.domainOperationService[
                `relaunch${this.constructor.capitalizeFirstLetter(
                  this.type,
                )}Operation`
              ](this.operation.id)
                .then(() =>
                  this.Alerter.success(
                    this.$translate.instant(
                      'domain_tab_OPERATION_update_relaunch_success',
                    ),
                    ALERTER_ID,
                  ),
                )
                .catch((err) =>
                  this.Alerter.alertFromSWS(
                    this.$translate.instant('domain_operations_relaunch_error'),
                    err,
                    ALERTER_ID,
                  ),
                );
            case 'cancel':
              return this.domainOperationService[
                `cancel${this.constructor.capitalizeFirstLetter(
                  this.type,
                )}Operation`
              ](this.operation.id)
                .then(() =>
                  this.Alerter.success(
                    this.$translate.instant('domain_operations_cancel_success'),
                    ALERTER_ID,
                  ),
                )
                .catch((err) =>
                  this.Alerter.alertFromSWS(
                    this.$translate.instant('domain_operations_cancel_error'),
                    err,
                    ALERTER_ID,
                  ),
                );
            case 'accelerate':
              return this.domainOperationService[
                `accelerate${this.constructor.capitalizeFirstLetter(
                  this.type,
                )}Operation`
              ](this.operation.id)
                .then(() =>
                  this.Alerter.success(
                    this.$translate.instant(
                      'domain_operations_accelerate_success',
                    ),
                    ALERTER_ID,
                  ),
                )
                .catch((err) =>
                  this.Alerter.alertFromSWS(
                    this.$translate.instant(
                      'domain_operations_accelerate_error',
                    ),
                    err,
                    ALERTER_ID,
                  ),
                );
            default:
              this.Alerter.success(
                this.$translate.instant('domain_tab_OPERATION_update_success'),
                ALERTER_ID,
              );
              return null;
          }
        })
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_OPERATION_update_error'),
            err,
            ALERTER_ID,
          ),
        )
        .finally(() => this.$scope.resetAction());
    }
  },
);
