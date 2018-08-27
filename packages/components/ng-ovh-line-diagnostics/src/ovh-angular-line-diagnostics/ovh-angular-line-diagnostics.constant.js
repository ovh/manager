angular.module("ovh-angular-line-diagnostics").constant("DIAGNOSTICS_CONSTANTS", {
    PROGRESS_BAR: {
        INTERVAL: 1000,
        STEP: 20,
        LIMIT: 90
    },
    STEPS: {
        DETECTION: {
            LABEL: "detectionStep",
            ACTIONS: [
                "unplugModem"
            ],
            QUESTIONS: [
                "modemIsSynchronized"
            ]
        },
        INVESTIGATION: {
            LABEL: "investigationStep",
            ACTIONS: [
                "modemIsSynchronized",
                "modemStillSynchronized"
            ],
            ACTIONS_AS_QUESTIONS: [
                "checkFilter",
                "checkConnectionCable"
            ],
            QUESTIONS: [
                "modemIsSynchronized",
                "modemStillSynchronized",
                "severalInternetConnections",
                "hasModemKeptSynchronization"
            ],
            SPECIFIC_QUESTIONS: [
                "problemType",
                "downloadBandwidthTest",
                "uploadBandwidthTest",
                "bandwidthTestUnit"
            ]
        },
        SOLUTION_PROPOSAL: {
            LABEL: "solutionProposalStep",
            APPOINTMENT_QUESTIONS_FORM: [
                "idAppointment",
                "individualSite",
                "secureSite",
                "siteClosedDays",
                "siteOpening"
            ],
            TIME_PERIOD_QUESTIONS: [
                "startMorningHours",
                "endMorningHours",
                "startAfternoonHours",
                "endAfternoonHours"
            ]
        }
    },
    ROBOT_ACTION: {
        LONG_TIME_ACTIONS: [
            "seltTest",
            "installationCheck"
        ],
        REQUEST_MONITORING: "requestMonitoring"
    },
    FAULT_TYPES: {
        UNKNOWN: "unknown",
        NO_SYNCHRONIZATION: "noSync",
        ALIGNMENT: "alignment",
        SYNC_LOSS_OR_LOW_BANDWIDTH: "syncLossOrLowBandwidth"
    },
    ERRORS: {
        MONITORING_EXISTS: "monitoringTodoAlreadyExists"
    },
    STATUS: {
        END: [
            "cancelled",
            "connectionProblem",
            "haveToConnectModemOnTheRightPlug",
            "interventionRequested",
            "resolvedAfterTests",
            "validationRefused",
            "waitingValidation",
            "noBandwidthFault"
        ],
        PAUSE: [
            "init",
            "sleeping",
            "waitingHuman"
        ],
        PROBLEM: "problem",
        SPECIAL: [],
        WAITING_ROBOT: "waitingRobot"
    },
    BANDWIDTH_TEST_SITE: "http://proof.ovh.net",
    QUESTIONS_ENUM: {
        BANDWIDTH_TEST_UNIT: [
            "Kbps",
            "Mbps"
        ],
        PROBLEM_TYPE: {
            LOW_BANDWIDTH: "lowBandwidth",
            SYNC_LOSS: "syncLoss"
        }
    }
});
