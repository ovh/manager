export default class accountIdentitiesController {
  onRemoveAccountIdentity(urn) {
    this.onRemoveIdentity({ urn });
  }

  onAddAccountIdentity(urn) {
    this.onAddIdentities({ urns: [urn] });
  }

  openDelegationAccountModal() {
    this.delegationAccountModalOpened = true;
  }

  closeDelegationAccountModal() {
    this.delegationAccountModalOpened = false;
  }
}
