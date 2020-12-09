import assignIn from 'lodash/assignIn';

export default /* @ngInject */ function ($q, Poller) {
  const self = this;

  /*= ==============================
    =            POLLING            =
    =============================== */

  self.startPolling = (billingAccount, serviceName, taskId, pollOptions) =>
    Poller.poll(
      [
        '/telephony',
        billingAccount,
        'service',
        serviceName,
        'task',
        taskId,
      ].join('/'),
      {
        cache: false,
      },
      pollOptions,
    ).catch((err) => $q.reject(assignIn(err, { type: 'poller' })));

  self.stopPolling = (pollingNamespage) =>
    Poller.kill({ namespace: pollingNamespage });

  /* -----  End of POLLING  ------*/
}
