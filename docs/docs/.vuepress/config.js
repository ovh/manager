import fs from 'fs';
import { defaultTheme } from '@vuepress/theme-default';
import { searchPlugin } from '@vuepress/plugin-search';
import { groupedWorkspaces } from './cli/prebuild';

export default {
  base: '/manager/',
  title: 'Manager',
  description: 'OVHcloud Control Panel Documentation',
  head: [
    ['link', { rel: 'icon', href: `/assets/img/favicon.png` }],
    ['link', { rel: 'apple-touch-icon', href: `/assets/img/touchicon-180.png` }],
  ],
  plugins: [
    searchPlugin({}),
  ],
  theme: defaultTheme({
    docsDir: 'docs/docs',
    editLinks: true,
    logo: '/assets/img/logo-ovhcloud.svg',
    navbar: [
      { text: 'Guide', link: '/guide/' },
      { text: 'How To', link: '/how-to/' },
      {
        text: 'Links',
        children: [
          { text: 'Manager', link: 'https://ovh.com/manager' },
          {
            text: 'Stay Tuned',
            children: [{ text: 'Discussions', link: 'https://github.com/ovh/manager/discussions' }],
          },
          {
            text: 'Contributing',
            children: [
              {
                text: 'Contribute',
                link: '/contributing',
              },
            ],
          },
          {
            text: 'Help',
            children: [
              {
                text: 'Issues',
                link: 'https://github.com/ovh/manager/issues',
              },
            ],
          },
          {
            text: 'Resources',
            children: [
              { text: 'API Console', link: 'https://api.ovh.com/console' },
              { text: 'Blog', link: 'https://www.ovh.com/blog/' },
              {
                text: 'Continuous Delivery Service',
                link: 'https://ovh.github.io/cds/',
              },
              { text: 'Documentation', link: 'https://docs.ovh.com' },
              { text: 'Website', link: 'https://ovhcloud.com' },
            ],
          },
        ],
      },
    ],
    repo: 'ovh/manager',
    sidebar: {
      '/guide/': [
        {
          title: 'Guides',
          collapsable: false,
          children: [
            '',
            'getting-started',
            'architecture',
            'applications',
            'modules',
            'components',
            'tools',
            'scripts',
            'releasing',
            'testing',
          ],
        },
      ],
    },
  }),
  extendCli(cli) {
    cli
      .command('prebuild [targetDir]', '')
      .option('--debug', 'display info in debug mode')
      .action((dir = '.') => {
        // Output to a static file.
        return fs.writeFile(
          `${dir}/.vuepress/public/assets/json/packages.json`,
          JSON.stringify(groupedWorkspaces),
          (err) => {
            if (err) throw err;
          },
        );
      });
  },
};
