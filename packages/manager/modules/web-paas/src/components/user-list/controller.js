export default class WebPaasUserListCtrl {
  isInviteDisabled() {
    return (
      !this.isAdmin() ||
      this.hideInvite ||
      this.userList?.length === this.project?.getTotalLicences() ||
      this.project?.isStartOffer()
    );
  }

  isAdmin() {
    return this.project.getAccountName() === this.user.nichandle;
  }
}
