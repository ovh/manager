import AlertComponent from "./ovh-angular-browser-alert.component";
import AlertService from "./ovh-angular-browser-alert.service";

angular.module("ovhBrowserAlert", [])
    .service("browserAlertService", AlertService)
    .component("ovhBrowserAlert", AlertComponent);
