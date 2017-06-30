angular.module("ovh-angular-mondial-relay").constant("MONDIAL_RELAY", {
    weekDays: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ],
    iconSize: [30, 36], // size of the icon
    shadowSize: [41, 26], // size of the shadow
    iconAnchor: [15, 36], // point of the icon which will correspond to marker's location
    shadowAnchor: [6, 22], // the same for the shadow
    popupAnchor: [-3, -36], // point from which the popup should open relative to the iconAnchor,
    initialBoundingBox: [
        [51.201, -4.056],
        [42.466, 7.923]
    ],
    initialLocation: {
        lat: 45.8556,
        lng: 2.3466,
        zoom: 5
    },
    defaultCountry: "fr",
    ipLocUrl: "https://freegeoip.net/json/",
    metroFrZipValidator: /^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/
});
