import {
  CompilerCtx,
  ComponentCompilerMeta,
  Config,
} from '@stencil/core/internal';

import {
  convertTagToPascalCase,
  extractParametersFromMethodSignature,
  formatEventName,
  getComponentTagPrefix,
  getPathToCorePackageLoader,
} from './utils';
import {
  APPLY_POLYFILLS,
  BASIC_TYPES,
  DEFINE_CUSTOM_ELEMENTS,
} from './constants';
import { OutputTargetAngularJS } from './types';

/**
 * Get components apart from excluded ones.
 * @param  excludeComponents Components to exclude
 * @param  components        Source library components
 * @return                   Filtered components to work on
 */
function getFilteredComponents(
  excludeComponents: string[] = [],
  components: ComponentCompilerMeta[],
) {
  return components
    .sort((cmpA, cmpB) => {
      if (cmpA.tagName < cmpB.tagName) {
        return -1;
      }

      return cmpA.tagName > cmpB.tagName ? 1 : 0;
    })
    .filter((c) => !excludeComponents.includes(c.tagName) && !c.internal);
}

/**
 * Function set loader function imports and calls, based on output target configuration
 * @param  config       Stencil source library configuration
 * @param  outputTarget Output target configuration
 * @return              Text to write into final proxy file which includes code to call loader methods
 */
function getLoaderImports(
  config: Config,
  outputTarget: OutputTargetAngularJS,
): string {
  if (!outputTarget.applyPolyfills && !outputTarget.defineCustomElements) {
    return '';
  }

  const loaderImportPath = getPathToCorePackageLoader(config, outputTarget);
  const imports = `import { ${
    outputTarget.applyPolyfills ? `${APPLY_POLYFILLS}, ` : ''
  }${DEFINE_CUSTOM_ELEMENTS} } from '${loaderImportPath}';
`;
  const calls = `${
    outputTarget.applyPolyfills
      ? `${APPLY_POLYFILLS}().then(() => { ${DEFINE_CUSTOM_ELEMENTS}(); });`
      : `${DEFINE_CUSTOM_ELEMENTS}();
`
  }`;

  return `${imports}${calls}`;
}

/**
 * Get the component model, based on mutable properties and watchers callback
 * @param  component The component to search in
 * @return           Object describing component model (event and prop attached)
 */
function getComponentModelInformation(component: ComponentCompilerMeta) {
  const { events, properties, watchers } = component;

  const mutableProperties = properties.filter((prop) => prop.mutable);

  const modelProperty = mutableProperties.find((prop) =>
    watchers.find((watcher) => watcher.propName === prop.name),
  );

  if (!modelProperty) {
    return {};
  }

  const modelEvent = events.find((event) =>
    event.name.startsWith(modelProperty.name),
  );

  if (!modelEvent) {
    return {};
  }

  return {
    propName: modelProperty.name,
    eventName: modelEvent.name,
  };
}

/**
 * Get the component properties for wrapper component bindings
 * @param  properties Component properties
 * @return            AngularJS bindings to write
 */
function getComponentProperties(properties: any[]): string {
  return properties
    .sort((propA, propB) => {
      if (propA.name < propB.name) {
        return -1;
      }

      return propA.name > propB.name ? 1 : 0;
    })
    .map((prop) =>
      prop.isModel
        ? `model: "<",
    onModelChange: "&"`
        : `${prop.name}: '${prop.type === 'string' ? '@' : '<'}${
            prop.optional ? '?' : ''
          }'`,
    )
    .reduce(
      (bindings, binding) => `${bindings}${binding},
    `,
      '',
    );
}

/**
 * Get the component methods for wrapper component bindings
 * @param  properties Component methods
 * @return            AngularJS bindings to write
 */
function getComponentMethods(methods: any[]): string {
  return methods
    .map((method) => `${method.name}: '=?'`)
    .reduce(
      (allMethods, method) => `${allMethods}${method},
    `,
      '',
    );
}

/**
 * Get the component events for wrapper component bindings
 * @param  properties Component events
 * @return            AngularJS bindings to write
 */
function getComponentEventMethods(
  componentEvents: any[],
  componentModelInformation: any,
): string {
  return componentEvents
    .filter((event) => event.name !== componentModelInformation.eventName)
    .map((event) => `${formatEventName(event.name)}: '&'`)
    .reduce(
      (events, event) => `${events}${event},
    `,
      '',
    );
}

/**
 * Get the template for the AngularJS wrapper component
 * @param  componentTagName Tag name of the Stencil component to be injected in the template
 * @param  properties       Properties to convert as HTML attributes
 * @return                  AngularJS template to write
 */
function getComponentTemplate(
  componentTagName: string,
  properties: any[],
): string {
  const attributes = properties
    .filter((prop) => BASIC_TYPES.includes(prop.type))
    .sort((prop) => (prop.isModel ? -1 : 0))
    .reduce(
      (attrs, prop) =>
        `${attrs} ${!prop.isModel ? 'ng-attr-' : ''}${
          prop.attribute
        }="{{$ctrl.${prop.isModel ? 'model' : `${prop.name} || undefined`}}}"`,
      '',
    );

  return `<${componentTagName}${attributes}></${componentTagName}>`;
}

/**
 * Parse the Stencil component properties.
 * Will transform the property corresponding to the component model
 * @param  componentProperties       Properties to parse
 * @param  componentModelInformation Information on component model
 * @return                           Parsed properties
 */
function parseProperties(
  componentProperties: any[],
  componentModelInformation: any,
): any[] {
  // Find two-way binded component model attached event, if exists
  return componentProperties.map((prop) =>
    prop.name === componentModelInformation.propName
      ? {
          ...prop,
          isModel: true,
        }
      : prop,
  );
}

/**
 * Function to set the initiazation code which will sets value of component properties with complex type.
 * (e.g.: Object, Array...)
 * @param  properties Properties source
 * @return            Statement to write in the $onInit controller hook.
 */
function setComplexItems(properties: any[]): string {
  return properties
    .filter((prop) => !BASIC_TYPES.includes(prop.type))
    .map((prop) => `this.webComponent.${prop.name} = this.${prop.name}`)
    .reduce(
      (complexBindings, prop) => `${complexBindings}${prop};
      `,
      '',
    );
}

/**
 * Function to set the corresponding logic for the Stencil component events method.
 * Will handle specific callback code for the component model attached event.
 * @param  componentEvents           Component events
 * @param  componentModelInformation Information of the component model
 * @return                           Statement to write in the $onInit controller hook.
 */
function setEvents(
  componentEvents: any[],
  componentModelInformation: any,
): string {
  return componentEvents
    .map(
      (event) => `
      this.webComponent.addEventListener('${event.name}', (event) => {
        ${
          event.name === componentModelInformation.eventName
            ? `this.onModelChange({ value: event.detail });
`
            : `this.${formatEventName(event.name)}({ event });`
        }
      });
    `,
    )
    .reduce(
      (events, event) => `${events}
    ${event}`,
      '',
    );
}

/**
 * Set the code to assign component public methods
 * @param  componentMethods Stencil component public methods
 * @return                  Statement to write in the $onInit controller hook
 */
function setPublicMethods(componentMethods: any[]): string {
  return componentMethods
    .map((method) => {
      const parameters = extractParametersFromMethodSignature(
        method.complexType.signature,
      );
      return `this.${method.name} = (${parameters.join(
        ', ',
      )}) => this.webComponent.${method.name}(${parameters.join(', ')});`;
    })
    .reduce(
      (methods, method) => `${methods}
      ${method}`,
      '',
    );
}

/**
 * Creates $onChanges hook for complex properties
 * @param  componentProperties Stencil component properties
 * @return                     Statement to write the $onChanges controller hook
 */
function setOnChangesHook(componentProperties: any[]) {
  const complexProperties = componentProperties.filter(
    (prop) => !BASIC_TYPES.includes(prop.type),
  );

  if (complexProperties.length > 0) {
    return `
    $onChanges(changes) {
      if (this.webComponent) {
        ${complexProperties.map(
          (prop) => `
        if(changes.${prop.name} !== undefined && !angular.equals(changes.${prop.name}.previousValue, changes.${prop.name}.currentValue)) {
          this.webComponent.${prop.name} = this.${prop.name};
        }
        `,
        ).join(`
`)}
      }
    }
    `;
  }

  return '';
}

/**
 * Function to write specific AngularJS component to wrap the Stencil component
 * @param  component    Stencil component
 * @param  outputTarget Output target configuration
 * @return              Generated AngularJS wrapper component
 */
function writeComponent(
  component: ComponentCompilerMeta,
  outputTarget: OutputTargetAngularJS,
): string {
  const componentModel = getComponentModelInformation(component);
  const properties = parseProperties(component.properties, componentModel);
  const componentName = `${getComponentTagPrefix(
    outputTarget,
  )}${convertTagToPascalCase(component.tagName)}`;

  return `
/* auto-generated AngularJS component */
const ${componentName} = {
  bindings: {
    ${getComponentProperties(properties)}
    ${getComponentMethods(component.methods)}
    ${getComponentEventMethods(component.events, componentModel)}
  },
  controller: ['$element', class ${componentName}Controller {
    constructor($element) {
      this.$element = $element;
    }

    $onInit() {
      this.angularComponent = this.$element[0];
      this.webComponent = this.angularComponent.firstChild;
      ${setComplexItems(properties)}
      ${setEvents(component.events, componentModel)}
      ${setPublicMethods(component.methods)}
    }

    ${setOnChangesHook(component.properties)}
  }],
  template: '${getComponentTemplate(component.tagName, properties)}',
}

export const ${componentName}Module = "${componentName}Module";

angular
  .module(${componentName}Module, [])
  .component("${componentName}", ${componentName});

`;
}

/**
 * Function to generate proxies representing components into output target file
 * @param  componentsToBuild Components to be written
 * @param  outputTarget      Output target configuration
 * @return                   Proxies to be included
 */
function generateProxies(
  componentsToBuild: ComponentCompilerMeta[],
  outputTarget: OutputTargetAngularJS,
): string {
  return componentsToBuild
    .map((component: ComponentCompilerMeta) =>
      writeComponent(component, outputTarget),
    )
    .reduce(
      (acc, formattedComponent) => `${acc}${formattedComponent}
`,
      '',
    );
}

/**
 * Function to generate the AngularJS output, from the Stencil source library
 * @param  config            Stencil source library configuration
 * @param  compilerCtx       Stencil compiler context
 * @param  outputTarget      Output target configuration
 * @param  componentsToBuild List of components of the source Stencil library
 * @return                   Promise to handle asynchronous call to write proxy file
 */
export async function angularJSProxyOutput(
  config: Config,
  compilerCtx: CompilerCtx,
  outputTarget: OutputTargetAngularJS,
  componentsToBuild: ComponentCompilerMeta[],
): Promise<void> {
  const filteredComponents = getFilteredComponents(
    outputTarget.excludeComponents,
    componentsToBuild,
  );

  const imports = getLoaderImports(config, outputTarget);
  const angularImport = `import angular from 'angular';
`;
  const proxies = generateProxies(filteredComponents, outputTarget);

  await compilerCtx.fs.writeFile(
    outputTarget.proxiesFile,
    `/* eslint-disable */
${angularImport}${imports}
${proxies}
export default {
  ${filteredComponents
    .map(
      (comp) =>
        `${getComponentTagPrefix(outputTarget)}${convertTagToPascalCase(
          comp.tagName,
        )}Module`,
    )
    .join(', ')}
}
  `.replace(/^\s*\n/gm, ''),
  );
}
