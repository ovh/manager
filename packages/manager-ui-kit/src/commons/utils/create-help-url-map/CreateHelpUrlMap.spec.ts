import { describe, expect, it } from 'vitest';

import type { Subsidiary } from '@ovh-ux/manager-config';

import { createHelpUrlMap } from './CreateHelpUrlMap';

type HelpUrlMap = Partial<Record<Subsidiary, string>>;

type HelpUrlMapCase = {
  root: string;
  paths: HelpUrlMap;
  overrides?: HelpUrlMap;
  expected: HelpUrlMap;
};

describe('createHelpUrlMap', () => {
  const cases: HelpUrlMapCase[] = [
    {
      root: 'https://help.ovh.com',
      paths: {
        FR: 'docs/fr',
        US: 'docs/us',
      },
      overrides: {
        US: 'https://override.example/us',
        DE: 'https://override.example/de',
      },
      expected: {
        FR: 'https://help.ovh.com/docs/fr',
        US: 'https://override.example/us',
        DE: 'https://override.example/de',
      },
    },
    {
      root: 'https://root',
      paths: {
        FR: 'fr',
        CA: 'ca',
      },
      expected: {
        FR: 'https://root/fr',
        CA: 'https://root/ca',
      },
    },
  ];

  it.each(cases)(
    'builds urls from root and merges overrides',
    ({ root, paths, overrides, expected }) => {
      const result = createHelpUrlMap(root, {
        paths,
        overrides,
      });

      expect(result).toEqual(expected);
    },
  );
});
