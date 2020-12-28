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
        message: 'What is the name of the new app',
        default: this.outFolder,
        filter: (val) => val.toLowerCase(),
      },
      {
        name: 'description',
        message: 'How would you describe the new app',
        default({ name }) {
          return `OVHcloud ${camelcase(name, { pascalCase: true })} app`;
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
          '_eslintrc.json': '.eslintrc.json',
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
