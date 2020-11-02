const fs = require('fs');
const { logger } = require('@vuepress/shared-utils');

const { groupedWorkspaces } = require('./cli/prebuild');

module.exports = {
  base: '/manager/',
  title: 'Manager',
  description: 'OVHcloud Control Panel Documentation',
  head: [
    ['link', { rel: 'icon', href: `/assets/img/favicon.png` }],
    ['link', { rel: 'apple-touch-icon', href: `/assets/img/touchicon-180.png` }],
  ],
  themeConfig: {
    docsDir: 'docs',
    editLinks: true,
    logo: '/assets/img/logo-ovhcloud.svg',
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'How To', link: '/how-to/' },
      {
        text: 'Links',
        items: [
          { text: 'Manager', link: 'https://ovh.com/manager' },
          {
            text: 'Stay Tuned',
            items: [{ text: 'Gitter', link: 'https://gitter.im/ovh/ux' }],
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
            'test-e2e',
          ],
        },
      ],
    },
  },
  extendCli(cli) {
    cli
      .command('prebuild [targetDir]', '')
      .option('--debug', 'display info in debug mode')
      .action((dir = '.') => {
        logger.wait('Pre-building file...');
        // Output to a static file.
        return fs.writeFile(
          `${dir}/.vuepress/public/assets/json/packages.json`,
          JSON.stringify(groupedWorkspaces),
          (err) => {
            if (err) throw err;
            logger.success('Pre-build file has been successfully generated.');
          },
        );
      });
  },
};
