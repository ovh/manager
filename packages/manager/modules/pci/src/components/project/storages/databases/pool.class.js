export default class Pool {
  constructor({
    databaseId,
    databaseName,
    database,
    user,
    id,
    mode,
    name,
    size,
    uri,
    userId,
    userName,
    port,
    sslMode,
  }) {
    Object.assign(this, {
      databaseId,
      databaseName,
      database,
      user,
      id,
      mode,
      name,
      size,
      uri,
      userId,
      userName,
      port,
      sslMode,
    });
  }

  setUser(user) {
    this.user = user;
  }

  setUserName(name) {
    this.userName = name;
  }

  setDatabaseName(name) {
    this.databaseName = name;
  }

  setDatabase(database) {
    this.database = database;
  }
}
