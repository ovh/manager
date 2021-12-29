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
    });
  }

  setUserName(user) {
    this.userName = user?.username;
    this.user = user;
  }

  setDatabaseName(database) {
    this.databaseName = database?.name;
    this.database = database;
  }
}
