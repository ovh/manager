export default class Offer {
  constructor({
    active,
    description,
    descriptionPattern,
    display,
    highlight,
    name,
    noticeLink,
    pattern,
    value,
    voucher,
  }) {
    Object.assign(this, {
      active,
      description,
      descriptionPattern: new RegExp(descriptionPattern),
      display,
      highlight,
      name,
      noticeLink,
      pattern: new RegExp(pattern),
      value,
      voucher,
    });
  }
}
