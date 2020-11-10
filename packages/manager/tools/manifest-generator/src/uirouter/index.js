const { parse } = require('@babel/parser');
const { default: generate } = require('@babel/generator');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const STATUS_OK = 'OK';
const STATUS_PARTIAL = 'PARTIAL';
const STATUS_ERROR = 'ERROR';

const getUrl = (urlProperty) => {
  if (t.isLiteral(urlProperty)) {
    return {
      url: urlProperty.value,
      rawUrl: urlProperty.value,
      status: STATUS_OK,
    };
  }
  if (t.isCallExpression(urlProperty)) {
    const { callee: urlCallee } = urlProperty;
    if (
      t.isLiteral(urlCallee.object) &&
      t.isIdentifier(urlCallee.property) &&
      urlCallee.property.name === 'concat' &&
      urlProperty.arguments.length === 1
    ) {
      return {
        url: urlCallee.object.value.split('?')[0],
        status: STATUS_PARTIAL,
        rawUrl: generate(urlProperty).code,
      };
    }
  }
  return {
    url: undefined,
    rawUrl: undefined,
    status: STATUS_ERROR,
  };
};

const getAbstract = (property) => {
  if (t.isUnaryExpression(property) && t.isNumericLiteral(property.argument)) {
    const { value } = property.argument;
    const { operator } = property;
    return operator === '!' ? !value : value;
  }
  return false;
};

const searchStates = (source) => {
  if (!source.includes('.state(')) {
    return {};
  }

  const states = {};
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['dynamicImport'],
  });

  traverse(ast, {
    CallExpression(nodePath) {
      const { node } = nodePath;
      const { callee, arguments: args } = node;
      const [stateName, stateDeclaration] = args;

      const isStateDeclaration =
        t.isIdentifier(callee.property) &&
        callee.property.name === 'state' &&
        args.length === 2 &&
        t.isLiteral(stateName) &&
        t.isObjectExpression(stateDeclaration) &&
        !stateName.value.endsWith('.**');

      if (isStateDeclaration) {
        const { value: urlProperty } = stateDeclaration.properties.find(
          ({ key }) => t.isIdentifier(key) && key.name === 'url',
        ) || { value: undefined };
        const { value: abstractProperty } =
          stateDeclaration.properties.find(
            ({ key }) => t.isIdentifier(key) && key.name === 'abstract',
          ) || {};

        const url = urlProperty
          ? getUrl(urlProperty, ast)
          : { url: '', status: STATUS_OK };
        const isAbstract = getAbstract(abstractProperty);

        if ([STATUS_OK, STATUS_PARTIAL].includes(url.status)) {
          if (url.status === STATUS_PARTIAL) {
            // eslint-disable-next-line no-console
            console.log(
              `Partial url found for ${stateName.value} ('${url.url}' instead of '${url.rawUrl}')`,
            );
          }

          states[stateName.value] = {
            ...url,
            abstract: isAbstract,
          };
        } else {
          // eslint-disable-next-line no-console
          console.log(`No url found for ${stateName.value}`);
        }
      }
    },
  });
  return states;
};

const buildAbsoluteUrls = (states) =>
  Object.keys(states)
    .sort()
    .reduce((list, name) => {
      const stateDeclaration = states[name];

      if (stateDeclaration.url.startsWith('^')) {
        return {
          ...list,
          [name]: {
            ...stateDeclaration,
            url: stateDeclaration.url.substring(1),
          },
        };
      }

      const parentName = name
        .split('.')
        .slice(0, -1)
        .join('.');
      const parentUrl = (list[parentName] || { url: '' }).url.split('?')[0];
      return {
        ...list,
        [name]: {
          ...stateDeclaration,
          url: `${parentUrl}${stateDeclaration.url}`,
        },
      };
    }, {});

const removeAbstract = (states) =>
  Object.keys(states).reduce((list, name) => {
    if (states[name].abstract) {
      return list;
    }
    return {
      ...list,
      [name]: states[name],
    };
  }, {});

const mapUrl = (states) =>
  Object.keys(states).reduce((list, name) => {
    return {
      ...list,
      [name]: states[name].url,
    };
  }, {});

const parseRoutes = (sources) => {
  const states = sources.reduce(
    (list, source) => ({ ...list, ...searchStates(source) }),
    {},
  );
  return mapUrl(removeAbstract(buildAbsoluteUrls(states)));
};

module.exports = {
  parseRoutes,
};
