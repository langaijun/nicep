import { useSession } from '@/context/SessionContext';
import { useTranslation } from 'react-i18next';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';
import { useMemo } from 'react';

const ANCHOR_IDS = ['shoulders', 'feet', 'palms', 'abdomen', 'eyebrow', 'back', 'breath', 'jaw'] as const;

export default function AnchorScreen() {
  const { showScreen } = useSession();
  const { t } = useTranslation();

  const anchorId = useMemo(() => {
    const idx = Math.floor(Math.random() * ANCHOR_IDS.length);
    return ANCHOR_IDS[idx];
  }, []);

  return (
    <ScreenTransition className="flex flex-col items-center justify-center gap-8 text-center">
      <FadeIn delay={0.3} duration={2}>
        <div
          className="mx-auto rounded-full"
          style={{
            width: 140,
            height: 140,
            background: 'radial-gradient(circle, var(--breath-color), transparent)',
            animation: 'breathe 6s ease-in-out infinite',
          }}
        />
      </FadeIn>

      <FadeIn delay={0.8}>
        <p className="text-lg leading-9" style={{ color: 'var(--warm-text)' }}>
          {t(`anchor.points.${anchorId}.text`)}
          <br />
          {t(`anchor.points.${anchorId}.sub`)}
        </p>
      </FadeIn>

      <FadeIn delay={1.5}>
        <p className="text-base leading-8" style={{ color: 'var(--warm-muted)' }}>
          {t('anchor.breathePrompt')}
        </p>
      </FadeIn>

      <FadeIn delay={2.0}>
        <button
          onClick={() => showScreen('allow')}
          className="mt-5 min-w-[200px] rounded-2xl px-6 py-3.5 text-center text-base transition-all duration-300 hover:opacity-90"
          style={{
            background: 'var(--warm-text)',
            color: 'var(--warm-bg)',
          }}
        >
          {t('anchor.ready')}
        </button>
      </FadeIn>
    </ScreenTransition>
  );
}
