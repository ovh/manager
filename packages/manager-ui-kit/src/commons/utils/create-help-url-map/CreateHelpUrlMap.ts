import type { Subsidiary } from '@ovh-ux/manager-config';

type HelpUrlMap = Partial<Record<Subsidiary, string>>;

export const createHelpUrlMap = (
  root: string,
  { paths, overrides = {} }: { paths: HelpUrlMap; overrides?: HelpUrlMap },
): HelpUrlMap => {
  const built = (Object.entries(paths) as Array<[Subsidiary, string]>).reduce<HelpUrlMap>(
    (acc, [subsidiary, path]) => {
      acc[subsidiary] = `${root}/${path}`;
      return acc;
    },
    {},
  );

  return { ...built, ...overrides };
};
