import find from 'lodash/find';
import forOwn from 'lodash/forOwn';
import includes from 'lodash/includes';
import kebabCase from 'lodash/kebabCase';
import map from 'lodash/map';

export default class ExchangeTabDiagnosticsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    constants,
    coreURLBuilder,
    diagnostic,
    WucUser,
    EXCHANGE_CONFIG,
    $translate,
    navigation,
    messaging,
    wucExchange,
    $timeout,
  ) {
    this.services = {
      $scope,
      $q,
      constants,
      diagnostic,
      WucUser,
      EXCHANGE_CONFIG,
      $translate,
      navigation,
      messaging,
      wucExchange,
      $timeout,
    };

    this.POLL_NAMESPACE = 'exchange.diagnostic.poll';

    this.exchange = wucExchange.value;
    this.newTicketUrl = coreURLBuilder.buildURL(
      'dedicated',
      '#/support/tickets/new',
      {
        serviceTypeName: 'email_exchange',
        serviceName: this.exchange.domain,
      },
    );

    this.states = {
      REQUESTING_NEW_DIAGNOSTIC: 'REQUESTING_NEW_DIAGNOSTIC',
      DISPLAYING_DIAGNOSTIC_RESULT: 'DISPLAYING_DIAGNOSTIC_RESULT',
    };

    this.diagnosticStatuses = {
      isSpammer: false,
      isSuspended: false,
      isLocked: false,
      connectiveOWA: true,
      isMxValid: true,
      canReceiveEmail: true,
      isSrvValid: true,
      canSendEmail: true,
    };

    this.state = this.states.REQUESTING_NEW_DIAGNOSTIC;

    this.accountIds = [];
    this.loaders = {
      accounts: false,
      diagnosticInProgress: false,
    };

    $scope.$on(`${this.POLL_NAMESPACE}.done`, () => this.writeDoneMessage());
    $scope.$on(`${this.POLL_NAMESPACE}.error`, (error) =>
      this.writeErrorMessage(error),
    );

    $scope.$on('$destroy', () => {
      diagnostic.killAllPolling({
        namespace: this.POLL_NAMESPACE,
      });
    });

    const lastDiasgnostic = diagnostic.gettingLastDiagnostic();
    if (lastDiasgnostic != null && lastDiasgnostic !== false) {
      this.displayOrContinueDiagnosticIfAny(lastDiasgnostic);
    }

    this.fetchDiagnosticGuideUrl();
    this.getDiagnosticAccounts();
  }

  getDiagnosticAccounts() {
    this.loaders.accounts = true;

    return this.services.wucExchange
      .getAccountIds({
        organizationName: this.exchange.organization,
        exchangeService: this.exchange.domain,
      })
      .then((ids) => {
        this.accountIds = ids;
      })
      .finally(() => {
        this.loaders.accounts = false;
      });
  }

  writeDoneMessage() {
    this.loaders.diagnosticInProgress = false;
    this.getDiagnosticResultAndDisplayIt();
  }

  writeErrorMessage(errorMessage) {
    this.loaders.diagnosticInProgress = false;
    this.services.messaging.writeError(
      this.services.$translate.instant(
        'exchange_DIAGNOSTIC_launch_diagnostic_failure',
      ),
      errorMessage,
    );
  }

  pollDiagnosticTask(task) {
    this.services.diagnostic.pollingState(this.email, {
      id: task.id,
      successSates: ['done', 'cancelled'],
      namespace: this.POLL_NAMESPACE,
    });
  }

  displayOrContinueDiagnosticIfAny(email) {
    this.email = email;

    if (this.services.diagnostic.hasCachedDiagnosticResult()) {
      this.getCachedDiagnosticResultAndDisplayIt();
    } else {
      this.continueDiagnosticIfAny(email);
    }
  }

  continueDiagnosticIfAny(email) {
    this.loaders.diagnosticInProgress = true;

    this.services.diagnostic
      .gettingTasks(email)
      .then((taskIds) =>
        this.services.$q.all(
          map(taskIds, (taskId) =>
            this.services.diagnostic.gettingTask(email, taskId),
          ),
        ),
      )
      .then((tasks) => {
        const currentTask = find(tasks, (task) =>
          includes(['todo', 'doing'], task.status),
        );

        if (currentTask != null) {
          this.pollDiagnosticTask(currentTask);
        } else {
          this.loaders.diagnosticInProgress = false;
          this.getDiagnosticResultAndDisplayIt();
        }
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_DIAGNOSTIC_launch_diagnostic_failure',
          ),
          error,
        );
        this.loaders.diagnosticInProgress = false;
      });
  }

  launchDiagnostic() {
    this.loaders.diagnosticInProgress = true;

    this.services.diagnostic
      .launchingDiagnostic(this.email, this.password)
      .then((task) => this.pollDiagnosticTask(task))
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_DIAGNOSTIC_launch_diagnostic_failure',
          ),
          error,
        );
        this.loaders.diagnosticInProgress = false;
      });
  }

  getDiagnosticResultAndDisplayIt() {
    this.gettingDiagnosticResult().then(() => this.displayDiagnosticResult());
  }

  getCachedDiagnosticResultAndDisplayIt() {
    this.diagnostic = this.services.diagnostic.getCachedDiagnosticResult();
    this.displayDiagnosticResult();
  }

  displayDiagnosticResult() {
    this.state = this.states.DISPLAYING_DIAGNOSTIC_RESULT;
  }

  gettingDiagnosticResult() {
    this.loaders.diagnosticInProgress = true;

    return this.services.diagnostic
      .gettingDiagnosticResult(this.email)
      .then((diagnostic) => {
        this.diagnostic = diagnostic;
        this.services.diagnostic.cacheLastDiagnosticResult(diagnostic);
      })
      .catch((error) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_DIAGNOSTIC_get_diagnostic_result_failure',
          ),
          error,
        );
      })
      .finally(() => {
        this.loaders.diagnosticInProgress = false;
      });
  }

  requestNewDiagnostic() {
    this.email = null;
    this.password = null;
    this.diagnostic = null;
    this.state = this.states.REQUESTING_NEW_DIAGNOSTIC;
    this.services.diagnostic.clearCache();
  }

  isOK(status) {
    const key = status.key != null ? status.key : status;
    const diagnosticIsValid = this.diagnostic != null;

    if (!diagnosticIsValid) {
      return false;
    }

    return this.diagnosticStatuses[key] === this.diagnostic[key];
  }

  isAllOK() {
    let isAllOk = true;

    forOwn(this.diagnosticStatuses, (value, key) => {
      isAllOk = this.isOK(key);

      return isAllOk;
    });

    return isAllOk;
  }

  statusMessage(status) {
    const suffix = this.isOK(status) ? '_ok' : '_not_ok';

    return this.services.$translate.instant(
      `exchange_DIAGNOSTICS_status_${status}${suffix}`,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  detailedMessageTemplateUrl(status) {
    return `exchange/diagnostic/error/diagnostic-error-${kebabCase(
      status,
    )}.html`;
  }

  fetchDiagnosticGuideUrl() {
    const defaultSubsidiary = 'FR';

    this.services.WucUser.getUser()
      .then((data) => {
        this.diagnosticGuideUrl =
          this.services.EXCHANGE_CONFIG.URLS.GUIDES.DIAGNOSTIC[
            data.ovhSubsidiary
          ] ||
          this.services.EXCHANGE_CONFIG.URLS.GUIDES.DIAGNOSTIC[
            defaultSubsidiary
          ];
      })
      .catch(() => {
        this.diagnosticGuideUrl = null;
      });
  }
}
