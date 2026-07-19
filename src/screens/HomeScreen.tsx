import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { useMemory } from '@/hooks/useMemory';
import AnimatedText, { StaggerContainer, StaggerItem, FadeIn, ScreenTransition } from '@/components/AnimatedText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { UserState } from '@/types';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { chooseState } = useSession();
  const { loadLastWord } = useMemory();
  const [lastWord, setLastWord] = useState<{ text: string; date: string } | null>(null);

  useEffect(() => {
    setLastWord(loadLastWord());
  }, [loadLastWord]);

  const stateKeys: UserState[] = ['noisy', 'empty', 'busy', 'okay'];

  return (
    <ScreenTransition>
      <div className="flex flex-col gap-8">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="flex flex-col gap-2" style={{ color: 'var(--warm-text)' }}>
          <AnimatedText
            text={t('home.title1')}
            as="h1"
            className="text-[1.5rem] font-normal tracking-wide"
          />
          <AnimatedText
            text={t('home.title2')}
            as="h1"
            className="text-[1.5rem] font-normal tracking-wide"
            delay={0.4}
          />
          <AnimatedText
            text={t('home.title3')}
            as="h1"
            className="text-[1.5rem] font-normal tracking-wide"
            delay={0.8}
          />
        </div>

        <FadeIn delay={1.6}>
          <p
            className="text-base leading-8"
            style={{ color: 'var(--warm-muted)' }}
          >
            {t('home.statusPrompt')}
          </p>
        </FadeIn>

        <StaggerContainer staggerDelay={0.25} className="flex flex-col gap-4">
          {stateKeys.map((key) => (
            <StaggerItem key={key}>
              <button
                onClick={() => chooseState(key)}
                className="w-full rounded-2xl border px-6 py-3.5 text-left text-base leading-relaxed transition-all duration-500 hover:-translate-y-px"
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
                {t(`home.state.${key}`)}
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {lastWord && (
          <FadeIn delay={2.8}>
            <div
              className="rounded-xl px-5 py-4 text-sm leading-relaxed border-l-[3px]"
              style={{
                background: 'var(--warm-accent-soft)',
                color: 'var(--warm-muted)',
                borderColor: 'var(--warm-accent)',
              }}
            >
              {t('home.lastWord', {
                text: lastWord.text.length > 40
                  ? lastWord.text.substring(0, 40) + '...'
                  : lastWord.text,
              })}
              <br />
              {t('home.lastWordFollow')}
            </div>
          </FadeIn>
        )}
      </div>
    </ScreenTransition>
  );
}
