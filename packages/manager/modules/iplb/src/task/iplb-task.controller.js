import includes from 'lodash/includes';

export default class IpLoadBalancerTaskCtrl {
  /* @ngInject */
  constructor(
    $scope,
    CucControllerHelper,
    CucCloudPoll,
    IpLoadBalancerTaskService,
    CucServiceHelper,
  ) {
    this.$scope = $scope;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudPoll = CucCloudPoll;
    this.IpLoadBalancerTaskService = IpLoadBalancerTaskService;
    this.CucServiceHelper = CucServiceHelper;
  }

  $onInit() {
    this.tasks = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.IpLoadBalancerTaskService.getTasks(this.serviceName),
      successHandler: () => this.startTaskPolling(),
    });
    this.tasks.load();
    this.$scope.$on('$destroy', () => this.stopTaskPolling());
  }

  startTaskPolling() {
    this.stopTaskPolling();

    this.poller = this.CucCloudPoll.pollArray({
      items: this.tasks.data,
      pollFunction: (task) =>
        this.IpLoadBalancerTaskService.getTask(this.serviceName, task.id),
      stopCondition: (task) => includes(['done', 'error'], task.status),
    });
  }

  stopTaskPolling() {
    if (this.poller) {
      this.poller.kill();
    }
  }
}
