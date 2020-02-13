export default class Offer {
  constructor({ active, description, highlight, name, noticeLink, pattern }) {
    Object.assign(this, {
      active,
      description,
      highlight,
      name,
      noticeLink,
      pattern: new RegExp(pattern),
    });
  }
}
