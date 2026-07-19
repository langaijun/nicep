import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { useMemory } from '@/hooks/useMemory';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';

export default function AcceptNarrativeScreen() {
  const { t } = useTranslation();
  const { dispatch, showScreen } = useSession();
  const { hasNegativeWord } = useMemory();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const val = text.trim();
    dispatch({ type: 'SET_ACCEPT_TEXT', text: val });

    if (hasNegativeWord(val)) {
      dispatch({ type: 'SET_SOCRATIC_TEXT', text: '' });
      showScreen('socratic');
      return;
    }

    showScreen('exit');
  };

  return (
    <ScreenTransition className="flex flex-col gap-7">
      <FadeIn>
        <p className="text-lg leading-9" style={{ color: 'var(--warm-text)' }}>
          {t('acceptNarrative.prompt1')}
          <br />
          {t('acceptNarrative.prompt2')}
        </p>
      </FadeIn>

      <FadeIn delay={0.4}>
        <motion.textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('acceptNarrative.placeholder')}
          className="w-full min-h-[120px] resize-y rounded-2xl border p-5 text-base leading-8 outline-none transition-all duration-300 focus:border-[var(--warm-accent)]"
          style={{
            background: 'var(--warm-card)',
            borderColor: 'var(--warm-border)',
            color: 'var(--warm-text)',
            fontFamily: 'inherit',
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 120, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
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
          {t('acceptNarrative.submit')}
        </button>
      </FadeIn>
    </ScreenTransition>
  );
}
