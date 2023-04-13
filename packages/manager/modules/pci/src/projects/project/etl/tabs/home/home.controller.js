import { set } from 'lodash';
import { ITEMS_POLL_INTERVAL } from '../../etl.constants';

export default class EtlHomeCtrl {
  /* @ngInject */
  constructor($interval, $translate, EtlService, atInternet, coreConfig) {
    this.$interval = $interval;
    this.$translate = $translate;
    this.EtlService = EtlService;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    // Poll data
    this.poller = this.$interval(
      () => this.getWorkflows(),
      ITEMS_POLL_INTERVAL,
    );
    this.getWorkflows();
  }

  $onDestroy() {
    this.$interval.cancel(this.poller);
  }

  getWorkflows() {
    this.EtlService.getWorkflows(this.projectId).then((data) => {
      this.workflows = data.map((workflow) => {
        this.EtlService.getSource(this.projectId, workflow.sourceId).then(
          (sourceData) => {
            set(workflow, 'sourceData', sourceData);
          },
        );

        this.EtlService.getDestination(
          this.projectId,
          workflow.destinationId,
        ).then((destinationData) => {
          set(workflow, 'destinationData', destinationData);
        });

        this.EtlService.getJobs(this.projectId, workflow.id).then((jobs) => {
          set(workflow, 'jobs', jobs);
          set(
            workflow,
            'lastJob',
            jobs.length > 0
              ? jobs.sort(
                  (a, b) =>
                    new Date(a.startedAt).getTime() -
                    new Date(b.startedAt).getTime,
                )[0]
              : null,
          );
        });

        return workflow;
      });
    });
  }

  selectWorkflow(workflow) {
    this.selectedWorkflow = workflow;
  }
}
