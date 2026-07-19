import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'zh-CN', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <div className="flex gap-1.5">
      {LANGUAGES.map((lang) => {
        const isActive = current === lang.code || current.startsWith(lang.code) || lang.code.startsWith(current);
        return (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className="rounded-lg px-2 py-1 text-xs transition-all duration-300"
            style={{
              background: isActive ? 'var(--warm-accent-soft)' : 'transparent',
              color: isActive ? 'var(--warm-text)' : 'var(--warm-muted)',
              border: isActive
                ? '1px solid var(--warm-accent)'
                : '1px solid transparent',
              opacity: isActive ? 1 : 0.6,
            }}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
