import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';

export default function SparkScreen() {
  const { t } = useTranslation();
  const { dispatch, showScreen } = useSession();
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState(t('spark.placeholder'));

  const handleSubmit = () => {
    const val = text.trim();
    if (!val) {
      setPlaceholder(t('spark.placeholderFallback'));
      return;
    }
    dispatch({ type: 'SET_SPARK_TEXT', text: val });
    showScreen('spark-body');
  };

  return (
    <ScreenTransition className="flex flex-col gap-7">
      <FadeIn>
        <p className="text-lg leading-9" style={{ color: 'var(--warm-text)' }}>
          {t('spark.prompt1')}
          <strong>{t('spark.promptEmphasis')}</strong>
          {t('spark.prompt2')}
          <br />
          {t('spark.prompt3')}
        </p>
      </FadeIn>

      <FadeIn delay={0.4}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
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
          {t('spark.submit')}
        </button>
      </FadeIn>
    </ScreenTransition>
  );
}
