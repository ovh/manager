import assignIn from 'lodash/assignIn';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import keys from 'lodash/keys';
import map from 'lodash/map';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import set from 'lodash/set';

export default class CucOvhPoll {
  /* @ngInject */
  constructor(
    $q,
    $interval,
  ) {
    this.$q = $q;
    this.$interval = $interval;
  }

  poll(opts) {
    opts = assignIn({}, omit(opts, 'item'), { items: [opts.item] }); // eslint-disable-line
    return this.pollArray(opts);
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
    const poller = {};
    let { items } = opts;
    set(opts, 'onItemDone', opts.onItemDone ? opts.onItemDone : noop);
    set(opts, 'onItemUpdated', opts.onItemUpdated ? opts.onItemUpdated : noop);
    set(opts, 'stopCondition', opts.stopCondition ? opts.stopCondition : noop);

    const deferred = this.$q.defer();
    poller.pollInterval = this.$interval(() => {
      const promises = map(items, (item) => this.$q.when(opts.pollFunction(item))
        .then((newItem) => {
          if (newItem) {
            const newItemKeys = keys(newItem);
            forEach(keys(item), (key) => {
              if (!includes(newItemKeys, key)) {
                delete item[key]; // eslint-disable-line
              }
            });
            merge(item, newItem.data ? newItem.data : newItem);

            opts.onItemUpdated(item);
          }

          return this.$q.when(opts.stopCondition(item));
        }).catch(() => { // If an error is encountered, we end the polling.
          item = null; // eslint-disable-line
          return true;
        })
        .then((stopCondition) => {
          if (stopCondition) {
            opts.onItemDone(item);
          }

          return {
            stopping: stopCondition,
            item,
          };
        }));

      this.$q.all(promises)
        .then((results) => {
          items = map(filter(results, (result) => !result.stopping), (result) => result.item);

          if (!items.length) {
            poller.kill();
            deferred.resolve(results);
          }
        });
    }, opts.interval || 5000);

    poller.kill = () => {
      this.$interval.cancel(poller.pollInterval);
    };

    poller.$promise = deferred.promise;

    return poller;
  }
}
