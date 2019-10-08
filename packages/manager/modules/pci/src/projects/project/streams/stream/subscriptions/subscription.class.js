export default class Subscription {
  constructor({
    id,
    kind,
    name,
    stats,
  }) {
    Object.assign(this, {
      id,
      kind,
      name,
      stats,
    });
  }
}
