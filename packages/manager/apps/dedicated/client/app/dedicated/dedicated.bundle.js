import './dedicated.routes';
import './housing/backup/access/add/dedicated-housing-backup-access-add.controller';
import './housing/backup/access/delete/dedicated-housing-backup-access-delete.controller';
import './housing/backup/dedicated-housing-backup.controller';
import './housing/backup/disable/dedicated-housing-backup-disable.controller';
import './housing/backup/enable/dedicated-housing-backup-enable.controller';
import './housing/backup/password/reset/dedicated-housing-backup-password-reset.controller';
import './housing/dedicated-housing-tabs.controller';
import './housing/dedicated-housing.controller';
import './housing/dedicated-housing.routes';
import './housing/dedicated-housing.service';
import './housing/reboot/dedicated-housing-reboot.controller';
import './housing/task/dedicated-housing-task.controller';
import './nas/details/dashboard/nas-details-dashboard.controller';
import './nas/details/nas-details.controller';
import './nas/details/nas-details.routes';
import './nas/details/partition/access/add/nas-partition-access-add.controller';
import './nas/details/partition/access/delete/nas-partition-access-delete.controller';
import './nas/details/partition/access/nas-partition-access.controller';
import './nas/details/partition/access/nas-partition-access.routes';
import './nas/details/partition/add/nas-partition-add.controller';
import './nas/details/partition/delete/nas-partition-delete.controller';
import './nas/details/partition/nas-details-partition.controller';
import './nas/details/partition/nas-details-partition.routes';
import './nas/details/partition/snapshot/nas-partition-snapshot.controller';
import './nas/details/partition/snapshot/nas-partition-snapshot.routes';
import './nas/details/partition/update/nas-partition-update.controller';
import './nas/nas.controller';
import './nas/nas.routes';
import './nas/nas.service';
import './nas/order/nas-order.controller';
import './nas/order/nas-order.routes';
import './nas/order/validation/nas-order-validation.controller';
import './server/bandwidth-legacy/order-private/dedicated-server-bandwidth-vrack-order.controller';
import './server/bandwidth-legacy/order-private/order-private.routing';
import './server/bandwidth-legacy/order-public/dedicated-server-bandwidth-order.controller';
import './server/bandwidth-legacy/order-public/order-public.routing';
import './server/bandwidth/dashboard/dashboard.component';
import './server/bandwidth/dashboard/dashboard.controller';
import './server/bandwidth/private-cancel/private-cancel.component';
import './server/bandwidth/private-cancel/private-cancel.controller';
import './server/bandwidth/private-cancel/private-cancel.routing';
import './server/bandwidth/private-order/private-order.component';
import './server/bandwidth/private-order/private-order.controller';
import './server/bandwidth/private-order/private-order.routing';
import './server/bandwidth/public-cancel/public-cancel.component';
import './server/bandwidth/public-cancel/public-cancel.controller';
import './server/bandwidth/public-cancel/public-cancel.routing';
import './server/bandwidth/public-order/public-order.component';
import './server/bandwidth/public-order/public-order.controller';
import './server/bandwidth/public-order/public-order.routing';
import './server/consumption/ServerConsumptionController';
import './server/dashboard/dedicated-server-dashboard.routes';
import './server/server.bandwidth-vrack-order.service';
import './server/server.feature-availability';
import './server/server.constants';
import './server/server.controller';
import './server/server.routing';
import './server/server.service';
import './server/display-name/display-name.controller';
import './server/display-name/display-name.routes';
import './server/dns/add/dedicated-server-dns-add.controller';
import './server/dns/dedicated-server-dns.controller';
import './server/dns/dedicated-server-dns.routes';
import './server/dns/delete/dedicated-server-dns-delete.controller';
import './server/firewall/dedicated-server-firewall.controller';
import './server/firewall/dedicated-server-firewall.routes';
import './server/firewall/dedicated-server-firewall.service';
import './server/firewall/disable/dedicated-server-firewall-disable.controller';
import './server/firewall/enable/dedicated-server-firewall-enable.controller';
import './server/firewall/order/dedicated-server-firewall-order.controller';
import './server/firewall/rule/dedicated-server-firewall-rule.controller';
import './server/ftp-backup/access/add/dedicated-server-ftp-backup-access-add.controller';
import './server/ftp-backup/access/delete/dedicated-server-ftp-backup-access-delete.controller';
import './server/ftp-backup/access/update/dedicated-server-ftp-backup-access-update.controller';
import './server/ftp-backup/activate/dedicated-server-ftp-backup-activate.controller';
import './server/ftp-backup/dedicated-server-ftp-backup.constants';
import './server/ftp-backup/dedicated-server-ftp-backup.controller';
import './server/ftp-backup/dedicated-server-ftp-backup.routes';
import './server/ftp-backup/delete/dedicated-server-ftp-backup-delete.controller';
import './server/ftp-backup/order/dedicated-server-ftp-backup-order.controller';
import './server/ftp-backup/password/request/dedicated-server-ftp-backup-password-request.controller';
import './server/installation/choice/dedicated-server-installation-choice.controller';
import './server/installation/dedicated-server-installation.controller';
import './server/installation/gabarit/dedicated-server-installation-gabarit.controller';
import './server/installation/ovh/dedicated-server-installation-ovh.controller';
import './server/installation/progress/dedicated-server-installation-progress.controller';
import './server/interfaces/attach/interfaces-attach.component';
import './server/interfaces/attach/interfaces-attach.controller';
import './server/interfaces/attach/interfaces-attach.routing';
import './server/interfaces/detach/interfaces-detach.component';
import './server/interfaces/detach/interfaces-detach.controller';
import './server/interfaces/detach/interfaces-detach.routing';
import './server/interfaces/interface.class';
import './server/interfaces/interfaces.component';
import './server/interfaces/interfaces.constants';
import './server/interfaces/interfaces.controller';
import './server/interfaces/interfaces.routing';
import './server/interfaces/interfaces.service';
import './server/interfaces/ola-activation/ola-activation.component';
import './server/interfaces/ola-activation/ola-activation.controller';
import './server/interfaces/ola-activation/ola-activation.routing';
import './server/interfaces/ola-configuration/ola-configuration.component';
import './server/interfaces/ola-configuration/ola-configuration.constants';
import './server/interfaces/ola-configuration/ola-configuration.controller';
import './server/interfaces/ola-configuration/ola-configuration.routing';
import './server/interfaces/ola-step-checker/ola-step-checker.component';
import './server/interfaces/ola-step-checker/ola-step-checker.controller';
import './server/interfaces/ola-terminate/ola-terminate.component';
import './server/interfaces/ola-terminate/ola-terminate.controller';
import './server/interfaces/ola-terminate/ola-terminate.routing';
import './server/interfaces/ola.class';
import './server/interfaces/rename/interfaces-rename.component';
import './server/interfaces/rename/interfaces-rename.controller';
import './server/interfaces/rename/interfaces-rename.routing';
import './server/intervention/dedicated-server-intervention.controller';
import './server/intervention/dedicated-server-intervention.routes';
import './server/ip/dedicated-server-ip-mitigation-statistics.controller';
import './server/ip/dedicated-server-ip-mitigation.controller';
import './server/ip/dedicated-server-ip.controller';
import './server/ipmi/dedicated-server-ipmi.controller';
import './server/ipmi/dedicated-server-ipmi.routes';
import './server/ipmi/restart/dedicated-server-ipmi-restart.controller';
import './server/ipmi/restart/session/dedicated-server-ipmi-restart-session.controller';
import './server/kvm/order/dedicated-server-kvm-order.controller';
import './server/monitoring/add/dedicated-server-monitoring-add.controller';
import './server/monitoring/dedicated-server-monitoring-update.controller';
import './server/monitoring/dedicated-server-monitoring.controller';
import './server/monitoring/delete/dedicated-server-monitoring-delete.controller';
import './server/monitoring/update/dedicated-server-monitoring-update.controller';
import './server/monitoring/update/dedicated-server-monitoring-update.routes';
import './server/netboot/dedicated-server-netboot.controller';
import './server/ovh-tasks/dedicated-server-ovh-tasks.component';
import './server/ovh-tasks/dedicated-server-ovh-tasks.routes';
import './server/ovh-tasks/dedicated-server-ovh-tasks.service';
import './server/pro-use/order/dedicated-server-pro-use-order.controller';
import './server/reboot/dedicated-server-reboot.controller';
import './server/reboot/dedicated-server-reboot.routes';
import './server/rendezvous/dedicated-server-rendezvous.controller';
import './server/rendezvous/dedicated-server-rendezvous.routes';
import './server/reverse-dns/delete/reverse-dns-delete.controller';
import './server/reverse-dns/delete/reverse-dns-delete.routes';
import './server/reverse-dns/update/reverse-dns-update.controller';
import './server/reverse-dns/update/reverse-dns-update.routes';
import './server/servers/servers.component';
import './server/servers/servers.controller';
import './server/servers/servers.routing';
import './server/statistics/dedicated-server-statistics.controller';
import './server/statistics/rtm/dedicated-server-statistics-rtm.controller';
import './server/statistics/rtm/disk/dedicated-server-statistics-rtm-disk.controller';
import './server/statistics/rtm/load-avg/dedicated-server-statistics-rtm-load-avg.controller';
import './server/statistics/rtm/ServerStatsRtmGeneralController';
import './server/statistics/rtm/ServerStatsRtmInfosController';
import './server/task/dedicated-server-task.controller';
import './server/task/dedicated-server-task.routes';
import './server/terminate/dedicated-server-terminate.controller';
import './server/traffic/cancel/dedicated-server-traffic-cancel.controller';
import './server/traffic/dedicated-server-traffic.service';
import './server/traffic/order/dedicated-server-traffic-order.controller';
import './server/traffic/order/dedicated-server-traffic-order.service';
import './server/usb-storage/dedicated-server-usb-storage.controller';
import './server/usb-storage/dedicated-server-usb-storage.routes';
import './server/usb-storage/order/dedicated-server-usb-storage-order.controller';
