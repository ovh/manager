/**
 *  To delete when manager V4 will be fully migrated to manager V6
 */
angular
  .module('managerApp')
  .constant('SUPPORT_URL', 'https://help.ovhcloud.com/csm?id=csm_get_help')
  .constant('REDIRECT_V4_HASH', {
    group: {
      // ADMIN
      group_billing_options:
        '#rdm/34541/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_billing_options',
      group_lines_group_change:
        '#rdm/40080/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_lines_group_change',
      group_new_billing_account:
        '#rdm/61095/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_new_billing_account',
      group_delete_billing_account:
        '#rdm/74680/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_delete_billing_account',

      // BILLING
      group_billing_deposit:
        '#rdm/17320/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_billing_deposit',
      group_billing_deposit_movement:
        '#rdm/17320/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_billing_deposit_movement',
      group_billing_credit_threshold:
        '#rdm/17320/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_billing_credit_threshold',
      group_billing_bill:
        '#rdm/47144/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_billing_bill',
      group_call_list_summary:
        '#rdm/68384/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_call_list_summary',
      group_group_called_fees:
        '#rdm/23657/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_group_called_fees',
      group_called_fees_history:
        '#rdm/38448/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_called_fees_history',
      group_banking_management:
        '#rdm/49176/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_banking_management',
      group_delayed_account_transfert:
        '#rdm/62872/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_delayed_account_transfert',

      // CONTACT BOOK
      group_manage_phonebook:
        '#rdm/88730/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_manage_phonebook',

      // SHORT NUMBERS
      group_abreviated_numbers:
        '#rdm/02777/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_abreviated_numbers',

      // CONTACT MANAGEMENT
      group_nics_management:
        '#rdm/72993/grp/{billingAccount}/num/false/menu/group/grp/all/page/group_nics_management',
    },
    line: {
      // MANAGEMENT
      line_details_offer:
        '#rdm/43543/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_details_offer',
      line_sip_password:
        '#rdm/92901/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_sip_password',
      line_sip_domain_management:
        '#rdm/10557/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_sip_domain_management',
      line_sip_ips_restrictions:
        '#rdm/35893/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_sip_ips_restrictions',
      line_language:
        '#rdm/51021/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_language',
      line_resume_offer:
        '#rdm/70757/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_resume_offer',
      line_bannMaker:
        '#rdm/88061/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_bannMaker',
      line_to_number:
        '#rdm/01798/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_to_number',
      line_delete_line_new:
        '#rdm/17253/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_delete_line_new',

      // CONSUMPTION
      line_consumption_incoming_calls:
        '#rdm/85255/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_consumption_incoming_calls',
      line_consumption_outgoing_calls:
        '#rdm/90841/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_consumption_outgoing_calls',

      // CALLS
      line_manage_filtering_lists_new:
        '#rdm/38303/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_manage_filtering_lists_new',
      line_locking:
        '#rdm/38303/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_locking',
      line_forwardcall:
        '#rdm/38303/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_forwardcall',
      line_identificationRestriction:
        '#rdm/20302/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_identificationRestriction',
      line_simultaneouslines:
        '#rdm/51815/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_simultaneouslines',
      line_manage_slots:
        '#rdm/47030/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_manage_slots',
      line_calendar:
        '#rdm/76304/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_calendar',
      line_callWaiting:
        '#rdm/30447/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_callWaiting',
      line_abreviated_numbers:
        '#rdm/80599/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_abreviated_numbers',
      line_click2call:
        '#rdm/14736/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_click2call',
      line_external_number_display:
        '#rdm/60130/menu/line/grp/{billingAccount}/num/{lineNumber}/page/line_external_displayed_number',

      // MUSIC
      line_music_new:
        '#rdm/66918/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_music_new',

      // ANSWER
      line_default_voicemail:
        '#rdm/74184/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_default_voicemail',
      line_voicemail_password:
        '#rdm/55119/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_voicemail_password',
      line_voicemail_options:
        '#rdm/09351/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_voicemail_options',
      line_voicemail_management:
        '#rdm/58639/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_voicemail_management',

      // PHONE
      line_details_phon_offer:
        '#rdm/93923/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_details_phon_offer',
      line_codecs_management:
        '#rdm/56650/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_codecs_management',
      line_interface:
        '#rdm/93923/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_details_phon_offer',
      line_plug_and_phone_custom_parameters_list:
        '#rdm/99043/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_plug_and_phone_custom_parameters_list',
      line_programmable_keys:
        '#rdm/56027/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_programmable_keys',
      line_phone_upgrade_firmware:
        '#rdm/16075/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_phone_upgrade_firmware',
      line_phone_reboot:
        '#rdm/01539/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_phone_reboot',
      line_manage_mgcp_ip_restriction:
        '#rdm/93923/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_details_phon_offer',
      line_phone_order_plug_and_phone:
        '#rdm/90830/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_phone_order_plug_and_phone',
      line_order_accessories:
        '#rdm/33259/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_order_accessories',

      // FAX
      line_fax_password:
        '#rdm/09578/menu/line/grp/all/num/{lineNumber}/page/line_fax_password',
      line_fax_options:
        '#rdm/24898/menu/line/grp/all/num/{lineNumber}/page/line_fax_options',
      line_fax_white_label_domains:
        '#rdm/34870/menu/line/grp/all/num/{lineNumber}/page/line_fax_white_label_domains',
      line_fax_filtering:
        '#rdm/46899/menu/line/grp/all/num/{lineNumber}/page/line_fax_filtering',
      line_fax_campaign_management:
        '#rdm/59031/menu/line/grp/all/num/{lineNumber}/page/line_fax_campaign_management',
      line_convert_to_ecofax_pro:
        '#rdm/69648/menu/line/grp/all/num/{lineNumber}/page/line_convert_to_ecofax_pro',

      // DIRECTORY MANAGEMENT
      line_manage_directory:
        '#rdm/53580/grp/{billingAccount}/num/{lineNumber}/menu/line/grp/all/page/line_manage_directory',

      line_voicemail_status:
        '#rdm/29185/menu/line/grp/{billingAccount}/num/{lineNumber}/page/line_voicemail_activate_desactivate',

      // ASSIST
      line_view_logs_new:
        '#rdm/95634/menu/line/grp/{billingAccount}/num/{lineNumber}/page/line_view_logs_new',
      line_phone_assistance:
        '#rdm/62433/menu/line/grp/{billingAccount}/num/{lineNumber}/page/line_phone_assistance',
      line_orders_following_up:
        '#rdm/93200/menu/line/grp/{billingAccount}/num/{lineNumber}/page/line_orders_following_up',
      line_switch_password:
        '#rdm/32168/menu/line/grp/{billingAccount}/num/{lineNumber}/page/line_switch_password',
      line_sav_rma_status:
        '#rdm/68161/menu/line/grp/{billingAccount}/num/{lineNumber}/page/line_sav_rma_status',
      line_contact_support_and_guides:
        '#rdm/14144/menu/line/grp/{billingAccount}/num/{lineNumber}/page/line_contact_support_and_guides',
    },
    alias: {
      // ORDER
      number_order_new:
        '#rdm/91270/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_order_new',

      // PORTABILITY
      number_portability_order:
        '#rdm/52943/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_portability_order',
      number_portability_status:
        '#rdm/30416/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_portability_status',

      // ADMINISTRATION
      number_to_line:
        '#rdm/82831/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_to_line',
      number_delete_line:
        '#rdm/27535/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_delete_line',

      // CONFIGURATION
      number_modification_new:
        '#rdm/78304/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_modification_new',

      // CONFIGURATION - REDIRECT
      number_alias_redirect_modification:
        '#rdm/37935/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_alias_redirect_modification',

      // CONFIGURATION - EASYHUNTING
      number_easy_hunting_beta:
        '#rdm/96257/page/number_cloudHunting_beta/grp/{billingAccount}/menu/number/num/{lineNumber}',
      number_easy_hunting_mode:
        '#rdm/23421/page/number_easyHunting_mode/grp/{billingAccount}/menu/number/num/{lineNumber}',
      number_easy_hunting_members:
        '#rdm/19520/page/number_easyHunting_members/grp/{billingAccount}/menu/number/num/{lineNumber}',
      number_easy_hunting_slots:
        '#rdm/13260/page/number_easyHunting_slots/grp/{billingAccount}/menu/number/num/{lineNumber}',
      number_easy_hunting_events:
        '#rdm/06172/page/number_hunting_events/grp/{billingAccount}/menu/number/num/{lineNumber}',
      number_easy_hunting_filtering:
        '#rdm/65508/page/number_easyHunting_filtering/grp/{billingAccount}/menu/number/num/{lineNumber}',
      number_easy_hunting_board:
        '#rdm/09996/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_cloudHunting_live',

      // CONFIGURATION - CLOUDHUNTING
      number_cloud_hunting_beta:
        '#rdm/16873/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_cloudHunting_beta',
      number_cloud_hunting_mode:
        '#rdm/43016/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_easyHunting_mode',
      number_cloud_hunting_members:
        '#rdm/77047/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_easyHunting_members',
      number_cloud_hunting_events:
        '#rdm/99406/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_hunting_events_cloud',
      number_cloud_hunting_configuration:
        '#rdm/11515/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_cloud_hunting_configuration',
      number_cloud_hunting_records:
        '#rdm/01590/page/number_cloudHunting_records/grp/{billingAccount}/menu/number/num/{lineNumber}',
      number_cloud_hunting_board:
        '#rdm/26821/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_newcloudHunting_live',

      // CONFIGURATION - CONFERENCE
      number_manage_conference:
        '#rdm/58463/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_manage_conference',

      // CONFIGURATION - EASYPABX
      number_easy_pabx_mode:
        '#rdm/25456/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_mode',
      number_easy_pabx_members:
        '#rdm/16376/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_members',
      number_easy_pabx_music:
        '#rdm/23823/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_fmHuntingCirpack_music',
      number_easy_pabx_slots:
        '#rdm/17963/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_slots',
      number_easy_pabx_events:
        '#rdm/84104/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_hunting_events',
      number_easy_pabx_filtering:
        '#rdm/22728/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_filtering',

      // CONFIGURATION - MINIPABX
      number_mini_pabx_mode:
        '#rdm/22924/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_mode',
      number_mini_pabx_members:
        '#rdm/38946/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_members',
      number_mini_pabx_music:
        '#rdm/63850/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_music',
      number_mini_pabx_slots:
        '#rdm/92802/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_slots',
      number_mini_pabx_events:
        '#rdm/17474/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_hunting_events',
      number_mini_pabx_filtering:
        '#rdm/45538/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_huntingCirpack_filtering',

      // CONFIGURATION - SVI
      number_svi_script_address:
        '#rdm/19448/page/number_svi_script_address/grp/{billingAccount}/menu/number/num/{lineNumber}',

      // CONFIGURATION - DDI
      number_ddi_redirect:
        '#rdm/16800/page/number_alias_redirect_modification/grp/{billingAccount}/menu/number/num/{lineNumber}',

      // CONFIGURATION - CLOUDIVR
      number_cloud_ivr_events:
        '#rdm/69860/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_hunting_events_cloud',
      number_cloud_ivr_configuration:
        '#rdm/22986/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_cloud_hunting_configuration',

      // BANK
      number_bannMaker:
        '#rdm/25790/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_bannMaker',

      // NUMBER DIRECTORY
      number_manage_directory:
        '#rdm/55079/menu/number/grp/{billingAccount}/num/{lineNumber}/page/number_manage_directory',
    },
  })
  .constant('uibButtonConfig', {
    activeClass: 'btn-primary',
  });
