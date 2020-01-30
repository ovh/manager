import forEach from 'lodash/forEach';

export default class CucCloudPoll {
  /* @ngInject */
  constructor($transitions, CucOvhPoll) {
    this.CucOvhPoll = CucOvhPoll;

    this.pollers = [];

    $transitions.onSuccess({}, () => {
      forEach(this.pollers, (poller) => poller.kill());
      this.pollers = [];
    });
  }

  poll(opts) {
    const poller = this.CucOvhPoll.poll(opts);
    this.pollers.push(poller);
    return poller;
  }

  // Polling opts. Contains items to poll, pollFunction callback, stopCondition callback
  // and interval (optional, default 5000).
  // Ex =>
  // {
  //   item: [1, 2, 3],
  //   pollFunction: item => doSomething(),
  //   stopCondition: item => doSomething(),
  //   interval: 10000,
  // }
  pollArray(opts) {
    const poller = this.CucOvhPoll.pollArray(opts);
    this.pollers.push(poller);
    return poller;
  }
}
