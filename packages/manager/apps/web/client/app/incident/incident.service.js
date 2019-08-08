angular.module('services').service(
  'incident',
  class Incident {
    constructor($q, OvhHttp) {
      this.$q = $q;
      this.OvhHttp = OvhHttp;
    }

    getOvhTasks() {
      // temporarily disable calls to /ovh-tasks.
      return this.$q.when(true);

      // return this.OvhHttp.get("/ovh-tasks", {
      //     rootPath: "2api"
      // });
    }
  },
);
