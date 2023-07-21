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
        name: 'isApiV2',
        message: 'Is APIV2 is used',
        type: 'confirm',
        default: false,
      },
      {
        name: 'apiPath',
        message: 'What API base route is used',
        default({ name }) {
          return `/${camelcase(name)}`;
        },
      },
      // Only for API NOT V2
      {
        name: 'apiModel',
        message: 'What API model describes an instance of a product',
        default({ name }) {
          return `${camelcase(name)}.${camelcase(name)}`;
        },
        when: (answers) => answers.isApiV2 === false,
      },
      {
        name: 'serviceName',
        message: 'What property is used as unique identifier',
        default() {
          return 'serviceName';
        },
        when: (answers) => answers.isApiV2 === false,
      },
      // Only for APIV2
      {
        name: 'resourceIdProperty',
        message: 'What property is used as unique identifier',
        default() {
          return 'id';
        },
        when: (answers) => answers.isApiV2 === true,
      },
      {
        name: 'linkProperty',
        message: 'What property is used as a link to dashboard page',
        default() {
          return 'id';
        },
        when: (answers) => answers.isApiV2 === true,
      },
    ];
  },
  actions() {
    const actions = [
      {
        type: 'add',
        files: '**',
      },
    ];
    actions[0].templateDir = this.answers.isApiV2
      ? 'template/apiv2'
      : 'template/default';

    return [
      ...actions,
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
