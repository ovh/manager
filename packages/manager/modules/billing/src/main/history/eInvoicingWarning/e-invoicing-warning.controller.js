export default class {
  /* @ngInject */
  constructor(coreURLBuilder) {
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.siretEditionLink = this.coreURLBuilder.buildURL(
      'account',
      '#/useraccount/infos?fieldToFocus=ovh_form_content_activity',
    );
  }
}
