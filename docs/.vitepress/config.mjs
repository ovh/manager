import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Manager',
  description: 'Documentation',

  lastUpdated: true,
  cleanUrls: true,

  srcDir: './docs',
  base: '/manager/',
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'How To', link: '/how-to/' },
      {
        text: 'Links',
        items: [
          { text: 'Manager', link: 'https://manager.eu.ovhcloud.com' },
          {
            text: 'Stay Tuned',
            items: [
              {
                text: 'Discussions',
                link: 'https://github.com/ovh/manager/discussions',
              },
            ],
          },
          {
            text: 'Contributing',
            items: [
              {
                text: 'Contribute',
                link: '/contributing',
              },
            ],
          },
          {
            text: 'Help',
            items: [
              {
                text: 'Issues',
                link: 'https://github.com/ovh/manager/issues',
              },
            ],
          },
          {
            text: 'Resources',
            items: [
              { text: 'API Console', link: 'https://api.ovh.com/console' },
              { text: 'Blog', link: 'https://blog.ovhcloud.com/' },
              {
                text: 'Continuous Delivery Service',
                link: 'https://ovh.github.io/cds/',
              },
              { text: 'Documentation', link: 'https://help.ovhcloud.com' },
              { text: 'Website', link: 'https://ovhcloud.com' },
            ],
          },
        ],
      },
    ],

    sidebar: {
      '/guide/': {
        base: '/guide/',
        items: [
          {
            text: 'Getting started',
            link: 'getting-started',
          },
          {
            text: 'Architecture',
            link: 'architecture',
          },
          {
            text: 'Applications',
            link: 'applications',
          },
          {
            text: 'Modules',
            link: 'modules',
          },
          {
            text: 'Components',
            link: 'components',
          },
          {
            text: 'Tools',
            link: 'tools',
          },
          {
            text: 'Scripts',
            link: 'scripts',
          },
          {
            text: 'Releasing',
            link: 'releasing',
          },
          {
            text: 'Testing',
            link: 'testing',
          },
          {
            text: 'Manager React Components',
            link: 'manager-react-components',
          },
        ],
      },
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/ovh/manager/edit/master/docs/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/ovh/manager' }],
  },
});
