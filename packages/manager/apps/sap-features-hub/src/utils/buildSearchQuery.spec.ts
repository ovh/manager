import { describe, it, expect } from 'vitest';
import {
  buildViewInstallationRedirectUrl,
  buildSearchQuery,
  buildDeleteInstallationUrl,
} from './buildSearchQuery';
import { urls } from '@/routes/routes.constant';

describe('buildSearchQuery test suite', () => {
  const serviceName = 'testService';
  const taskId = 'testTask';
  const page = 42;
  const debug = false;

  it('returns the search query with params passed', () => {
    expect(buildSearchQuery({ serviceName })).toEqual(
      `?serviceName=${serviceName}`,
    );
    expect(buildSearchQuery({ serviceName, taskId, page, debug })).toEqual(
      `?serviceName=${serviceName}&taskId=${taskId}&page=${page}&debug=${debug}`,
    );
  });

  it('returns the search query without null, undefined or empty string params passed', () => {
    expect(
      buildSearchQuery({
        serviceName,
        taskId: '',
        page: null,
        debug: undefined,
      }),
    ).toEqual(`?serviceName=${serviceName}`);
  });

  it('returns an empty string if all params are undefined or null', () => {
    expect(
      buildSearchQuery({ serviceName: '', taskId: undefined, page: null }),
    ).toEqual('');
  });
});

describe('buildViewInstallationRedirectUrl test suite', () => {
  const serviceName = 'testService';
  const taskId = 'testTask';

  it('returns the report url with params passed', () => {
    expect(buildViewInstallationRedirectUrl({ serviceName, taskId })).toEqual(
      `${urls.installationReport}?serviceName=${serviceName}&taskId=${taskId}`,
    );
  });

  it.each([
    { desc: 'empty serviceName', serviceName: '', taskId },
    { desc: 'empty taskId', serviceName, taskId: '' },
    { desc: 'undefined taskId', serviceName, taskId: undefined },
    { desc: 'null taskId', serviceName, taskId: null },
  ])(
    'returns the listing url with $desc passed as params',
    ({ serviceName: serviceInput, taskId: taskInput }) => {
      expect(
        buildViewInstallationRedirectUrl({
          serviceName: serviceInput,
          taskId: taskInput,
        }),
      ).toEqual(urls.listing);
    },
  );
});

describe('buildDeleteInstallationUrl test suite', () => {
  const serviceName = 'testService';
  const taskId = 'testTask';

  it('returns the delete url with params passed', () => {
    expect(buildDeleteInstallationUrl({ serviceName, taskId })).toEqual(
      `${urls.deleteInstallation}?serviceName=${serviceName}&taskId=${taskId}`,
    );
  });

  it.each([
    { desc: 'empty serviceName', serviceName: '', taskId },
    { desc: 'empty taskId', serviceName, taskId: '' },
    { desc: 'undefined taskId', serviceName, taskId: undefined },
    { desc: 'null taskId', serviceName, taskId: null },
  ])(
    'returns the listing url with $desc passed as params',
    ({ serviceName: serviceInput, taskId: taskInput }) => {
      expect(
        buildDeleteInstallationUrl({
          serviceName: serviceInput,
          taskId: taskInput,
        }),
      ).toEqual(urls.listing);
    },
  );
});
