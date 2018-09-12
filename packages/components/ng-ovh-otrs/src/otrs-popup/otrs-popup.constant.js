angular.module("ovh-angular-otrs")
    .constant("OTRS_POPUP_ASSISTANCE_ENUM", {
        USAGE: "usage",
        START: "start",
        NEW: "new",
        OTHER: "other"
    })
    .constant("OTRS_POPUP_BILLING_ENUM", {
        INPROGRESS: "inProgress",
        NEW: "new",
        BILL: "bill",
        AUTORENEW: "autorenew",
        OTHER: "other"
    })
    .constant("OTRS_POPUP_INCIDENT_ENUM", {
        PERFS: "perfs",
        ALERTS: "alerts",
        DOWN: "down"
    })
    .constant("OTRS_POPUP_INTERVENTION_ENUM", {
        REPLACEMENTDISK: "replacement-disk",
        OTHER: "other"
    })
    .constant("OTRS_POPUP_CATEGORIES", {
        ASSISTANCE: "assistance",
        BILLING: "billing",
        INCIDENT: "incident",
        INTERVENTION: "intervention",
        SALES: "sales"
    })
    .constant("OTRS_POPUP_SERVICES", {
        DOMAIN: "DOMAIN",
        HOSTING: "HOSTING",
        EMAIL: "EMAIL_DOMAIN",
        ZONE: "ZONE",
        SQL: "PRIVATE_DATABASE",
        EXCHANGE: "EXCHANGE",
        OFFICE_365: "OFFICE_365",
        VPS: "VPS",
        LOAD_BALANCER: "LOAD_BALANCER",
        FAILOVER: "FAILOVER",
        CLOUD: "CLOUD",
        CDN: "CDN_WEBSTORAGE",
        DEDICATED: "DEDICATED",
        CDN_DEDICATED: "CDN_DEDICATED"
    })
    .constant("OTRS_POPUP_UNIVERSES", {
        EU: ["CLOUD_DEDICATED", "SUNRISE", "TELECOM", "WEB"],
        CA: ["CLOUD_DEDICATED", "SUNRISE"],
        US: ["CLOUD_DEDICATED"]
    });
