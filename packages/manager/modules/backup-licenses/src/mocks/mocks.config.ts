/**
 * Interrupteur de développement : quand il est à `true`, les requêtes API du module
 * renvoient les jeux de données de `src/mocks/**` au lieu d'appeler l'API.
 *
 * Sert à visualiser les écrans dont les routes ne sont pas encore déployées
 * (cf. §15 de la spec BKP-1216). À laisser à `false` dans le code committé.
 */
export const USE_API_MOCKS = true;
