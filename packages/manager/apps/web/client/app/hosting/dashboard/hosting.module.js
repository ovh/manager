import routing from './hosting.routes';

import automatedEmails from '../automated-emails/automated-emails.module';
import boost from '../boost/boost.module';
import cdn from '../cdn/hosting-cdn.modules';
import cron from '../cron/cron.module';
import database from '../database/hosting-database.module';
import envvars from '../envvars/envvars.module';
import generalInformations from '../general-informations/general-informations.module';
import freedom from '../freedom/freedom.module';
import ftp from '../ftp/ftp.module';
import hostingModule from '../module/hosting-module.module';
import indy from '../indy/indy.module';
import localSEO from '../local-seo/local-seo.module';
import multiSite from '../multisite/multisite.module';
import multisiteDomainConfiguration from '../multisite/domain-configuration/configuration.module';
import privateSqlActivation from '../database/private-sql-activation';
import runtimes from '../runtimes/runtimes.module';
import task from '../task/task.module';
import userLogs from '../user-logs/user-logs.module';

const moduleName = 'ovhManagerHosting';

angular
  .module(moduleName, [
    automatedEmails,
    boost,
    cdn,
    cron,
    database,
    envvars,
    freedom,
    ftp,
    generalInformations,
    hostingModule,
    indy,
    localSEO,
    multiSite,
    multisiteDomainConfiguration,
    'oui',
    'pascalprecht.translate',
    privateSqlActivation,
    runtimes,
    task,
    userLogs,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
