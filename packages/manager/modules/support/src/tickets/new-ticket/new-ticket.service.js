import get from 'lodash/get';

export const name = 'SupportNewTicketService';

export const definition = class SupportNewTicketService {
  /* @ngInject */
  constructor($translate, OvhApiMe, OvhApiSupport) {
    this.$translate = $translate;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiSupport = OvhApiSupport;
  }

  getCategories() {
    return this.OvhApiSupport.v6().schema().$promise.then(
      schema => schema.models['support.tickets.CategoryEnum'].enum.map(categoryId => ({
        id: categoryId,
        label: this.$translate.instant(`ovhManagerSupport_new_category_${categoryId}`),
      })),
    );
  }

  getUrgencies() {
    return this.OvhApiSupport.v6().schema().$promise.then(
      schema => schema.models['support.tickets.UrgencyEnum'].enum.map(categoryId => ({
        id: categoryId,
        label: this.$translate.instant(`ovhManagerSupport_new_urgency_${categoryId}`),
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

  static createLine(text = '') {
    return `${text}\n`;
  }

  static buildFieldText() {
    return field => SupportNewTicketService.createLine(field.label)
      + SupportNewTicketService.createLine(field.default);
  }

  static createTicketBody({ subject, fields }) {
    const head = SupportNewTicketService.createLine(subject)
     + SupportNewTicketService.createLine();
    const body = fields
      .map(SupportNewTicketService.buildFieldText())
      .join(SupportNewTicketService.createLine());

    return head + body;
  }

  createTicket(issue, subject, serviceName, urgency) {
    return this.OvhApiSupport.v6().createTickets({}, {
      issueTypeId: issue.id,
      serviceName,
      subject,
      body: SupportNewTicketService.createTicketBody(issue),
      urgency: get(urgency, 'id'),
    }).$promise;
  }
};

export default {
  name,
  definition,
};
