export default class {
  /* @ngInject */
  constructor(
    FeedbackService,
  ) {
    this.FeedbackService = FeedbackService;
  }

  $onInit() {
    this.url = this.FeedbackService.getUrl();
  }
}
