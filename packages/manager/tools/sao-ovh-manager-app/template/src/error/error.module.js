<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import managerErrorPage from '@ovh-ux/manager-error-page';

import routing from './error.routing';

const moduleName = 'ovhManager<%= pascalcasedName %>Error';

angular.module(moduleName, [managerErrorPage]).config(routing);

export default moduleName;
