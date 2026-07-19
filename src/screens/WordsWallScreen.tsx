import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMemory } from '@/hooks/useMemory';
import { useSession } from '@/context/SessionContext';
import { FadeIn, ScreenTransition, StaggerContainer, StaggerItem } from '@/components/AnimatedText';

export default function WordsWallScreen() {
  const { t } = useTranslation();
  const { showScreen } = useSession();
  const { loadWords, exportWords } = useMemory();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const words = useMemo(() => loadWords(), [loadWords]);

  const handleExport = () => {
    const content = exportWords(words);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nicep-words-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ScreenTransition className="flex flex-col gap-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-normal tracking-wide" style={{ color: 'var(--warm-text)' }}>
            {t('wordsWall.title')}
          </h2>
          <button
            onClick={() => showScreen('home')}
            className="text-sm transition-colors duration-300 hover:opacity-70"
            style={{ color: 'var(--warm-muted)' }}
          >
            {t('wordsWall.back')}
          </button>
        </div>
      </FadeIn>

      {words.length === 0 ? (
        <FadeIn delay={0.3}>
          <div className="py-16 text-center">
            <p className="text-base leading-8" style={{ color: 'var(--warm-muted)' }}>
              {t('wordsWall.empty1')}
              <br />
              {t('wordsWall.empty2')}
            </p>
          </div>
        </FadeIn>
      ) : (
        <>
          <FadeIn delay={0.2}>
            <p className="text-sm" style={{ color: 'var(--warm-muted)' }}>
              {t('wordsWall.recentDays', { count: words.length })}
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="flex flex-col gap-3">
            {words.map((word, index) => (
              <StaggerItem key={`${word.date}-${index}`}>
                <motion.div
                  className="cursor-pointer rounded-2xl border p-5 transition-all duration-500"
                  style={{
                    background: 'var(--warm-card)',
                    borderColor: 'var(--warm-border)',
                  }}
                  onClick={() => setExpandedId(expandedId === index ? null : index)}
                  layout
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-base leading-7" style={{ color: 'var(--warm-text)' }}>
                        {word.text}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-xs"
                      style={{
                        background: word.path === 'accept' ? 'var(--warm-accent-soft)' : '#e8e0d8',
                        color: 'var(--warm-muted)',
                      }}
                    >
                      {word.path === 'accept' ? t('wordsWall.accept') : t('wordsWall.spark')}
                    </span>
                  </div>

                  <p className="mt-2 text-xs" style={{ color: 'var(--warm-muted)' }}>
                    {word.date}
                  </p>

                  <AnimatePresence>
                    {expandedId === index && word.socratic && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-3 border-t pt-3 text-sm italic"
                        style={{ borderColor: 'var(--warm-border)', color: 'var(--warm-muted)' }}
                      >
                        {t('wordsWall.socratic')}: {word.socratic}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.5}>
            <button
              onClick={handleExport}
              className="mx-auto block rounded-xl border px-5 py-2.5 text-sm transition-all duration-300 hover:-translate-y-px"
              style={{
                background: 'var(--warm-card)',
                borderColor: 'var(--warm-border)',
                color: 'var(--warm-text)',
              }}
            >
              {t('wordsWall.export')}
            </button>
          </FadeIn>
        </>
      )}
    </ScreenTransition>
  );
}
