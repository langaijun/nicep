import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';

export default function DoneScreen() {
  const { t } = useTranslation();
  const { dispatch, showScreen } = useSession();

  const handleDone = () => {
    dispatch({ type: 'SET_DONE', done: true });
    showScreen('exit');
  };

  const handleSkip = () => {
    dispatch({ type: 'SET_DONE', done: false });
    showScreen('exit');
  };

  return (
    <ScreenTransition className="flex flex-col items-center gap-6 text-center">
      <FadeIn>
        <p className="text-lg leading-9" style={{ color: 'var(--warm-text)' }}>
          {t('done.prompt1')}
          <br />
          {t('done.prompt2')}
        </p>
      </FadeIn>

      <FadeIn delay={0.5}>
        <button
          onClick={handleDone}
          className="min-w-[200px] rounded-2xl px-6 py-4 text-center text-base transition-all duration-300 hover:opacity-90"
          style={{
            background: 'var(--warm-text)',
            color: 'var(--warm-bg)',
          }}
        >
          {t('done.didIt')}
        </button>
      </FadeIn>

      <FadeIn delay={0.8}>
        <button
          onClick={handleSkip}
          className="px-3 py-2 text-sm transition-colors duration-300 hover:opacity-70"
          style={{ color: 'var(--warm-muted)' }}
        >
          {t('done.rest')}
        </button>
      </FadeIn>
    </ScreenTransition>
  );
}
