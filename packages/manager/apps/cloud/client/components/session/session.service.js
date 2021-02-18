class SessionService {
  constructor($q, OvhApiMe) {
    this.$q = $q;
    this.OvhApiMe = OvhApiMe;
  }

  getUser(force) {
    // Check if cached
    if (this.user) {
      return this.$q.when(this.user);
    }

    // Check if already deferred
    if (!!this.userDeferred && !force) {
      return this.userDeferred.promise;
    }

    // Get User
    this.userDeferred = this.$q.defer();
    this.OvhApiMe.v6()
      .get()
      .$promise.then((result) => {
        this.user = result;
        this.userDeferred.resolve(result);
      });

    return this.userDeferred.promise;
  }
}

angular.module('managerApp').service('SessionService', SessionService);
