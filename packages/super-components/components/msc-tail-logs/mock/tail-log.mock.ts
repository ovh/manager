import apiClient from '@ovh-ux/manager-core-api';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(apiClient.v6);

mock
  .onGet(
    `cloud/project/123fdshfjkdshfdjkshf/database/mongodb/1s97897h-98989-787878-e798789GHH/logs&sort=asc&limit=500`,
  )
  .reply(200, [
    {
      hostname: 'your database server 1',
      message:
        'WARNING - ACCESS - Client has attempted to reauthenticate as a single user {"user":{"db":"local","user":"__system"}}',
      timestamp: 1691415883,
    },
    {
      hostname: 'your database server 1',
      message: 'CRIT - You are disconnected on your database mongoDB',
      timestamp: 1691415884,
    },
    {
      hostname: 'your database server 1',
      message: 'DEBUG - You are connected on your database mongoDB',
      timestamp: 1691415885,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415886,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415887,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415888,
    },
  ]);

mock
  .onGet(
    `cloud/project/df87878787897/database/mongodb/fdsfsHJH878dffdsfds4123-78787fdfdsf/logs&sort=asc&limit=2`,
  )
  .reply(200, [
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415883,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415892,
    },
  ]);

mock
  .onGet(
    `cloud/project/1fdsfdsfdsfsdJHf789/database/mongodb/1fdsfds0987-4123-efdsfsd1234/logs&sort=desc&limit=500`,
  )
  .reply(200, [
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415889,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415888,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415887,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415886,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415885,
    },
    {
      hostname: 'your database server 1',
      message: 'INFO - You are connected on your database mongoDB',
      timestamp: 1691415884,
    },
  ]);
