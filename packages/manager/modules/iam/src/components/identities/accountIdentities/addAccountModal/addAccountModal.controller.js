export default class addAccountModalController {
  onEnterInputAddAccount(event) {
    if (event.keyCode === 13) {
      // prevent 'enter' form submitting policy form
      event.preventDefault();
      this.onAddAccount(this.accountInput);
    }
  }
}
