import get from 'lodash/get';
import remove from 'lodash/remove';

import { TARIFFS_GUIDE_URL } from '../../contact-center-solution.constants';

export default class TelecomTelephonyAliasConfigurationLinesLineCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    TucToast,
    tucVoipServiceAlias,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.TucToast = TucToast;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
    this.TARIFFS_GUIDE_URL = TARIFFS_GUIDE_URL;
  }

  $onInit() {
    this.loading = true;
    this.addLineForm = {
      numbers: [
        {
          value: null,
          description: null,
        },
      ],
      options: {
        status: 'available',
        timeout: 20,
      },
    };
    this.linesToExclude = [];
    this.serviceInfos = {
      billingAccount: this.$stateParams.billingAccount,
      serviceName: this.$stateParams.serviceName,
    };
    return this.$q
      .all({
        agents: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberAgents(
          this.serviceInfos,
        ),
        queues: this.tucVoipServiceAlias.fetchContactCenterSolutionNumberQueues(
          this.serviceInfos,
        ),
      })
      .then(({ agents, queues }) => {
        this.linesToExclude = agents.map(({ number }) => number);
        [this.queue] = queues;
      })
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_lines_line_get_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  setLinesToExclude() {
    const linesToExclude = this.addLineForm.numbers.map(({ value }) => value);
    this.linesToExclude = this.linesToExclude.concat(linesToExclude);
  }

  onChooseServicePopover() {
    return ({ description, serviceName }, index) => {
      this.addLineForm.numbers[index].value = serviceName;
      this.addLineForm.numbers[index].description = description;
      this.setLinesToExclude();
    };
  }

  removeLine(lineToRemove) {
    if (this.addLineForm.numbers.length > 1) {
      remove(this.addLineForm.numbers, { value: lineToRemove });
    } else {
      this.addLineForm.numbers[0].value = null;
    }

    remove(this.linesToExclude, (line) => line === lineToRemove);
  }

  resetLinesToAdd() {
    this.addLineForm.numbers = [{ value: null }];
  }

  insertEmptyNumber() {
    this.addLineForm.numbers.push({ value: null });
  }

  addLines() {
    this.loading = true;
    const linesToAdd = this.addLineForm.numbers.map(
      ({ description, value }) => ({
        number: value,
        description,
        ...this.addLineForm.options,
      }),
    );
    let promiseChain = this.$q.when();

    linesToAdd.reverse().forEach((line) => {
      promiseChain = promiseChain.then(() =>
        this.tucVoipServiceAlias.addContactCenterSolutionNumberAgentInQueue(
          this.serviceInfos,
          line,
          this.queue.queueId,
        ),
      );
    });

    return promiseChain
      .then(() =>
        this.$state.go('^').then(() => {
          this.TucToast.success(
            this.$translate.instant(
              'telephony_alias_config_contactCenterSolution_lines_line_add_success',
            ),
          );
        }),
      )
      .catch((error) => {
        this.TucToast.error(
          `${this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_lines_line_add_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
