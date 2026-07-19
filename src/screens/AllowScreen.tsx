import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';

export default function AllowScreen() {
  const { showScreen } = useSession();
  const { t } = useTranslation();
  const [allowed, setAllowed] = useState<Set<number>>(new Set());
  const [showNext, setShowNext] = useState(false);

  const items = t('allow.items', { returnObjects: true }) as string[];

  const handleAllow = (id: number) => {
    if (allowed.has(id)) return;
    const next = new Set(allowed);
    next.add(id);
    setAllowed(next);
    if (next.size >= 1) {
      setTimeout(() => setShowNext(true), 600);
    }
  };

  return (
    <ScreenTransition className="flex flex-col gap-7">
      <FadeIn>
        <p className="text-lg leading-9" style={{ color: 'var(--warm-text)' }}>
          {t('allow.intro')}
        </p>
      </FadeIn>

      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <FadeIn key={index} delay={0.3 + index * 0.3}>
            <motion.div
              className="rounded-2xl border p-5 transition-all duration-700"
              style={{
                background: allowed.has(index) ? 'var(--warm-accent-soft)' : 'var(--warm-card)',
                borderColor: allowed.has(index) ? 'var(--warm-accent)' : 'var(--warm-border)',
              }}
            >
              <p className="mb-3 text-base" style={{ color: 'var(--warm-text)' }}>
                {item}
              </p>
              {!allowed.has(index) && (
                <button
                  onClick={() => handleAllow(index)}
                  className="rounded-xl border px-5 py-2.5 text-sm transition-all duration-300"
                  style={{
                    background: 'var(--warm-card)',
                    borderColor: 'var(--warm-border)',
                    color: 'var(--warm-text)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--warm-accent-soft)';
                    e.currentTarget.style.borderColor = 'var(--warm-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--warm-card)';
                    e.currentTarget.style.borderColor = 'var(--warm-border)';
                  }}
                >
                  {t('allow.allowBtn')}
                </button>
              )}
              {allowed.has(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.6 }}
                  className="border-t pt-3 text-sm italic"
                  style={{ borderColor: 'var(--warm-border)', color: 'var(--warm-muted)' }}
                >
                  {t('allow.allowed')}
                </motion.div>
              )}
            </motion.div>
          </FadeIn>
        ))}
      </div>

      {showNext && (
        <FadeIn>
          <button
            onClick={() => showScreen('accept-narrative')}
            className="mx-auto block px-3 py-2 text-sm transition-colors duration-300 hover:opacity-70"
            style={{ color: 'var(--warm-muted)' }}
          >
            {t('allow.continue')}
          </button>
        </FadeIn>
      )}
    </ScreenTransition>
  );
}
