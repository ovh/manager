const camelcase = require('camelcase');

const pkg = require('./package.json');

module.exports = {
  description: pkg.description,
  transformerOptions: {
    context: {
      camelcase,
    },
  },
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new module',
        default: this.outFolder,
        filter: (val) => val.toLowerCase(),
      },
      {
        name: 'description',
        message: 'How would you describe the new module',
        default({ name }) {
          return `OVHcloud ${camelcase(name, { pascalCase: true })} product`;
        },
      },
      {
        name: 'apiPath',
        message: 'What API base route is used',
        default({ name }) {
          return `/${camelcase(name)}`;
        },
      },
      {
        name: 'apiModel',
        message: 'What API model describes an instance of a product',
        default({ name }) {
          return `${camelcase(name)}.${camelcase(name)}`;
        },
      },
      {
        name: 'serviceName',
        message: 'What property is used as unique identifier',
        default() {
          return 'serviceName';
        },
      },
    ];
  },
  actions() {
    return [
      {
        type: 'add',
        files: '**',
      },
      {
        type: 'move',
        patterns: {
          '_package.json': 'package.json',
        },
      },
      {
        type: 'modify',
        files: 'package.json',
        // eslint-disable-next-line global-require
        handler: (data) => require('./lib/update-pkg')(this.answers, data),
      },
    ];
  },
  async completed() {
    this.showProjectTips();
  },
};
