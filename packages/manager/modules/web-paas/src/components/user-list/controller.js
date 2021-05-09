export default class WebPaasUserListCtrl {
  disableInvite() {
    return (
      this.hideInvite ||
      this.userList?.length === this.project?.getTotalLicences()
    );
  }
}
