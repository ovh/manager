(function () {
  angular.module('managerApp').run(($translate, asyncLoader) => {
    asyncLoader.addTranslations(
      import(`./translations/Messages_${$translate.use()}.xml`)
        .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.xml`))
        .then(x => x.default),
    );
    $translate.refresh();
  });
  angular.module('managerApp').component('voipTimeConditionSlot', {
    templateUrl: 'components/telecom/telephony/timeCondition/slot/telephony-time-condition-slot.html',
    bindings: {
      slot: '=timeConditionSlot',
      enableEdition: '<?slotEnableEdition',
      hasPopover: '<?',
      isScheduler: '<?',
    },
    controller: 'voipTimeConditionSlotCtrl',
  });
}());
