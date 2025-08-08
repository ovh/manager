export interface ChangelogMenuLinks {
  changelog: string;
  roadmap: string;
  'feature-request': string;
}

export interface ChangelogMenuProps {
  links: ChangelogMenuLinks;
  chapters?: string[];
  prefixes?: string[];
}
