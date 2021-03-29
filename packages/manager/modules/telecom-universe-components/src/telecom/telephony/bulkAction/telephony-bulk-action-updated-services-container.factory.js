export default function () {
  const self = this;

  self.updatedServices = [];

  function clearUpdatedServices() {
    self.updatedServices = [];
  }

  function storeUpdatedServices(data) {
    self.updatedServices = self.updatedServices.concat(data);
  }

  function getUpdatedServices() {
    return self.updatedServices;
  }

  return {
    clearUpdatedServices,
    getUpdatedServices,
    storeUpdatedServices,
  };
}
