angular.module('ua.sessionTimeout').factory('sessiontimeout', function () {
    'use strict';

    var timeoutDelayInMinutes = 60,
        remaining = timeoutDelayInMinutes,
        remainingDelayForConfirmation = 10,
        timer = false,
        fetchInProgress = false,
        confirmationDelayReachedCallback = false,
        sessionEndedCallback = false,
        sessionExpirationDelayChangeCallback = false;

    this.fetch = function () {

        if (!fetchInProgress) {
            fetchInProgress = true;

            // TODO
        }
    };

    this.reset = function () {
        this.stop();
        remaining = timeoutDelayInMinutes;
        this.init();
    };

    this.stop = function () {
        clearInterval(timer);
        timer = false;
    };

    this.init = function () {
        if (!timer) {
            timer = setInterval(function () {

                remaining--;

                if (remaining === remainingDelayForConfirmation) {
                    if (sessionExpirationDelayChangeCallback) {
                        sessionExpirationDelayChangeCallback(remaining);
                    }

                    if (confirmationDelayReachedCallback) {
                        confirmationDelayReachedCallback();
                    }
                } else if (remaining === 0) {
                    clearInterval(timer);

                    if (sessionEndedCallback) {
                        sessionEndedCallback();
                    }
                } else if (remaining < remainingDelayForConfirmation && sessionExpirationDelayChangeCallback) {
                    sessionExpirationDelayChangeCallback(remaining);
                }
            }, 60000); // every minute
        }
    };

    this.getRemainingExpirationDelay = function () {
        return remaining;
    };

    this.onConfirmationDelayReached = function (callback) {
        if (callback && $.isFunction(callback)) {
            confirmationDelayReachedCallback = callback;
        }
    };

    this.onSessionEnded = function (callback) {
        if (callback && $.isFunction(callback)) {
            sessionEndedCallback = callback;
        }
    };

    this.onSessionExpirationDelayChange = function (callback) {
        if (callback && $.isFunction(callback)) {
            sessionExpirationDelayChangeCallback = callback;
        }
    };

    return this;
});
