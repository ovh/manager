angular.module('ua.alerter').service('Alerter', ['$rootScope', function ($rootScope) {
    "use strict";

    var self = this,
        alertTypesHash = {
            'ERROR': 'alert-danger',
            'PARTIAL': 'alert-warning',
            'OK': 'alert-success',
            'WARNING': 'alert-warning',
            'INFO': 'alert-info',
            'BLOCKED': 'alert-danger',
            'blocked': 'alert-danger',
            'CANCELLED': 'alert-danger',
            'cancelled': 'alert-danger',
            'PAUSED': 'alert-danger',
            'paused': 'alert-danger',
            'error': 'alert-danger',
            'WAITING_ACK': 'alert-warning',
            'waitingAck': 'alert-warning',
            'DOING': 'alert-info',
            'doing': 'alert-info',
            'TODO': 'alert-success',
            'todo': 'alert-success',
            'DONE': 'alert-success',
            'done': 'alert-success',
            'true': 'alert-success',
            'init': 'alert-success',
            'INIT': 'alert-success',
            'false': 'alert-danger'
        };

    this.set = function (type, message, details, alertId) {
        $rootScope.$broadcast('ovhAlert.show', type, message, details, alertId);
    };

    this.success = function (message, alertId) {
        self.set(alertTypesHash.OK, message, null, alertId);
    };
    this.error = function (message, alertId) {
        self.set(alertTypesHash.ERROR, message, null, alertId);
    };

    this.alertFromSWSBatchResult = function (messages, data, alertId) {
        var messageToSend = "",
            messagesFiltered = [],
            i = 0,
            alertType = "",
            messageDetails = null;
        if(data && data.state) {
            messagesFiltered = $.grep(data.messages, function (e) {
                return e.type && e.type !== "INFO";
            });

            alertType = alertTypesHash[data.state];
            messageToSend = messages[data.state];
            if(data.state === 'OK') {
                if(messagesFiltered.length > 0) {
                    messageToSend += " (";
                    for (i; i < messagesFiltered.length; i++) {
                        messageToSend += messagesFiltered[i].id + " : " + messagesFiltered[i].message + (messagesFiltered.length === (i + 1) ? ')' : ', ');
                    }
                }
            }
            else {
                messageDetails = messagesFiltered;
            }
        }
        self.set(alertType, messageToSend, messageDetails, alertId);
    };

    this.alertFromSWS = function (message, data, alertId) {
        var messageToSend = message,
            i = 0,
            messagesFiltered = [],
            alertType = "";
        if (data) {
            if (data.message) {
                messageToSend += " (" + data.message + ")";
                alertType = alertTypesHash[data.type];
            }
            else if (data.messages) {
                if (data.messages.length > 0) {
                    alertType = alertTypesHash[data.state];
                    messagesFiltered = $.grep(data.messages, function (e) {
                        return e.type && e.type !== "INFO";
                    });
                    if(messagesFiltered.length > 0) {
                        messageToSend += " (";
                        for (i; i < messagesFiltered.length; i++) {
                            messageToSend += messagesFiltered[i].id + " : " + messagesFiltered[i].message + (messagesFiltered.length === (i + 1) ? ')' : ', ');
                        }
                    }
                }
            }
            else if (data.idTask && data.state) {
                alertType = alertTypesHash[data.state];
            }
            else if(alertTypesHash[data]) {
                alertType = alertTypesHash[data];
            }
        }
        self.set(alertType || 'alert-warning', messageToSend, null, alertId);
    };

    this.resetMessage = function(alertId){
        $rootScope.$broadcast('ovhAlert.resetMessage', alertId);
    };

}]);
