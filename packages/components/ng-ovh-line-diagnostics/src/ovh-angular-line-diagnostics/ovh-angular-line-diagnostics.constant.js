angular.module("ovh-angular-line-diagnostics").constant("DIAGNOSTICS_CONSTANTS", {
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
                "severalInternetConnections"
            ]
        },
        SOLUTION_PROPOSAL: {
            LABEL: "solutionProposalStep"
        }
    },
    ROBOT_ACTION: {
        SELT_TEST: "seltTest"
    },
    FAULT_TYPES: {
        UNKNOWN: "unknown",
        NO_SYNCHRONIZATION: "noSync",
        ALIGNMENT: "alignment",
        SYNC_LOSS_OR_LOW_BANDWIDTH: "syncLossOrLowBandwidth"
    },
    STATUS: {
        END: [
            "cancelled",
            "connectionProblem",
            "haveToConnectModemOnTheRightPlug",
            "interventionRequested",
            "resolvedAfterTests",
            "validationRefused"
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
    QUESTIONS_ENUM: {
        BANDWIDTH_TEST_UNIT: [
            "Kbps",
            "Mbps"
        ],
        PROBLEM_TYPE: [
            "lowBandwidth",
            "syncLoss"
        ]
    }
});
