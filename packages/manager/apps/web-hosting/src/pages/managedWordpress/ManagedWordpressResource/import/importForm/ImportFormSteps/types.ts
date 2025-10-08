export type Step2FormValues = {
  plugins: { name: string; version: string; enabled: boolean }[];
  themes: { name: string; version: string; active: boolean }[];
  media: boolean;
  wholeDatabase: boolean;
  posts: boolean;
  pages: boolean;
  comments: boolean;
  tags: boolean;
  users: boolean;
};
