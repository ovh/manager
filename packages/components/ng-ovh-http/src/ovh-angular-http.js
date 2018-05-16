import OvhHttpProvider from './ovh-angular-http.provider'

export default angular
    .module('ovh-angular-http', [])
    .provider('OvhHttp', OvhHttpProvider)
    .name;
