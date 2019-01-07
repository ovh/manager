const changeOwnerURL = {
  CZ: 'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
  DE: 'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
  ES: 'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
  FI: 'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
  FR: 'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
  GB: 'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
  IE: null,
  IT: 'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
  LT: 'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
  NL: 'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
  PL: 'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
  PT: 'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
  CA: 'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
  QC: 'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
  WE: 'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
  WS: 'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
};

const guides = {
  CZ: {
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/cz/cs/clouddb/zaciname-s-clouddb/',
      db: 'https://docs.ovh.com/cz/cs/clouddb/zaciname-s-mysql-a-mariadb/',
      beginPostgre: 'https://docs.ovh.com/cz/cs/clouddb/zaciname-s-postgresql/',
    },
  },
  DE: {
    hostingPrivateDatabase: 'https://www.ovh.de/g2023.alles_wissenswerte_zum_sql_private_angebot',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/de/clouddb/erste-schritte-mit-clouddb/',
      db: 'https://docs.ovh.com/de/clouddb/erste-schritte-mit-mysql-und-mariadb/',
      beginPostgre: 'https://docs.ovh.com/de/clouddb/erste-schritte-mit-postgresql/',
    },
  },
  ES: {
    hostingPrivateDatabase: 'https://www.ovh.es/g2023.todo_sobre_el_sql_privado',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/es/clouddb/empezar-con-clouddb/',
      db: 'https://docs.ovh.com/es/clouddb/empezar-con-mysql-y-mariadb/',
      beginPostgre: 'https://docs.ovh.com/es/clouddb/empezar-con-postgresql/',
    },
  },
  FI: {
    hostingPrivateDatabase: 'https://www.ovh-hosting.fi/g2023.kaikki_mita_tarvitsee_tietaa_sql_private_-palvelusta',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/fi/clouddb/clouddb-palvelun-kayton-aloitus/',
      db: 'https://docs.ovh.com/fi/clouddb/mysql-ja-mariadb-tietokantojen-kayton-aloitus/',
      beginPostgre: 'https://docs.ovh.com/fi/clouddb/postgresql-tietokantojen-kayton-aloitus/',
    },
  },
  FR: {
    hostingPrivateDatabase: 'https://docs.ovh.com/fr/hosting/premiers-pas-avec-sql-prive/',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/fr/fr/cloud/clouddb/debuter-avec-clouddb/',
      db: 'https://docs.ovh.com/fr/fr/cloud/clouddb/demarrez-avec-mysql-et-mariadb/',
      beginPostgre: 'https://docs.ovh.com/fr/fr/cloud/clouddb/demarrez-avec-postgresql/',
    },
  },
  GB: {
    hostingPrivateDatabase: 'https://www.ovh.co.uk/g2023.what_you_need_to_know_about_private_sql',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/gb/en/clouddb/getting-started-with-clouddb/',
      db: 'https://docs.ovh.com/gb/en/clouddb/get-started-with-mysql-and-mariadb/',
      beginPostgre: 'https://docs.ovh.com/gb/en/clouddb/getting-started-with-postgresql/',
    },
  },
  IE: {},
  IT: {
    hostingPrivateDatabase: 'https://www.ovh.it/g2023.tutto_sullsql_privato',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/it/clouddb/come-utilizzare-clouddb/',
      db: 'https://docs.ovh.com/it/clouddb/come-utilizzare-mysql-e-mariadb/',
      beginPostgre: 'https://docs.ovh.com/it/clouddb/come-utilizzare-postgresql/',
    },
  },
  LT: {
    hostingPrivateDatabase: 'https://www.ovh.lt/g2023.viskas_apie_private_sql_paslauga',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/lt/clouddb/pradzia-su-clouddb/',
      db: 'https://docs.ovh.com/lt/clouddb/mysql-mariadb-naudojimas/',
      beginPostgre: 'https://docs.ovh.com/lt/clouddb/postgresql-naudojimas/',
    },
  },
  NL: {
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/nl/clouddb/aan-de-slag-met-clouddb/',
      db: 'https://docs.ovh.com/nl/clouddb/aan-de-slag-met-mysql-en-mariadb/',
      beginPostgre: 'https://docs.ovh.com/nl/clouddb/aan-de-slag-met-postgresql/',
    },
  },
  PL: {
    hostingPrivateDatabase: 'https://www.ovh.pl/g2023.prywatny_sql',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/pl/clouddb/pierwsze-kroki-z-clouddb/',
      db: 'https://docs.ovh.com/pl/clouddb/mysql-i-mariadb/',
      beginPostgre: 'https://docs.ovh.com/pl/clouddb/pierwsze-kroki-z-postgresql/',
    },
  },
  PT: {
    hostingPrivateDatabase: 'https://www.ovh.pt/g2023.tudo_sobre_sql_privado',
    hostingPrivateDatabaseDBaaS: {
      beginner: 'https://docs.ovh.com/pt/clouddb/comecar-com-clouddb/',
      db: 'https://docs.ovh.com/pt/clouddb/comecar-com-mysql-e-mariadb/',
      beginPostgre: 'https://docs.ovh.com/pt/clouddb/comecar-com-postgresql/',
    },
  },
  CA: {},
  QC: {},
  WE: {},
  WS: {},
};

export default { changeOwnerURL, guides };
