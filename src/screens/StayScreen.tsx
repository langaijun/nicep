import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';

export default function StayScreen() {
  const { t } = useTranslation();
  const { goHome } = useSession();

  return (
    <ScreenTransition className="flex flex-col items-center justify-center gap-8 text-center">
      <FadeIn delay={0.5} duration={2}>
        <div
          className="mx-auto rounded-full"
          style={{
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, var(--breath-color), transparent)',
            animation: 'breathe 6s ease-in-out infinite',
          }}
        />
      </FadeIn>

      <FadeIn delay={1.0}>
        <p className="text-base leading-8" style={{ color: 'var(--warm-muted)' }}>
          {t('stay.breathe1')}
          <br />
          {t('stay.breathe2')}
        </p>
      </FadeIn>

      <FadeIn delay={1.5}>
        <button
          onClick={goHome}
          className="mt-10 px-3 py-2 text-sm transition-colors duration-300 hover:opacity-70"
          style={{ color: 'var(--warm-muted)' }}
        >
          {t('stay.leave')}
        </button>
      </FadeIn>
    </ScreenTransition>
  );
}
