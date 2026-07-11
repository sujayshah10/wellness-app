import { useAppData } from "../context/useAppData";
import { dayLabel, translate } from "./i18n";

export function useTranslation() {
  const { appData } = useAppData();
  const language = appData.settings.language;

  return {
    language,
    t: (key) => translate(language, key),
    dayName: (day) => dayLabel(language, day)
  };
}
