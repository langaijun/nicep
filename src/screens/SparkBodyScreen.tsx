import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';

export default function SparkBodyScreen() {
  const { t } = useTranslation();
  const { state: sessionState, dispatch, showScreen } = useSession();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const val = text.trim();
    dispatch({ type: 'SET_SPARK_BODY_TEXT', text: val });
    showScreen('breakdown');
  };

  return (
    <ScreenTransition className="flex flex-col gap-7">
      <FadeIn>
        <p className="text-lg leading-9" style={{ color: 'var(--warm-text)' }}>
          {t('sparkBody.recall', { text: sessionState.sessionData.sparkText })}
          <br />
          <br />
          {t('sparkBody.prompt')}
        </p>
      </FadeIn>

      <FadeIn delay={0.4}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('sparkBody.placeholder')}
          className="w-full min-h-[120px] resize-y rounded-2xl border p-5 text-base leading-8 outline-none transition-all duration-300 focus:border-[var(--warm-accent)]"
          style={{
            background: 'var(--warm-card)',
            borderColor: 'var(--warm-border)',
            color: 'var(--warm-text)',
            fontFamily: 'inherit',
          }}
        />
      </FadeIn>

      <FadeIn delay={0.8}>
        <button
          onClick={handleSubmit}
          className="w-full rounded-2xl px-6 py-4 text-center text-base transition-all duration-300 hover:opacity-90"
          style={{
            background: 'var(--warm-text)',
            color: 'var(--warm-bg)',
          }}
        >
          {t('sparkBody.submit')}
        </button>
      </FadeIn>
    </ScreenTransition>
  );
}
