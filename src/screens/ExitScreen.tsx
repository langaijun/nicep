import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/context/SessionContext';
import { useMemory } from '@/hooks/useMemory';
import { track } from '@vercel/analytics';
import { FadeIn, ScreenTransition } from '@/components/AnimatedText';

const SYSTEM_PROMPT = `你是一个安静的陪伴者，不说"加油"、"努力"、"你应该"。
根据用户的对话内容，生成一句不超过30个字的温柔告别语。
语气像一位安静的朋友，不是导师，不是医生。
只输出这句话本身，不要加引号，不要解释。`;

function getTemplateQuote(
  t: (key: string, options?: Record<string, unknown>) => string,
  currentPath: string,
  sessionData: ReturnType<typeof useSession>['state']['sessionData']
): string {
  const quotes: string[] = [];

  if (currentPath === 'accept') {
    if (sessionData.acceptText) {
      quotes.push(
        t('exit.quotes.acceptSelfDesc', {
          text: sessionData.acceptText.substring(0, 20) + (sessionData.acceptText.length > 20 ? '...' : ''),
        })
      );
    }
    quotes.push(t('exit.quotes.acceptAllowedUnknown'));
    quotes.push(t('exit.quotes.acceptStay'));
    quotes.push(t('exit.quotes.acceptDefine'));
  } else {
    if (sessionData.sparkText) {
      quotes.push(
        t('exit.quotes.sparkRecall', {
          text: sessionData.sparkText.substring(0, 15),
        })
      );
    }
    if (sessionData.done) {
      quotes.push(t('exit.quotes.sparkDone'));
    } else {
      quotes.push(t('exit.quotes.sparkNotYet'));
    }
    quotes.push(t('exit.quotes.meaningLived'));
  }

  if (sessionData.socraticText) {
    quotes.push(
      t('exit.quotes.socraticReframe', {
        text: sessionData.socraticText.substring(0, 25),
      })
    );
  }

  const seed = Date.now() % quotes.length;
  return quotes[seed];
}

function buildUserPrompt(sessionData: ReturnType<typeof useSession>['state']['sessionData']): string {
  let prompt = '';
  if (sessionData.acceptText) {
    prompt += `用户说："${sessionData.acceptText}"\n`;
  }
  if (sessionData.sparkText) {
    prompt += `用户提到的想做瞬间："${sessionData.sparkText}"\n`;
  }
  if (sessionData.sparkBodyText) {
    prompt += `用户的身体感受："${sessionData.sparkBodyText}"\n`;
  }
  if (sessionData.socraticText) {
    prompt += `用户重新描述后："${sessionData.socraticText}"\n`;
  }
  if (sessionData.done) {
    prompt += '用户点击了"我做了"。\n';
  } else {
    prompt += '用户选择先休息，还没做。\n';
  }
  prompt += '\n请生成一句温柔的告别语（不超过30个字）：';
  return prompt;
}

export default function ExitScreen() {
  const { t } = useTranslation();
  const { state: sessionState, showScreen, goHome } = useSession();
  const { saveSession, addWord } = useMemory();
  const { currentPath, sessionData } = sessionState;

  const [quote, setQuote] = useState<string>(() =>
    getTemplateQuote(t, currentPath, sessionData)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [feltLighter, setFeltLighter] = useState(false);

  // Track exit ritual completion
  useEffect(() => {
    try {
      track('exit_ritual_viewed');
    } catch {
      // silently fail
    }
  }, []);

  // Generate AI quote via DeepSeek (Chinese only for now)
  useEffect(() => {
    const apiKey = (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_DEEPSEEK_API_KEY)
      || localStorage.getItem('nicep_api_key');
    if (!apiKey) return;

    let cancelled = false;
    setIsGenerating(true);

    fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(sessionData) },
        ],
        max_tokens: 60,
        temperature: 0.8,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const aiQuote = data.choices?.[0]?.message?.content?.trim();
        if (aiQuote && aiQuote.length > 5 && aiQuote.length < 80) {
          setQuote(aiQuote);
        }
      })
      .catch(() => {
        // fallback to template on any error
      })
      .finally(() => {
        if (!cancelled) setIsGenerating(false);
      });

    return () => { cancelled = true; };
  }, [sessionData]);

  // Save session on mount
  useEffect(() => {
    saveSession(sessionData);
    const text = sessionData.sparkText || sessionData.acceptText;
    if (text) {
      addWord({
        text,
        path: currentPath as 'accept' | 'spark',
        socratic: sessionData.socraticText || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Felt lighter" handler
  const handleFeltLighter = useCallback(() => {
    if (feltLighter) return;
    setFeltLighter(true);
    try {
      localStorage.setItem('nicep_felt_lighter', JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        quote: quote.substring(0, 50),
      }));
      track('felt_lighter');
    } catch {
      // silently fail
    }
  }, [feltLighter, quote]);

  return (
    <ScreenTransition className="flex flex-col items-center gap-6 text-center">
      <FadeIn delay={0.3}>
        <motion.div
          className="px-4 py-8 text-xl leading-9 font-normal tracking-wide"
          style={{ color: 'var(--warm-text)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {quote}
          {isGenerating && (
            <motion.span
              className="ml-1 inline-block"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: 'var(--warm-muted)', fontSize: '0.9rem' }}
            >
              …
            </motion.span>
          )}
        </motion.div>
      </FadeIn>

      <FadeIn delay={1.0}>
        <motion.div
          className="h-px w-full max-w-[200px] mx-auto"
          style={{ background: 'var(--warm-border)' }}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, delay: 1.0 }}
        />
      </FadeIn>

      <FadeIn delay={2.0}>
        <button
          onClick={handleFeltLighter}
          disabled={feltLighter}
          className="px-5 py-2.5 text-sm rounded-xl border transition-all duration-500"
          style={{
            color: feltLighter ? 'var(--warm-accent)' : 'var(--warm-muted)',
            borderColor: feltLighter ? 'var(--warm-accent)' : 'var(--warm-border)',
            background: feltLighter ? 'var(--warm-accent-soft)' : 'var(--warm-card)',
            cursor: feltLighter ? 'default' : 'pointer',
            opacity: feltLighter ? 1 : undefined,
          }}
        >
          {feltLighter ? t('exit.feltLighterDone') : t('exit.feltLighter')}
        </button>
      </FadeIn>

      <div className="mt-2 flex flex-col gap-3">
        <FadeIn delay={2.3}>
          <button
            onClick={() => showScreen('stay')}
            className="px-3 py-2 text-sm transition-colors duration-300 hover:opacity-70"
            style={{ color: 'var(--warm-muted)' }}
          >
            {t('exit.stayMore')}
          </button>
        </FadeIn>

        <FadeIn delay={2.6}>
          <button
            onClick={goHome}
            className="px-3 py-2 text-sm transition-colors duration-300 hover:opacity-70"
            style={{ color: 'var(--warm-muted)' }}
          >
            {t('exit.leave')}
          </button>
        </FadeIn>
      </div>
    </ScreenTransition>
  );
}
