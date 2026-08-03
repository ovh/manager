import i18next from 'i18next';
import { beforeAll, describe, expect, it } from 'vitest';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

import {
  defaultLocale,
  initTestI18n,
  labels,
  moduleResources,
  sharedResources,
} from './i18ntest.utils';

const allResources = { ...moduleResources, ...sharedResources };

describe('i18n test harness', () => {
  beforeAll(async () => {
    await initTestI18n();
  });

  it('registers every namespace it exposes', () => {
    const unregistered = Object.keys(allResources).filter(
      (namespace) => !i18next.hasResourceBundle(defaultLocale, namespace),
    );

    expect(unregistered).toEqual([]);
  });

  it('covers every namespace declared by the module', () => {
    expect(Object.keys(moduleResources).sort()).toEqual(
      Object.values(BACKUP_LICENSES_NAMESPACES).sort(),
    );
  });

  it('registers every bundle exposed in labels', () => {
    const registered = Object.values(allResources);
    const unregistered = Object.entries(labels)
      .filter(([, resources]) => !registered.includes(resources))
      .map(([name]) => `labels.${name}`);

    expect(unregistered).toEqual([]);
  });
});
