import clone from 'lodash/clone';
import forEach from 'lodash/forEach';
import snakeCase from 'lodash/snakeCase';
import some from 'lodash/some';

import { PRIVATE_SQL_PLAN_CODE } from './hosting-database.constants';

angular.module('services').service(
  'HostingDatabase',
  class HostingDatabase {
    constructor($q, $rootScope, Hosting, WucJavaEnum, OvhHttp, Poller) {
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.Hosting = Hosting;
      this.WucJavaEnum = WucJavaEnum;
      this.OvhHttp = OvhHttp;
      this.Poller = Poller;
    }

    /**
     * Delete a database
     * @param {string} serviceName
     * @param {string} name
     */
    deleteDatabase(serviceName, name) {
      return this.OvhHttp.delete(
        `/hosting/web/${serviceName}/database/${name}`,
        {
          rootPath: 'apiv6',
        },
      ).then((response) => {
        this.Hosting.resetDatabases();
        return response;
      });
    }

    /**
     * Get database list
     * @param {string} serviceName
     */
    databaseList(serviceName) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/database`, {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get database type availability
     * @param {string} serviceName
     */
    getDatabaseAvailableType(serviceName) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/databaseAvailableType`,
        {
          rootPath: 'apiv6',
        },
      ).then((availableTypes) =>
        availableTypes.map((type) => type.toUpperCase()),
      );
    }

    /**
     * Get database ids
     * @param {string} serviceName
     * @param {string} search
     */
    getDatabaseIds(serviceName, search) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/database`, {
        rootPath: 'apiv6',
        params: {
          name: `%${search || ''}%`,
        },
      });
    }

    /**
     * Get database detail
     * @param {string} serviceName
     * @param {string} name
     */
    getDatabase(serviceName, name) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/database/${name}`, {
        rootPath: 'apiv6',
      }).then((originalDatabase) => {
        const database = clone(originalDatabase);

        forEach(['type', 'state', 'mode'], (elt) => {
          database[elt] = database[elt].toUpperCase();
        });
        database.version = `_${snakeCase(database.version)}`;
        database.quotaPercent =
          (database.quotaUsed.value / database.quotaSize.value) * 100;

        return database;
      });
    }

    /**
     * Get dumps ids
     * @param {string} serviceName
     * @param {string} name
     */
    getDumpIds(serviceName, name) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/database/${name}/dump`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    /**
     * Get dump details
     * @param {string} serviceName
     * @param {string} name
     * @param {string} dumpId
     */
    getDump(serviceName, name, dumpId) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/database/${name}/dump/${dumpId}`,
        {
          rootPath: 'apiv6',
        },
      ).then((originalDump) => {
        const dump = clone(originalDump);
        dump.snapshotDate = this.constructor.getSnapshotDateOfDump(dump);
        return dump;
      });
    }

    /**
     * Get snapshot date of database dump
     * @param {Object} dump
     */
    static getSnapshotDateOfDump(dump) {
      if (!dump.creationDate) {
        return undefined;
      }

      const snapshotDate = moment(dump.creationDate);
      if (dump.type === 'daily.1') {
        snapshotDate.subtract(1, 'd');
      } else if (dump.type === 'weekly.1') {
        snapshotDate.subtract(1, 'w');
      }
      return snapshotDate.format();
    }

    /**
     * Restore database dump
     * @param {string} serviceName
     * @param {string} name
     * @param {object} dump
     */
    restoreBDD(serviceName, name, dump) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/database/${name}/dump/${dump.id}/restore`,
        {
          rootPath: 'apiv6',
        },
      ).then((task) => {
        this.pollTasks(serviceName, {
          namespace: 'database.dump.restore.poll',
          task,
          dump,
          successSates: ['canceled', 'done'],
          errorsSates: ['error'],
        });
      });
    }

    /**
     * Restore database from a dynamic backup
     * @param {string} serviceName
     * @param {string} name
     * @param {string} backupType
     * @param {boolean} sendEmail
     */
    restoreBDDBackup(serviceName, name, backupType, sendEmail) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/database/${name}/restore`,
        {
          rootPath: 'apiv6',
          data: {
            date: backupType,
            sendEmail,
          },
          broadcast: 'hosting.databases.backup.restore',
        },
      );
    }

    /**
     * Get database stats
     * @param {string} serviceName
     * @param {string} name
     * @param period
     * @param type
     * @param aggregation
     */
    databaseStatistics(serviceName, name, period, type, aggregation) {
      return this.OvhHttp.get(
        `/sws/hosting/web/${serviceName}/databases/${name}/statistics`,
        {
          rootPath: '2api',
          params: {
            period,
            type,
            aggregation,
          },
        },
      );
    }

    /**
     * Update password for database
     * @param {string} serviceName
     * @param {string} name
     * @param {string} password
     */
    changePassword(serviceName, name, password) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/database/${name}/changePassword`,
        {
          rootPath: 'apiv6',
          data: {
            password,
          },
        },
      );
    }

    /**
     * Ask a dump for a database
     * @param {string} serviceName
     * @param {string} name
     * @param {string} date
     * @param {boolean} sendEmail
     */
    dumpDatabase(serviceName, name, date, sendEmail) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/database/${name}/dump`,
        {
          rootPath: 'apiv6',
          data: {
            date: date.toLowerCase().replace('_', '.'),
            sendEmail,
          },
        },
      );
    }

    /**
     * Delete a database dump
     * @param {string} serviceName
     * @param {string} name
     * @param {object} dump
     */
    deleteDatabaseDump(serviceName, name, dump) {
      return this.OvhHttp.delete(
        `/hosting/web/${serviceName}/database/${name}/dump/${dump.id}`,
        {
          rootPath: 'apiv6',
        },
      ).then((task) => {
        this.pollTasks(serviceName, {
          namespace: 'database.dump.delete.poll',
          task,
          dump,
          successSates: ['canceled', 'done'],
          errorsSates: ['error'],
        });
      });
    }

    /**
     * Import a database from a file updloaded in /me/document/
     * @param {string} serviceName
     * @param {string} name
     * @param {string} documentId
     * @param {boolean} flushDatabase
     * @param {boolean} sendEmail
     */
    importDatabase(serviceName, name, documentId, flushDatabase, sendEmail) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/database/${name}/import`,
        {
          rootPath: 'apiv6',
          data: {
            documentId,
            flushDatabase,
            sendEmail,
          },
        },
      );
    }

    /**
     * Get dump options
     */
    dumpDatabaseOptions() {
      return this.Hosting.getModels().then((models) => ({
        dumpDates: models.models[
          'hosting.web.database.dump.DateEnum'
        ].enum.map((model) => this.WucJavaEnum.tr(model)),
      }));
    }

    /**
     * Get database capabilities for creation
     * @param {string} serviceName
     */
    getCreationCapabilities(serviceName) {
      return this.$q
        .all({
          hosting: this.OvhHttp.get(`/hosting/web/${serviceName}`, {
            rootPath: 'apiv6',
          }),
          capabilities: this.OvhHttp.get(
            `/hosting/web/${serviceName}/databaseCreationCapabilities`,
            { rootPath: 'apiv6' },
          ),
          models: this.Hosting.getModels(),
        })
        .then(({ hosting, capabilities, models }) => ({
          availableDatabases: capabilities.map((capa) => ({
            type: this.WucJavaEnum.tr(capa.type),
            quota: capa.quota,
            extraSqlQuota:
              capa.type === 'extraSqlPerso' ? `_${capa.quota.value}` : null,
            available: capa.available,
          })),
          databaseTypes: models.models[
            'hosting.web.database.DatabaseCreationTypeEnum'
          ].enum.map((m) => this.WucJavaEnum.tr(m)),
          primaryLogin: hosting.primaryLogin,
        }));
    }

    /**
     * Get database capabilities for creation
     * @param {string} serviceName
     * @param type
     */
    getAvailableVersion(serviceName, type) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/databaseAvailableVersion`,
        {
          rootPath: 'apiv6',
          params: {
            type,
          },
        },
      );
    }

    /**
     * Create a database
     * @param {string} serviceName
     * @param capabilitie
     * @param {string} password
     * @param quota
     * @param {string} type
     * @param {string} user
     * @param {string} version
     */
    createDatabase(
      serviceName,
      capabilitie,
      password,
      quota,
      type,
      user,
      version,
    ) {
      return this.OvhHttp.post(`/hosting/web/${serviceName}/database`, {
        rootPath: 'apiv6',
        data: {
          capabilitie,
          password,
          quota,
          type,
          user,
          version,
        },
      }).then((task) => {
        this.pollTasks(serviceName, {
          namespace: this.Hosting.events.tabDatabasesCreation,
          task,
          dump: 'hosting',
          successSates: ['canceled', 'done'],
          errorsSates: ['error'],
        });
        return task;
      });
    }

    /**
     * @param {string} serviceName
     * @return {string[]} The ids of the SQL databases linked to this service
     */
    getPrivateDatabaseIds(serviceName) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/privateDatabases`, {
        rootPath: 'apiv6',
      });
    }

    getHasPrivateSqlToActivate(serviceName) {
      return this.OvhHttp.get(
        `/order/cartServiceOption/webHosting/${serviceName}`,
        {
          rootPath: 'apiv6',
        },
      ).then((options) => some(options, { planCode: PRIVATE_SQL_PLAN_CODE }));
    }

    /**
     * Get database capabilities
     * @param {string} serviceName
     */
    getDatabasesCapabilities(serviceName) {
      return this.$q.all({
        database: this.OvhHttp.get(
          `/hosting/web/${serviceName}/privateDatabaseCreationCapabilities`,
          { rootPath: 'apiv6' },
        ),
        privateDatabase: this.OvhHttp.get(
          `/hosting/web/${serviceName}/databaseCreationCapabilities`,
          { rootPath: 'apiv6' },
        ),
      });
    }

    /**
     * Request check quota database
     * @param {string} serviceName
     * @param {string} name
     */
    requestDatabaseQuotaCheck(serviceName, name) {
      return this.OvhHttp.post(
        `/hosting/web/${serviceName}/database/${name}/request`,
        {
          rootPath: 'apiv6',
          data: {
            action: 'CHECK_QUOTA',
          },
        },
      );
    }

    /**
     * Get tasks list
     * @param {string} serviceName
     * @param status
     * @param func
     */
    getTaskIds(serviceName, status, func) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/tasks`, {
        rootPath: 'apiv6',
        params: {
          function: func,
          status,
        },
      });
    }

    /**
     * Get tasks list with details
     * @param {string} serviceName
     * @param status
     * @param func
     */
    getTasks(serviceName, status, func) {
      return this.getTaskIds(serviceName, status, func).then((tasksId) => {
        const promises = tasksId.map((id) =>
          this.OvhHttp.get(`/hosting/web/${serviceName}/tasks/${id}`, {
            rootPath: 'apiv6',
          }),
        );
        return this.$q.all(promises);
      });
    }

    /**
     * Polling tasks
     * @param {string} serviceName
     * @param {object} opts
     * @returns {boolean}
     */
    pollTasks(serviceName, originalOpts) {
      const opts = clone(originalOpts);

      if (!opts.dump || !opts.task) {
        return this.$rootScope.$broadcast(`${opts.namespace}.error`, '');
      }

      if (!Array.isArray(opts.successSates)) {
        opts.successSates = [opts.successSates];
      }

      const url = `apiv6/hosting/web/${serviceName}/tasks/${opts.task.id}`;
      this.$rootScope.$broadcast(
        `${opts.namespace}.start`,
        opts.task,
        opts.dump,
      );

      return this.Poller.poll(url, null, {
        namespace: opts.namespace,
        interval: 5000,
        successRule: {
          state(task) {
            return opts.successSates.indexOf(task.state) !== -1;
          },
        },
        errorRule: {
          state(task) {
            return opts.errorsSates.indexOf(task.state) !== -1;
          },
        },
      }).then(
        (pollObject, task) => {
          this.$rootScope.$broadcast(
            `${opts.namespace}.done`,
            pollObject,
            task,
            opts.dump,
          );
        },
        (err) => {
          this.$rootScope.$broadcast(`${opts.namespace}.error`, err);
        },
        (task) => {
          this.$rootScope.$broadcast(`${opts.namespace}.doing`, task);
        },
      );
    }
  },
);
