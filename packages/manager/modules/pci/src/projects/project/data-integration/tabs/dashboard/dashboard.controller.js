import { set } from 'lodash';
import animateScrollTo from 'animated-scroll-to';
import {
  ITEMS_POLL_INTERVAL,
  DATA_INTEGRATION_TRACKING_PREFIX_FULL,
} from '../../data-integration.constants';

export default class DataIntegrationDashboardCtrl {
  /* @ngInject */
  constructor(
    $anchorScroll,
    $document,
    $interval,
    $timeout,
    atInternet,
    DataIntegrationService,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$document = $document;
    this.$interval = $interval;
    this.$timeout = $timeout;
    this.atInternet = atInternet;
    this.DataIntegrationService = DataIntegrationService;
  }

  $onInit() {
    // Poll data
    this.poller = this.$interval(() => {
      this.getWorkflows().finally(() => {
        if (this.selectedWorkflow) {
          this.getJobs();
        }
      });
    }, ITEMS_POLL_INTERVAL);

    // If we find the parentElement, we can enable smooth scrolling. Otherwise, fallback to $anchor
    const scrollParentElement = this.$document[0].getElementsByClassName(
      'pci-project-content',
    )[0];
    this.scrollToOptions = scrollParentElement
      ? {
          element: scrollParentElement,
          offset: 0,
          horizontal: false,
        }
      : null;
  }

  $onDestroy() {
    this.$interval.cancel(this.poller);
  }

  scrollTo(id) {
    // If we have the scrollToOptions, we can use the smooth scrolling, otherwise we use $anchor
    if (this.scrollToOptions) {
      animateScrollTo(document.getElementById(id), this.scrollToOptions);
    } else {
      this.$anchorScroll(id);
    }
  }

  getWorkflows() {
    return this.DataIntegrationService.getWorkflows(this.projectId).then(
      (data) => {
        this.workflows = data;
        // update selected workflow
        if (this.selectedWorkflow) {
          const updatedWorkflow = data.find(
            (workflow) => workflow.id === this.selectedWorkflow.id,
          );
          if (updatedWorkflow) {
            set(updatedWorkflow, 'jobs', [...this.selectedWorkflow.jobs]);
          }
          this.selectedWorkflow = updatedWorkflow;
        }
      },
    );
  }

  getJobs() {
    const workflow = this.selectedWorkflow;
    return this.DataIntegrationService.getJobs(
      this.projectId,
      workflow.id,
    ).then((jobs) => {
      set(
        workflow,
        'jobs',
        jobs.map((job) => {
          return {
            ...job,
            duration:
              job.endedAt && job.startedAt
                ? new Date(job.endedAt).getTime() -
                  new Date(job.startedAt).getTime()
                : null,
          };
        }),
      );
      this.selectedWorkflow = workflow;
    });
  }

  onWorkflowChanged(workflow) {
    if (workflow.id === this.selectedWorkflow?.id) {
      return;
    }
    this.selectedWorkflow = workflow;
    this.atInternet.trackClick({
      name: `${DATA_INTEGRATION_TRACKING_PREFIX_FULL}::dashboard::workflow-details`,
      type: 'action',
    });
    this.jobsLoading = true;
    this.getJobs().finally(() => {
      this.jobsLoading = false;
      this.$timeout(() => {
        this.scrollTo('jobs');
      });
    });
  }
}
