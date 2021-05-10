export default class WebPaasUserListCtrl {
  isInviteDisabled() {
    return (
      this.hideInvite ||
      this.userList?.length === this.project?.getTotalLicences()
    );
  }
}
