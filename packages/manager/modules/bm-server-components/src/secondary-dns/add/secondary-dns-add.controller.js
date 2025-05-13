import ipaddr from 'ipaddr.js';
import head from 'lodash/head';

export default class AddSecondaryDnsCtrl {
  /* @ngInject */
  constructor($translate, IpRange, Server) {
    this.$translate = $translate;
    this.IpRange = IpRange;
    this.Server = Server;
  }

  $onInit() {
    this.entry = {
      domain: '',
      ip: '',
    };
    this.ipdata = [];
    this.loading = false;
  }

  loadIpList() {
    this.loading = true;
    return this.Server.listIps(this.server.name)
      .then((_data) => {
        const data = _data
          .filter((ip) => ipaddr.parseCIDR(ip)[0].kind() === 'ipv4')
          .map((ip) => this.IpRange.getRangeForIpv4Block(ip))
          .flat();

        if (data.length === 1) {
          this.entry.ip = head(data);
        } else if (data.length === 0) {
          // use server IP as a deafult for servers on which /ip api doesn"t return data
          // (old kimsufi)
          this.entry.ip = this.server.ip;

          this.ipdata.push(this.server.ip);
        }
        this.ipdata = [...this.ipdata, ...data].sort();
      })
      .catch((err) => {
        return this.goBack(
          `${this.$translate.instant('server_ips_cannotfetch')} ${
            err?.message
          }`,
          'danger',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadToken() {
    this.loadTokenLoading = true;
    return this.Server.getDomainZoneInformation(
      this.server.name,
      this.entry.domain,
    )
      .then((result) => {
        this.loadTokenLoading = false;
        this.token = result;
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('server_secondarydns_add_step2_error')} ${
            err?.message
          }`,
          'danger',
        );
      })
      .finally(() => {
        this.loadTokenLoading = false;
      });
  }

  addSecondaryDns() {
    this.loading = true;
    return this.Server.addSecondaryDns(
      this.server.name,
      this.entry.domain,
      this.entry.ip,
    )
      .then(() => {
        this.goBack(
          this.$translate.instant('server_secondarydns_add_success', {
            t0: this.entry.domain,
          }),
          'success',
          true,
        );
      })
      .catch((err) => {
        this.goBack(
          `${this.$translate.instant('server_secondarydns_add_fail')} ${
            err?.message
          }`,
          'danger',
        );
      });
  }
}
