import has from 'lodash/has';
import head from 'lodash/head';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import {
  ALIAS_TYPE,
  SMTP_FIELD_LABEL,
  X500_PREFIX,
  X500_REGEX,
} from './exchange-alias-add.constants';
import { ALIAS_TYPE_FOR_API_PATH } from '../exchange-alias.constants';

export default class ExchangeAddAccountAliasCtrl {
  /* @ngInject */
  constructor($scope, wucExchange, messaging, $translate) {
    this.services = {
      $scope,
      wucExchange,
      messaging,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.data = null;
    this.SMTP_FIELD_LABEL = SMTP_FIELD_LABEL;
    this.ALIAS_TYPE = ALIAS_TYPE;
    this.X500_PREFIX = X500_PREFIX;
    this.model = {
      radio: ALIAS_TYPE.SMTP,
      alias: '',
      domain: '',
      x500: '',
    };

    $scope.addAccountAlias = () => this.addAccountAlias();
    $scope.aliasIsValid = () => this.aliasIsValid();
  }

  $onInit() {
    this.loadDomainData();
  }

  loadDomainData() {
    this.services.wucExchange
      .getNewAliasOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams[this.aliasType],
        ALIAS_TYPE[this.aliasType],
      )
      .then((data) => {
        if (isEmpty(data.availableDomains)) {
          this.services.messaging.writeError(
            this.services.$translate.instant(
              'exchange_tab_ALIAS_add_no_domains',
            ),
          );
          this.goBack();
        } else {
          this.availableDomains = data.availableDomains;
          this.takenEmails = data.takenEmails;
          this.model.domain = head(data.availableDomains);
        }
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_domain_loading_failure',
          ),
          err,
        );
        this.goBack();
      });
  }

  checkTakenEmails() {
    this.takenEmailError = false;
    const modelIsWellFormed =
      !isEmpty(this.model) &&
      isString(this.model.alias) &&
      has(this.model, 'domain.name');

    if (modelIsWellFormed) {
      const emailIsAlreadyUsed =
        !isEmpty(this.takenEmails) &&
        includes(
          this.takenEmails,
          `${this.model.alias.toLowerCase()}@${this.model.domain.name}`,
        );

      if (emailIsAlreadyUsed) {
        this.takenEmailError = true;
      }
    }
  }

  addAccountAlias() {
    return this.services.wucExchange
      .addAlias(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.$routerParams[this.aliasType],
        ALIAS_TYPE_FOR_API_PATH[this.aliasType],
        this.getAlias(this.model),
      )
      .then(() => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_add_alias_success_message',
          ),
        );
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_ALIAS_add_alias_error_message',
          ),
          err,
        );
      })
      .finally(() => {
        this.goBack();
      });
  }

  checkAliasValidity() {
    let isAliasValid;
    if (this.model?.radio === this.ALIAS_TYPE.SMTP) {
      const aliasIsValid =
        !isEmpty(this.model.alias) &&
        isString(this.model.alias) &&
        this.model.alias.length <= 64;
      const hasDomain = !isEmpty(this.model.domain);
      isAliasValid = aliasIsValid && hasDomain && !this.takenEmailError;
    } else {
      const match = this.model.x500.match(X500_REGEX) || [];
      isAliasValid = match.length === 1 && match[0] === this.model.x500;
    }
    return isAliasValid;
  }

  getAlias() {
    return this.model?.radio === this.ALIAS_TYPE.SMTP
      ? `${this.model.alias}@${this.model.domain.name}`
      : `${X500_PREFIX}${this.model.x500}`;
  }
}
