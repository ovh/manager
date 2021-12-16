export default class Pool {
  constructor({
    databaseId,
    databaseName,
    id,
    mode,
    name,
    size,
    uri,
    userId,
    userName,
  }) {
    Object.assign(this, {
      databaseId,
      databaseName,
      id,
      mode,
      name,
      size,
      uri,
      userId,
      userName,
    });
  }

  setUserName(user) {
    this.userName = user?.username;
  }

  setDatabaseName(database) {
    this.databaseName = database?.name;
  }
}
