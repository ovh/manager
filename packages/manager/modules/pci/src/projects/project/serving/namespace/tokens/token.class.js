export default class Token {
  constructor({
    createdAt,
    groups,
    id,
    resource,
    token,
  }) {
    Object.assign(this, {
      createdAt,
      groups,
      id,
      resource,
      token,
    });
  }
}
