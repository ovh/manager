angular.module("ovh-angular-otrs")
    .service("OtrsPopupInterventionService", function ($q, OvhApiDedicatedServer) {
        "use strict";

        var self = this;

        self.sendDiskReplacement = function (serviceName, disk) {
            var diskToSend = _.assign({}, disk);

            if (!diskToSend.comment) {
                diskToSend.comment = "No message";
            }

            return OvhApiDedicatedServer.v6().askHardDiskDriveReplacement({
                serverName: serviceName
            }, {
                comment: diskToSend.comment,
                disks: diskToSend.disks,
                inverse: diskToSend.inverse
            }).$promise;
        };

        self.getServerInterventionInfo = function (serviceName) {
            return $q.all({
                serverInfo: getServerInfo(serviceName),
                hardwareInfo: getHardwareInfo(serviceName)
            }).then(function (results) {
                return {
                    canHotSwap: canHotSwap(results.serverInfo, results.hardwareInfo),
                    hasMegaRaid: hasMegaRaidCard(results.hardwareInfo),
                    slotInfo: slotInfo(results.serverInfo, results.hardwareInfo)
                };
            });
        };

        function getServerInfo (serviceName) {
            return OvhApiDedicatedServer.v6().get({
                serverName: serviceName
            }).$promise;
        }

        function getHardwareInfo (serviceName) {
            return OvhApiDedicatedServer.v6().getHardware({
                serverName: serviceName
            }).$promise;
        }

        function canHotSwap (serverInfo, hardwareInfo) {
            return serverInfo.commercialRange.toUpperCase() === "HG" && _.includes(["2U", "4U"], hardwareInfo.formFactor.toUpperCase());
        }

        function hasMegaRaidCard (hardwareInfo) {
            return _.some(hardwareInfo.diskGroups, { raidController: "MegaRaid" });
        }

        function slotInfo (serverInfo, hardwareInfo) {
            var canUseSlotId = serverInfo.commercialRange.toUpperCase() === "HG";
            var slotsCount = hardwareInfo.formFactor && hardwareInfo.formFactor.toUpperCase() === "4U" ? 24 : 12;

            return {
                canUseSlotId: canUseSlotId,
                slotsCount: slotsCount
            };
        }
    });
