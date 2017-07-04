angular.module("ovh-angular-user-pref").constant("OVH_USER_PREF", {
    path: {
        get: "me/preferences/manager",
        getKey: "me/preferences/manager/{key}",
        create: "me/preferences/manager",
        assign: "me/preferences/manager",
        remove: "me/preferences/manager/{key}"
    }
});
