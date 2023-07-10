import get from 'lodash/get';
import { ISSUE_TYPES } from './new-ticket.constant';

export const name = 'SupportNewTicketService';
export const definition = class SupportNewTicketService {
  /* @ngInject */
  constructor($translate, $http, OvhApiMe, OvhApiSupport) {
    this.$translate = $translate;
    this.$http = $http;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiSupport = OvhApiSupport;
  }

  getCategories() {
    return this.OvhApiSupport.v6()
      .schema()
      .$promise.then((schema) =>
        schema.models['support.tickets.CategoryEnum'].enum.map(
          (categoryId) => ({
            id: categoryId,
            label: this.$translate.instant(
              `ovhManagerSupport_new_category_${categoryId}`,
            ),
            description:
              categoryId === 'business'
                ? ''
                : this.$translate.instant(
                    `ovhManagerSupport_new_category_description_${categoryId}`,
                  ),
          }),
        ),
      );
  }

  getUrgencies() {
    return this.OvhApiSupport.v6()
      .schema()
      .$promise.then((schema) =>
        schema.models['support.tickets.UrgencyEnum'].enum.map((categoryId) => ({
          id: categoryId,
          label: this.$translate.instant(
            `ovhManagerSupport_new_urgency_${categoryId}`,
          ),
        })),
      );
  }

  getSupportLevel() {
    return this.OvhApiMe.v6().supportLevel().$promise;
  }

  getTicket(ticketId) {
    return this.OvhApiSupport.v6().get({
      id: ticketId,
    }).$promise;
  }

  fetchIssueTypes(categoryName) {
    return this.$http
      .get('/support/issueTypes', {
        serviceType: 'apiv6',
        params: {
          category: categoryName,
          issueTypeId: ISSUE_TYPES.CHANGE_MY_DETAILS_ID,
          language: this.$translate.use(),
        },
      })
      .then(({ data }) => data);
  }

  static createLine(text = '') {
    return `${text}\n`;
  }

  static buildFieldText() {
    return (field) =>
      SupportNewTicketService.createLine(field.label) +
      SupportNewTicketService.createLine(field.default);
  }

  static createTicketBody({ subject, fields }) {
    const head =
      SupportNewTicketService.createLine(subject) +
      SupportNewTicketService.createLine();
    const body = fields
      .map(SupportNewTicketService.buildFieldText())
      .join(SupportNewTicketService.createLine());

    return head + body;
  }

  createTicket(issue, subject, serviceName, impactedResource, urgency) {
    return this.OvhApiSupport.v6().createTickets(
      {},
      {
        issueTypeId: issue.id,
        serviceName,
        impactedResource,
        subject,
        body: SupportNewTicketService.createTicketBody(issue),
        urgency: get(urgency, 'id'),
      },
    ).$promise;
  }
};

export default {
  name,
  definition,
};
