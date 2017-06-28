"use strict";

/**
 * This his custom OVH At-Internet configuration of order's customVars attribute.
 */
angular.module("ng-at-internet")
    .constant("AT_INTERNET_CUSTOM_VARS", {

    /**
     * Country code of the customer making the order
     */
        countryCode: {
            path: "site.2", // OVH's AtInternet configuration
            format: "[%s]"
        },

    /**
     * Currency code of the customer
     */
        currencyCode: {
            path: "site.4", // OVH's AtInternet configuration
            format: "[%s]"
        },

    /**
     * Referrer site
     */
        referrerSite: {
            path: "site.5", // OVH's AtInternet configuration
            format: "[%s]"
        },

    /**
     * Event
     */
        event: {
            path: "site.6", // OVH's AtInternet configuration
            format: "[%s]"
        }
    });
