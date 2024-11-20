import { createContext, PropsWithChildren, useContext, useEffect, useState, useCallback } from "react";
import { LangTranslationKey } from "@/enums"
import PT_LANG from "@/lang/pt";

type Theme = "dark" | "light" | "system";

type AppSettingsProviderProps = {
  defaultTheme?: Theme;
  defaultLanguage?: Lang;
  availableLanguages: Lang[];
  themeStorageKey?: string;
  languageStorageKey?: string;
};

type AppSettingsProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Lang;
  setLanguage: (language: Lang) => void;
  availableLanguages: Lang[];
  lang: (langTranslationKey: LangTranslationKey) => string
};

const initialLang: Lang = PT_LANG

const initialState: AppSettingsProviderState = {
  theme: "dark",
  setTheme: () => null,
  language: initialLang,
  setLanguage: () => null,
  availableLanguages: [initialLang], // set a default available language
  lang: () => ""
};

const AppSettingsContext = createContext<AppSettingsProviderState>(initialState);

export function AppSettingsProvider({
  children,
  defaultTheme = "system",
  defaultLanguage = initialLang,
  availableLanguages,
  themeStorageKey = "vite-ui-theme",
  languageStorageKey = "vite-ui-language",
  ...props
}: PropsWithChildren<AppSettingsProviderProps>) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(themeStorageKey) as Theme) || defaultTheme
  );

  const [language, setLanguage] = useState<Lang>(
    () => {
      const savedLanguage = localStorage.getItem(languageStorageKey);
      return (
        availableLanguages.find((lang) => lang.name === savedLanguage) ||
        defaultLanguage
      );
    }
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Save theme to local storage whenever it changes
  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem(themeStorageKey, newTheme);
    setTheme(newTheme);
  };

  // Save language to local storage whenever it changes
  const updateLanguage = (newLanguage: Lang) => {
    localStorage.setItem(languageStorageKey, newLanguage.name);
    setLanguage(newLanguage);
  };

  const translate = useCallback(
	() => (key: LangTranslationKey) => {
		return language.translations[key]
	}, [language]
  )
  

  const value: AppSettingsProviderState = {
    theme,
    setTheme: updateTheme,
    language,
    setLanguage: updateLanguage,
    availableLanguages,
	lang: translate()
  };

  return (
    <AppSettingsContext.Provider {...props} value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export const isTheme = (value: string): value is Theme => {
	return value === "dark" || value === "light" || value === "system";
}

// Custom hook to access the AppSettings context
export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return context;
};
