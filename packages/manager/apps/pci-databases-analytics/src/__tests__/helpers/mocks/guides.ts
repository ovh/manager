import * as database from '@/types/cloud/project/database';
import { Guide, GuideSections } from '@/types/guide';

export const mockedGuide: Guide = {
  section: GuideSections.integrations,
  engine: database.EngineEnum.mongodb,
  lang: 'fr_FR',
  slug: 'slug',
  title: 'how to make integrations',
  excerpt: 'excerpt',
  url: 'https://monguide.manageddb.com',
};

export const mockedGuideOnboarding: Guide = {
  section: GuideSections.onboarding,
  engine: database.EngineEnum.mongodb,
  lang: 'fr_FR',
  slug: 'slug',
  title: 'how to start a new db',
  excerpt: 'excerpt',
  url: 'https://monguide-onboarding.manageddb.com',
};
