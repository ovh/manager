/**
 * Describe a bill object
 */
export default class Bill {
  /**
   *
   * @param {Object} bill for creating a new Bill representation
   * @param {String} bill.billId Unique identifier for the bill
   * @param {Enum} bill.category type of service that is billed
   * @param {String} bill.date date the bill was issued
   * @param {Object=} bill.debt Object representing the current status of the bill
   *    Can be undefined in the case the bill is payed and there is no more amount due
   * @param {String=} bill.pdfBetaUrl pdf url of the bill
   * @param {String=} bill.pdfUrl link to the bill in a pdf format
   * @param {Object} bill.priceWithTax amount of the bill including subsidiary taxes
   * @param {Object} bill.priceWithoutTax amount of the bill excluding subsidiary taxes
   * @param {String} bill.urel link to the bill
   *
   */
  constructor({
    billId,
    category,
    date,
    debt,
    orderId,
    pdfBetaUrl,
    pdfUrl,
    priceWithTax,
    priceWithoutTax,
    url,
  }) {
    Object.assign(this, {
      billId,
      category,
      date,
      orderId,
      pdfBetaUrl,
      pdfUrl,
      priceWithTax,
      priceWithoutTax,
      url,
    });

    // If there is no debt, this means the bill has been payed
    // API can return a 404 if there are no debts
    this.debt = debt || {
      status: 'PAID',
      dueAmount: {
        value: 0,
        text: priceWithTax.text.replace(/([0-9]|\.|,)+/g, '0.00'),
      },
    };
  }

  /**
   * @returns {Boolean} true if the bill has not be paid
   */
  isDue() {
    return ['UNPAID', 'TO_BE_PAID', 'UNMATURED'].includes(this.debt.status);
  }

  isUnpaid() {
    return this.debt.status === 'UNPAID';
  }
}
