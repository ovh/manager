angular.module('managerApp')
  .service('NotificationElement', () => {
    const NotificationElement = function (element, editMode) {
      this.type = element.type;
      this.frequency = element.frequency;
      this.email = this.type === 'mail' ? element.email : null;
      this.phone = this.type === 'sms' ? element.phone : null;
      this.smsAccount = element.smsAccount;
      this.xdslService = element.xdslService;
      this.editMode = editMode === true;
      this.id = element.id;
    };

    NotificationElement.prototype = {
      isValidSms() {
        return (this.type === 'sms') && this.phone && this.smsAccount;
      },
      isValidEmail() {
        return (this.type === 'mail') && this.email;
      },
      isValid() {
        return this.frequency && this.type && (this.isValidEmail() || this.isValidSms());
      },
      getCreationData() {
        const data = {
          frequency: this.frequency,
          type: this.type,
        };
        switch (this.type) {
          case 'sms':
            data.phone = this.phone;
            data.smsAccount = this.smsAccount;
            break;
          case 'mail':
            data.email = this.email;
            break;
          default:
        }
        return data;
      },
    };

    return NotificationElement;
  });
