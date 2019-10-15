import FeedbackService from './feedback.service';

export default class {
  $onInit() {
    this.url = FeedbackService.getUrl(this.language);
  }
}
