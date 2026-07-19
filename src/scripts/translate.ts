/**
 * DeepSeek batch translation script
 *
 * Usage:
 *   DEEPSEEK_API_KEY=sk-xxx npx tsx src/scripts/translate.ts
 *
 * Or on Windows PowerShell:
 *   $env:DEEPSEEK_API_KEY="sk-xxx"; npx tsx src/scripts/translate.ts
 *
 * Reads zh-CN.json, generates en.json and es.json.
 * Existing translations will be OVERWRITTEN.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/chat/completions';

const SYSTEM_PROMPT = `You are a professional software localizer specializing in mental wellness and mindfulness apps.

Translation rules:
1. This is a gentle, non-judgmental mental wellness app. Tone must be warm, soft, conversational — never clinical or cold.
2. Preserve all ICU message format variables like {{text}}, {{word}}, {{count}} exactly as-is.
3. Keep the brand name "NiceP" untranslated.
4. For emotional/therapeutic text, prioritize natural expression over literal translation. Transcreate when needed.
5. Button labels should be short and action-oriented.
6. Do NOT use "you should", "you must", "try harder" or any pressuring language.
7. Output only valid JSON, no explanations, no markdown code blocks.
8. Maintain the exact same JSON structure and keys.

Glossary:
- 接纳 → Acceptance (en) / Aceptación (es)
- 启动 → Spark (en) / Chispa (es)
- 荒谬地小 → Absurdly small (en) / Absurdamente pequeño (es)
- 就算赢 → That counts (en) / Eso cuenta (es)
- 苏格拉底 → Socratic (en) / Socrático (es)

For Spanish: use "tú" (informal/friendly), not "usted". Use Latin American Spanish.`;

async function translateToLang(
  sourceJson: string,
  targetLang: string
): Promise<Record<string, unknown>> {
  const langName = targetLang === 'en' ? 'English' : 'Latin American Spanish';

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Translate the following JSON from Chinese to ${langName}.
Return the exact same JSON structure with translated values.
Keep all keys unchanged. Preserve all {{variable}} placeholders exactly.

Source JSON:
${sourceJson}`,
        },
      ],
      max_tokens: 8000,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: HTTP ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) throw new Error('Empty response from DeepSeek');

  // Strip markdown code blocks if present
  const cleaned = content.replace(/^```json?\s*/i, '').replace(/```\s*$/, '');
  return JSON.parse(cleaned);
}

// Split a large JSON into smaller chunks by top-level keys
function splitByTopLevelKeys(obj: Record<string, unknown>): Record<string, unknown>[] {
  const keys = Object.keys(obj);
  // Skip "memory" and "tinyVersions" — they contain language-specific data structures
  // that need special handling
  const mainKeys = keys.filter(k => k !== 'memory' && k !== 'tinyVersions');
  const specialKeys = keys.filter(k => k === 'memory' || k === 'tinyVersions');

  const chunks: Record<string, unknown>[] = [];

  // Group main keys into chunks of 3-4
  for (let i = 0; i < mainKeys.length; i += 4) {
    const chunk: Record<string, unknown> = {};
    for (const key of mainKeys.slice(i, i + 4)) {
      chunk[key] = obj[key];
    }
    chunks.push(chunk);
  }

  // Special keys each get their own chunk
  for (const key of specialKeys) {
    chunks.push({ [key]: obj[key] });
  }

  return chunks;
}

async function main() {
  if (!DEEPSEEK_API_KEY) {
    console.error('Error: Set DEEPSEEK_API_KEY environment variable');
    console.error('Example: DEEPSEEK_API_KEY=sk-xxx npx tsx src/scripts/translate.ts');
    process.exit(1);
  }

  const sourceFile = path.join(__dirname, '../i18n/locales/zh-CN.json');
  const source = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));
  const chunks = splitByTopLevelKeys(source);

  for (const lang of ['en', 'es']) {
    console.log(`\n🌍 Translating to ${lang}...`);
    const merged: Record<string, unknown> = {};

    for (let i = 0; i < chunks.length; i++) {
      const chunkJson = JSON.stringify(chunks[i], null, 2);
      console.log(`  Chunk ${i + 1}/${chunks.length}...`);

      try {
        const result = await translateToLang(chunkJson, lang);
        Object.assign(merged, result);
      } catch (err) {
        console.error(`  ❌ Error on chunk ${i + 1}:`, err);
        console.log('  Retrying once...');
        await new Promise(r => setTimeout(r, 2000));
        const result = await translateToLang(chunkJson, lang);
        Object.assign(merged, result);
      }

      // Rate limit: wait between chunks
      if (i < chunks.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    const outFile = path.join(__dirname, `../i18n/locales/${lang}.json`);
    fs.writeFileSync(outFile, JSON.stringify(merged, null, 2) + '\n');
    console.log(`  ✅ ${outFile} written (${Object.keys(merged).length} top-level keys)`);
  }

  console.log('\n✨ Done! Please review translations before committing.');
  console.log('   Focus on: emotional tone, {{variable}} preservation, button brevity.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
