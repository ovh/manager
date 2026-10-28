import Backup from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.class';
import {
  BACKUP_STATE_DISABLED,
  BACKUP_STATE_ENABLED,
  BACKUP_STATE_ENABLING,
  BACKUP_STATE_REMOVING,
} from '../../../../app/components/dedicated-cloud/datacenter/backup/backup.constants';
import {
  CAN_ORDER_BACKUP_FEATURE,
  MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE,
  MANAGED_BACKUP_FOR_VMWARE_CONTAINER_SNC_FEATURE,
  getBackupOrderAvailability,
  isLegacyBackupOrderBlockedByManagedBackupForVmware,
  isManagedBackupForVmwareOpen,
} from '../../../../app/dedicatedCloud/datacenter/backup/backup-order-availability';

const featureFlippingReturning = (availableFeatures) => ({
  checkFeatureAvailability: jest.fn(() =>
    Promise.resolve({
      isFeatureAvailable: (feature) => availableFeatures.includes(feature),
    }),
  ),
});

describe('legacy backup order availability (BKP-1758)', () => {
  describe('isManagedBackupForVmwareOpen', () => {
    it.each`
      isTrusted | container | containerSnc | expected
      ${false}  | ${false}  | ${false}     | ${false}
      ${false}  | ${false}  | ${true}      | ${false}
      ${false}  | ${true}   | ${false}     | ${true}
      ${false}  | ${true}   | ${true}      | ${true}
      ${true}   | ${false}  | ${false}     | ${false}
      ${true}   | ${false}  | ${true}      | ${false}
      ${true}   | ${true}   | ${false}     | ${false}
      ${true}   | ${true}   | ${true}      | ${true}
    `(
      'is $expected for a trusted=$isTrusted account with container=$container and container-snc=$containerSnc',
      ({ isTrusted, container, containerSnc, expected }) => {
        expect(
          isManagedBackupForVmwareOpen({
            isTrusted,
            isContainerAvailable: container,
            isContainerSncAvailable: containerSnc,
          }),
        ).toBe(expected);
      },
    );
  });

  describe('getBackupOrderAvailability', () => {
    it('reads the three keys in a single request', async () => {
      const ovhFeatureFlipping = featureFlippingReturning([]);

      await getBackupOrderAvailability(ovhFeatureFlipping, false);

      expect(ovhFeatureFlipping.checkFeatureAvailability).toHaveBeenCalledTimes(
        1,
      );
      expect(ovhFeatureFlipping.checkFeatureAvailability).toHaveBeenCalledWith([
        CAN_ORDER_BACKUP_FEATURE,
        MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE,
        MANAGED_BACKUP_FOR_VMWARE_CONTAINER_SNC_FEATURE,
      ]);
    });

    it.each`
      isTrusted | features                                                                                                                    | canOrderBackup | mbvOpen
      ${false}  | ${[CAN_ORDER_BACKUP_FEATURE]}                                                                                               | ${true}        | ${false}
      ${false}  | ${[]}                                                                                                                       | ${false}       | ${false}
      ${false}  | ${[CAN_ORDER_BACKUP_FEATURE, MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE]}                                                  | ${true}        | ${true}
      ${false}  | ${[MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE]}                                                                            | ${false}       | ${true}
      ${true}   | ${[CAN_ORDER_BACKUP_FEATURE, MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE]}                                                  | ${true}        | ${false}
      ${true}   | ${[CAN_ORDER_BACKUP_FEATURE, MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE, MANAGED_BACKUP_FOR_VMWARE_CONTAINER_SNC_FEATURE]} | ${true}        | ${true}
    `(
      'gives canOrderBackup=$canOrderBackup and MBV open=$mbvOpen for a trusted=$isTrusted account with $features',
      async ({ isTrusted, features, canOrderBackup, mbvOpen }) => {
        await expect(
          getBackupOrderAvailability(
            featureFlippingReturning(features),
            isTrusted,
          ),
        ).resolves.toEqual({
          canOrderBackup,
          isManagedBackupForVmwareOpen: mbvOpen,
        });
      },
    );

    it('keeps the current behaviour when the keys cannot be read: MBV is considered closed, canOrderBackup is read alone', async () => {
      const ovhFeatureFlipping = {
        checkFeatureAvailability: jest.fn((features) =>
          Array.isArray(features)
            ? Promise.reject(new Error('feature availability unreachable'))
            : Promise.resolve({
                isFeatureAvailable: (feature) =>
                  feature === CAN_ORDER_BACKUP_FEATURE,
              }),
        ),
      };

      await expect(
        getBackupOrderAvailability(ovhFeatureFlipping, false),
      ).resolves.toEqual({
        canOrderBackup: true,
        isManagedBackupForVmwareOpen: false,
      });
      expect(
        ovhFeatureFlipping.checkFeatureAvailability,
      ).toHaveBeenLastCalledWith(CAN_ORDER_BACKUP_FEATURE);
    });
  });

  describe('isLegacyBackupOrderBlockedByManagedBackupForVmware', () => {
    const backupIn = (state, backupOffer = 'classic') =>
      new Backup({ state, backupOffer });

    it.each`
      state                    | canOrderBackup | mbvOpen  | expected
      ${BACKUP_STATE_DISABLED} | ${true}        | ${true}  | ${true}
      ${BACKUP_STATE_DISABLED} | ${false}       | ${true}  | ${true}
      ${BACKUP_STATE_DISABLED} | ${true}        | ${false} | ${false}
      ${BACKUP_STATE_DISABLED} | ${false}       | ${false} | ${false}
      ${BACKUP_STATE_ENABLED}  | ${true}        | ${true}  | ${false}
      ${BACKUP_STATE_ENABLING} | ${true}        | ${true}  | ${false}
      ${BACKUP_STATE_REMOVING} | ${true}        | ${true}  | ${false}
      ${BACKUP_STATE_ENABLED}  | ${false}       | ${true}  | ${false}
    `(
      'is $expected for a $state backup when canOrderBackup=$canOrderBackup and MBV open=$mbvOpen',
      ({ state, canOrderBackup, mbvOpen, expected }) => {
        expect(
          isLegacyBackupOrderBlockedByManagedBackupForVmware(backupIn(state), {
            canOrderBackup,
            isManagedBackupForVmwareOpen: mbvOpen,
          }),
        ).toBe(expected);
      },
    );

    it('never blocks an existing client on the legacy offer (enabled), who can still move to a new offer', () => {
      expect(
        isLegacyBackupOrderBlockedByManagedBackupForVmware(
          backupIn(BACKUP_STATE_ENABLED, 'legacy'),
          { canOrderBackup: true, isManagedBackupForVmwareOpen: true },
        ),
      ).toBe(false);
    });
  });
});
