import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { useMemory } from '@/hooks/useMemory';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';

export default function BreakdownScreen() {
  const { t } = useTranslation();
  const { state: sessionState, showScreen } = useSession();
  const { generateTinyVersion } = useMemory();

  const original = sessionState.sessionData.sparkText;
  const tiny = useMemo(() => generateTinyVersion(original), [original, generateTinyVersion]);

  return (
    <ScreenTransition className="flex flex-col gap-6">
      <FadeIn>
        <p className="text-lg leading-9" style={{ color: 'var(--warm-text)' }}>
          {t('breakdown.prompt1')}
          <br />
          {t('breakdown.prompt2')}
          <strong>{t('breakdown.promptEmphasis')}</strong>
          {t('breakdown.prompt3')}
        </p>
      </FadeIn>

      <FadeIn delay={0.4}>
        <div
          className="rounded-2xl border-l-4 p-5"
          style={{
            background: 'var(--warm-accent-soft)',
            borderColor: 'var(--warm-accent)',
          }}
        >
          <p className="mb-2 text-xs uppercase tracking-wider" style={{ color: 'var(--warm-muted)' }}>
            {t('breakdown.youSaid')}
          </p>
          <p className="text-lg leading-7" style={{ color: 'var(--warm-text)' }}>
            {original}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.7}>
        <div
          className="rounded-2xl border-l-4 p-5"
          style={{
            background: 'var(--warm-accent-soft)',
            borderColor: 'var(--warm-accent)',
          }}
        >
          <p className="mb-2 text-xs uppercase tracking-wider" style={{ color: 'var(--warm-muted)' }}>
            {t('breakdown.tinyVersion')}
          </p>
          <p className="text-lg leading-7" style={{ color: 'var(--warm-text)' }}>
            {tiny}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={1.0}>
        <p className="text-base leading-8" style={{ color: 'var(--warm-muted)' }}>
          {t('breakdown.encourage')}
        </p>
      </FadeIn>

      <FadeIn delay={1.3}>
        <button
          onClick={() => showScreen('done')}
          className="w-full rounded-2xl px-6 py-4 text-center text-base transition-all duration-300 hover:opacity-90"
          style={{
            background: 'var(--warm-text)',
            color: 'var(--warm-bg)',
          }}
        >
          {t('breakdown.submit')}
        </button>
      </FadeIn>
    </ScreenTransition>
  );
}
