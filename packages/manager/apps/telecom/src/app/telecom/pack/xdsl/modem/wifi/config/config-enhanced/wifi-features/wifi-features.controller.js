export default /* @ngInject */ function XdslModemWifiFeaturesCtrl() {
  const self = this;

  self.changeMeshValue = function changeMeshValue(updatedValue) {
    self.onModemPropertyChange({
      propertyName: 'mesh',
      updatedValue,
    });
  };

  self.changeOneSSIDValue = function changeOneSSIDValue(updatedValue) {
    self.onModemPropertyChange({
      propertyName: 'onessid',
      updatedValue,
    });
  };
}
