import { nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { loadLocaleMessages } from '@/i18n';

const useLoadTranslations = async (folders: string[]) => {
  const i18n = useI18n();
  const { locale, fallbackLocale } = useI18n();
  const currentMessagesLocale = { ...i18n.getLocaleMessage(locale.value) };
  const messages = await loadLocaleMessages(locale.value, currentMessagesLocale, folders);
  const fallbackMessages = await loadLocaleMessages(
    fallbackLocale.value,
    currentMessagesLocale,
    folders,
  );

  i18n.mergeLocaleMessage(locale.value, messages);
  i18n.mergeLocaleMessage(fallbackLocale.value.toString(), fallbackMessages);
  await nextTick();
};

export default useLoadTranslations;
