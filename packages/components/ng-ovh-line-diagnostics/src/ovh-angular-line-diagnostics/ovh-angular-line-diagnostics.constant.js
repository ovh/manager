angular.module("ovh-angular-line-diagnostics").constant("DIAGNOSTICS_CONSTANTS", {
    STEPS: {
        INCIDENT_DETECTION: {
            LABEL: "incidentDetectionStep",
            ACTIONS: [
                "unplugModem"
            ],
            QUESTIONS: [
                "modemIsSynchronized"
            ]
        },
        INVESTIGATION: {
            LABEL: "investigationStep",
            ACTIONS: []
        },
        SOLUTION_PROPOSAL: {
            LABEL: "solutionProposalStep",
            ACTIONS: []
        }
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
    }
});
