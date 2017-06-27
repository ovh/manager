"use strict";

describe("ovh-angular-swimming-poll", function () {
    var $scope;
    var $httpBackend;
    var elem;
    var $poller;
    var $timeout;

    beforeEach(angular.mock.module("ovh-angular-swimming-poll"));

    beforeEach(angular.mock.inject(function (_$rootScope_, _$httpBackend_, Poller, _$timeout_) {
        $scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $poller = Poller;

        elem = $("<div>").prependTo("body");
        $scope.$digest();
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $scope.$destroy();
        elem.remove();
    });

    describe("Testing poll on a task", function () {

        it("should works with ok status", function () {
            var task_done_response = { id: 221, "function": "create_new_ip", execution_date: "2015-03-04T11:22:51.684558Z", done_date: "2015-03-04T11:23:17.174982Z", status: "done", progress: 100 };
            $httpBackend.whenGET("testingWithOneTask").respond(200, task_done_response);

            var success;
            var error;
            var notify;

            $poller.poll(
                "testingWithOneTask",
                null,
                { namespace: "namespace" }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            expect(error).toBeUndefined();
            expect(notify).toBeUndefined();
            expect(success).toEqual(task_done_response);
        });

        it("should not works with error status", function () {
            var task_blocked_response = { id: 221, "function": "create_new_ip", execution_date: "2015-03-04T11:22:51.684558Z", done_date: "2015-03-04T11:23:17.174982Z", status: "blocked", progress: 100 };
            $httpBackend.whenGET("testingWithOneBlockedTask").respond(200, task_blocked_response);

            var success;
            var error;
            var notify;

            $poller.poll(
                "testingWithOneBlockedTask",
                null,
                { namespace: "namespace" }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            // Add 3 more flush $timeout & $httpBackend due to "defaultRetryMaxAttemps" default is 3 retries
            $timeout.flush();
            $httpBackend.flush();

            $timeout.flush();
            $httpBackend.flush();

            $timeout.flush();
            $httpBackend.flush();

            expect(success).toBeUndefined();
            expect(notify).toBeUndefined();
            expect(error).toEqual(task_blocked_response);
        });

        it("should send notify with unknown status", function () {
            var task_unknown_response = { id: 221, "function": "create_new_ip", execution_date: "2015-03-04T11:22:51.684558Z", done_date: "2015-03-04T11:23:17.174982Z", status: "burrrrp", progress: 100 };
            $httpBackend.whenGET("testingWithOneUnknownTask").respond(200, task_unknown_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingWithOneUnknownTask",
                null,
                { namespace: "namespace" }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            expect(success).toBeUndefined();
            expect(error).toBeUndefined();
            expect(notify).toEqual(task_unknown_response);
        });

    });

    describe("Testing poll on a get request", function () {

        it("should works with expected value", function () {

            var task_done_response = { blurp: "nope" };
            $httpBackend.whenGET("testingWithOneTask").respond(200, task_done_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingWithOneTask",
                null,
                {
                    namespace: "namespace",
                    successRule: { blurp: "nope" },
                    errorRule: { cake: "none" }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            expect(error).toBeUndefined();
            expect(notify).toBeUndefined();
            expect(success).toEqual(task_done_response);
        });

        it("should works with expected return function value", function () {

            var task_done_response = { blurp: "nope", taratata: { status: "oooooooops" } };
            $httpBackend.whenGET("testingWithOneTask").respond(200, task_done_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingWithOneTask",
                null,
                {
                    namespace: "namespace",
                    successRule: {
                        taratataStatus: function (elt) {
                            return elt.taratata.status === "oooooooops";
                        }
                    },
                    errorRule: { cake: "none" }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            expect(error).toBeUndefined();
            expect(notify).toBeUndefined();
            expect(success).toEqual(task_done_response);
        });

        it("should not works with error values", function () {

            var task_error_response = { cake: "none" };
            $httpBackend.whenGET("testingWithErrorTask").respond(200, task_error_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingWithErrorTask",
                null,
                {
                    namespace: "namespace",
                    successRule: { blurp: "nope" },
                    errorRule: { cake: "none" }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            // Add 3 more flush $timeout & $httpBackend due to "defaultRetryMaxAttemps" default is 3 retries
            $timeout.flush();
            $httpBackend.flush();

            $timeout.flush();
            $httpBackend.flush();

            $timeout.flush();
            $httpBackend.flush();


            expect(success).toBeUndefined();
            expect(notify).toBeUndefined();
            expect(error).toEqual(task_error_response);
        });

        it("should not works with errorRule as a function", function () {

            var task_error_response = { cake: "none", taratata: { status: "oooooooops" } };
            $httpBackend.whenGET("testingWithErrorTask").respond(200, task_error_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingWithErrorTask",
                null,
                {
                    namespace: "namespace",
                    successRule: { blurp: "nope" },
                    errorRule: {
                        taratataStatus: function (elt) {
                            return elt.taratata.status === "oooooooops";
                        }
                    }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            // Add 3 more flush $timeout & $httpBackend due to "defaultRetryMaxAttemps" default is 3 retries
            $timeout.flush();
            $httpBackend.flush();

            $timeout.flush();
            $httpBackend.flush();

            $timeout.flush();
            $httpBackend.flush();

            expect(success).toBeUndefined();
            expect(notify).toBeUndefined();
            expect(error).toEqual(task_error_response);
        });

        it("should notify with another values than expected", function () {

            var task_notify_response = { blurp: "none" };
            $httpBackend.whenGET("testingWithErrorTask").respond(200, task_notify_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingWithErrorTask",
                null,
                {
                    namespace: "namespace",
                    successRule: { blurp: "nope" },
                    errorRule: { cake: "none" }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            expect(success).toBeUndefined();
            expect(error).toBeUndefined();
            expect(notify).toEqual(task_notify_response);
        });

    });

    describe("Testing poll on a list request", function () {

        it("should works with expected value on each value", function () {

            var task_success_list_response = [
                {
                    name: "toto",
                    state: "okGood"
                },
                {
                    name: "tutu",
                    state: "okGood"
                },
                {
                    name: "tata",
                    state: "okGood"
                },
                {
                    name: "titi",
                    state: "okGood"
                },
                {
                    name: "tete",
                    state: "okGood"
                },
                {
                    name: "tyty",
                    state: "okGood"
                }
            ];
            $httpBackend.whenGET("testingFullListSuccess").respond(200, task_success_list_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingFullListSuccess",
                null,
                {
                    namespace: "namespace",
                    successRule: { state: "okGood" },
                    errorRule: { state: "noneBad" }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            expect(notify).toBeUndefined();
            expect(error).toBeUndefined();
            expect(success).toEqual(task_success_list_response);
        });

        it("should not works with one different value than expected and all other excepted", function () {

            var task_error_list_response = [
                {
                    name: "toto",
                    state: "okGood"
                },
                {
                    name: "tutu",
                    state: "okGood"
                },
                {
                    name: "tata",
                    state: "okGood"
                },
                {
                    name: "titi",
                    state: "okGood"
                },
                {
                    name: "tete",
                    state: "okGood"
                },
                {
                    name: "tbtb",
                    state: "noneBad"
                }
            ];
            $httpBackend.whenGET("testingListWithOneError").respond(200, task_error_list_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingListWithOneError",
                null,
                {
                    namespace: "namespace",
                    successRule: { state: "okGood" },
                    errorRule: { state: "noneBad" }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            // Add 3 more flush $timeout & $httpBackend due to "defaultRetryMaxAttemps" default is 3 retries
            $timeout.flush();
            $httpBackend.flush();

            $timeout.flush();
            $httpBackend.flush();

            $timeout.flush();
            $httpBackend.flush();


            expect(notify).toBeUndefined();
            expect(success).toBeUndefined();
            expect(error).toEqual(task_error_list_response);

        });

        it("should notify with one different value than expected and not all others done", function () {

            var task_notify_list_response = [
                {
                    name: "toto",
                    state: "okGood"
                },
                {
                    name: "tutu",
                    state: "pending"
                },
                {
                    name: "tata",
                    state: "okGood"
                },
                {
                    name: "titi",
                    state: "okGood"
                },
                {
                    name: "tete",
                    state: "okGood"
                },
                {
                    name: "tyty",
                    state: "okGood"
                }
            ];
            $httpBackend.whenGET("testingPendingList").respond(200, task_notify_list_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingPendingList",
                null,
                {
                    namespace: "namespace",
                    successRule: { state: "okGood" },
                    errorRule: { state: "noneBad" }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            expect(error).toBeUndefined();
            expect(success).toBeUndefined();
            expect(notify).toEqual(task_notify_list_response);

        });

        it("should notify with not all elements done", function () {

            var task_notify_list_response = [
                {
                    name: "toto",
                    state: "okGood"
                },
                {
                    name: "tutu",
                    state: "pending"
                },
                {
                    name: "tata",
                    state: "okGood"
                },
                {
                    name: "titi",
                    state: "okGood"
                },
                {
                    name: "tete",
                    state: "okGood"
                },
                {
                    name: "tbtb",
                    state: "noneBad"
                }
            ];
            $httpBackend.whenGET("testingPendingList").respond(200, task_notify_list_response);

            var success;
            var error;
            var notify;
            $poller.poll(
                "testingPendingList",
                null,
                {
                    namespace: "namespace",
                    successRule: { state: "okGood" },
                    errorRule: { state: "noneBad" }
                }
            ).then(function (result) {
                success = result;
            }, function (result) {
                error = result;
            }, function (result) {
                notify = result;
            });

            $timeout.flush();
            $httpBackend.flush();

            expect(error).toBeUndefined();
            expect(success).toBeUndefined();
            expect(notify).toEqual(task_notify_list_response);

        });
    });

});
