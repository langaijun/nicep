import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SessionData, MemoryRecord } from '@/types';

/** Normalize i18n.language (e.g. 'en-US' → 'en', 'zh' → 'zh-CN') */
function normalizeLang(lng: string): string {
  const base = lng.split('-')[0];
  if (base === 'zh') return 'zh-CN';
  if (base === 'en') return 'en';
  if (base === 'es') return 'es';
  return 'zh-CN';
}

// Per-language negative word lists
const NEGATIVE_WORDS: Record<string, string[]> = {
  'zh-CN': ['失败', '没用', '没意义', '糟糕', '不行', '太差', '后悔', '废物', '一事无成', '白忙'],
  en: ['failure', 'useless', 'pointless', 'terrible', "can't", 'awful', 'regret', 'worthless', 'nothing', 'waste'],
  es: ['fracaso', 'inútil', 'sin sentido', 'terrible', 'no puedo', 'horrible', 'arrepentimiento', 'basura', 'nada', 'desperdicio'],
};

// Per-language keyword → translation key mapping for tiny versions
// All translation keys use English-keyed paths (matching the JSON structure)
const TINY_KEYWORDS: Record<string, Array<[string, string]>> = {
  'zh-CN': [
    ['写', 'tinyVersions.keywords.write'], ['文字', 'tinyVersions.keywords.text'],
    ['日记', 'tinyVersions.keywords.journal'], ['文章', 'tinyVersions.keywords.article'],
    ['跑', 'tinyVersions.keywords.run'], ['动', 'tinyVersions.keywords.move'],
    ['运动', 'tinyVersions.keywords.exercise'], ['健身', 'tinyVersions.keywords.gym'],
    ['走', 'tinyVersions.keywords.walk'],
    ['画', 'tinyVersions.keywords.draw'], ['拍', 'tinyVersions.keywords.snap'],
    ['照片', 'tinyVersions.keywords.photo'], ['视频', 'tinyVersions.keywords.video'],
    ['读', 'tinyVersions.keywords.read'], ['书', 'tinyVersions.keywords.book'],
    ['说', 'tinyVersions.keywords.say'], ['聊', 'tinyVersions.keywords.chat'],
    ['联系', 'tinyVersions.keywords.contact'], ['打电话', 'tinyVersions.keywords.phone'],
    ['学', 'tinyVersions.keywords.study'], ['练', 'tinyVersions.keywords.practice'],
    ['吃', 'tinyVersions.keywords.eat'], ['做', 'tinyVersions.keywords.make'],
    ['煮', 'tinyVersions.keywords.boil'], ['菜', 'tinyVersions.keywords.dish'],
    ['整理', 'tinyVersions.keywords.organize'], ['打扫', 'tinyVersions.keywords.clean'],
    ['收拾', 'tinyVersions.keywords.tidy'],
    ['睡', 'tinyVersions.keywords.sleep'], ['休息', 'tinyVersions.keywords.rest'],
    ['躺', 'tinyVersions.keywords.lie'],
    ['听', 'tinyVersions.keywords.listen'], ['歌', 'tinyVersions.keywords.song'],
    ['音乐', 'tinyVersions.keywords.music'],
    ['浇', 'tinyVersions.keywords.water_plant'], ['花', 'tinyVersions.keywords.flower'],
    ['植物', 'tinyVersions.keywords.plant'],
    ['洗', 'tinyVersions.keywords.wash'], ['漱', 'tinyVersions.keywords.rinse'],
    ['脸', 'tinyVersions.keywords.face'],
    ['笑', 'tinyVersions.keywords.laugh'], ['看', 'tinyVersions.keywords.watch'],
    ['剧', 'tinyVersions.keywords.show'], ['电影', 'tinyVersions.keywords.movie'],
    ['喝', 'tinyVersions.keywords.drink_water'], ['茶', 'tinyVersions.keywords.tea'],
    ['水', 'tinyVersions.keywords.water'], ['咖啡', 'tinyVersions.keywords.coffee'],
    ['出', 'tinyVersions.keywords.go'], ['门', 'tinyVersions.keywords.door'],
    ['散', 'tinyVersions.keywords.stroll'], ['逛', 'tinyVersions.keywords.browse'],
    ['想', 'tinyVersions.keywords.think'], ['思', 'tinyVersions.keywords.ponder'],
    ['考', 'tinyVersions.keywords.consider'],
    ['涂', 'tinyVersions.keywords.doodle'], ['颜色', 'tinyVersions.keywords.color'],
    ['弹', 'tinyVersions.keywords.strum'], ['琴', 'tinyVersions.keywords.piano'],
    ['乐器', 'tinyVersions.keywords.instrument'],
    ['唱', 'tinyVersions.keywords.sing'],
    ['买', 'tinyVersions.keywords.buy'], ['购', 'tinyVersions.keywords.shop'],
    ['物', 'tinyVersions.keywords.item'],
    ['修', 'tinyVersions.keywords.fix'], ['补', 'tinyVersions.keywords.patch'],
    ['理', 'tinyVersions.keywords.arrange'],
    ['送', 'tinyVersions.keywords.deliver'], ['寄', 'tinyVersions.keywords.mail'],
    ['快递', 'tinyVersions.keywords.package'], ['信', 'tinyVersions.keywords.letter'],
    ['旅', 'tinyVersions.keywords.journey'], ['游', 'tinyVersions.keywords.trip'],
    ['玩', 'tinyVersions.keywords.play'],
    ['瑜伽', 'tinyVersions.keywords.yoga'], ['冥想', 'tinyVersions.keywords.meditate'],
    ['静', 'tinyVersions.keywords.quiet'],
    ['邮件', 'tinyVersions.keywords.email'],
    ['查', 'tinyVersions.keywords.check'], ['搜', 'tinyVersions.keywords.search'],
    ['找', 'tinyVersions.keywords.find'],
    ['备', 'tinyVersions.keywords.prepare'], ['准', 'tinyVersions.keywords.ready'],
    ['计划', 'tinyVersions.keywords.plan'],
    ['礼', 'tinyVersions.keywords.gift'],
    ['照', 'tinyVersions.keywords.camera'], ['相', 'tinyVersions.keywords.photograph'],
    ['泡', 'tinyVersions.keywords.brew'], ['饮', 'tinyVersions.keywords.beverage'],
  ],
  en: [
    ['write', 'tinyVersions.keywords.write'], ['writing', 'tinyVersions.keywords.text'],
    ['journal', 'tinyVersions.keywords.journal'], ['article', 'tinyVersions.keywords.article'],
    ['run', 'tinyVersions.keywords.run'], ['walk', 'tinyVersions.keywords.walk'],
    ['exercise', 'tinyVersions.keywords.exercise'], ['gym', 'tinyVersions.keywords.gym'],
    ['move', 'tinyVersions.keywords.move'],
    ['draw', 'tinyVersions.keywords.draw'], ['snap', 'tinyVersions.keywords.snap'],
    ['photo', 'tinyVersions.keywords.photo'], ['video', 'tinyVersions.keywords.video'],
    ['read', 'tinyVersions.keywords.read'], ['book', 'tinyVersions.keywords.book'],
    ['call', 'tinyVersions.keywords.phone'], ['talk', 'tinyVersions.keywords.chat'],
    ['contact', 'tinyVersions.keywords.contact'], ['phone', 'tinyVersions.keywords.phone'],
    ['study', 'tinyVersions.keywords.study'], ['learn', 'tinyVersions.keywords.practice'],
    ['cook', 'tinyVersions.keywords.eat'], ['eat', 'tinyVersions.keywords.eat'],
    ['make', 'tinyVersions.keywords.make'], ['boil', 'tinyVersions.keywords.boil'],
    ['dish', 'tinyVersions.keywords.dish'],
    ['clean', 'tinyVersions.keywords.clean'], ['tidy', 'tinyVersions.keywords.tidy'],
    ['organize', 'tinyVersions.keywords.organize'],
    ['sleep', 'tinyVersions.keywords.sleep'], ['rest', 'tinyVersions.keywords.rest'],
    ['lie', 'tinyVersions.keywords.lie'],
    ['listen', 'tinyVersions.keywords.listen'], ['song', 'tinyVersions.keywords.song'],
    ['music', 'tinyVersions.keywords.music'],
    ['water', 'tinyVersions.keywords.water_plant'], ['flower', 'tinyVersions.keywords.flower'],
    ['plant', 'tinyVersions.keywords.plant'],
    ['wash', 'tinyVersions.keywords.wash'], ['rinse', 'tinyVersions.keywords.rinse'],
    ['face', 'tinyVersions.keywords.face'],
    ['laugh', 'tinyVersions.keywords.laugh'], ['watch', 'tinyVersions.keywords.watch'],
    ['show', 'tinyVersions.keywords.show'], ['movie', 'tinyVersions.keywords.movie'],
    ['drink', 'tinyVersions.keywords.drink_water'], ['tea', 'tinyVersions.keywords.tea'],
    ['coffee', 'tinyVersions.keywords.coffee'],
    ['go', 'tinyVersions.keywords.go'], ['door', 'tinyVersions.keywords.door'],
    ['stroll', 'tinyVersions.keywords.stroll'], ['browse', 'tinyVersions.keywords.browse'],
    ['think', 'tinyVersions.keywords.think'], ['ponder', 'tinyVersions.keywords.ponder'],
    ['consider', 'tinyVersions.keywords.consider'],
    ['doodle', 'tinyVersions.keywords.doodle'], ['color', 'tinyVersions.keywords.color'],
    ['strum', 'tinyVersions.keywords.strum'], ['piano', 'tinyVersions.keywords.piano'],
    ['instrument', 'tinyVersions.keywords.instrument'],
    ['sing', 'tinyVersions.keywords.sing'],
    ['buy', 'tinyVersions.keywords.buy'], ['shop', 'tinyVersions.keywords.shop'],
    ['item', 'tinyVersions.keywords.item'],
    ['fix', 'tinyVersions.keywords.fix'], ['patch', 'tinyVersions.keywords.patch'],
    ['arrange', 'tinyVersions.keywords.arrange'],
    ['deliver', 'tinyVersions.keywords.deliver'], ['mail', 'tinyVersions.keywords.mail'],
    ['package', 'tinyVersions.keywords.package'], ['letter', 'tinyVersions.keywords.letter'],
    ['journey', 'tinyVersions.keywords.journey'], ['trip', 'tinyVersions.keywords.trip'],
    ['play', 'tinyVersions.keywords.play'],
    ['yoga', 'tinyVersions.keywords.yoga'], ['meditate', 'tinyVersions.keywords.meditate'],
    ['quiet', 'tinyVersions.keywords.quiet'],
    ['email', 'tinyVersions.keywords.email'],
    ['check', 'tinyVersions.keywords.check'], ['search', 'tinyVersions.keywords.search'],
    ['find', 'tinyVersions.keywords.find'],
    ['prepare', 'tinyVersions.keywords.prepare'], ['ready', 'tinyVersions.keywords.ready'],
    ['plan', 'tinyVersions.keywords.plan'],
    ['gift', 'tinyVersions.keywords.gift'],
    ['camera', 'tinyVersions.keywords.camera'], ['photograph', 'tinyVersions.keywords.photograph'],
    ['brew', 'tinyVersions.keywords.brew'], ['beverage', 'tinyVersions.keywords.beverage'],
  ],
  es: [
    ['escribir', 'tinyVersions.keywords.write'], ['escribo', 'tinyVersions.keywords.text'],
    ['diario', 'tinyVersions.keywords.journal'], ['artículo', 'tinyVersions.keywords.article'],
    ['correr', 'tinyVersions.keywords.run'], ['caminar', 'tinyVersions.keywords.walk'],
    ['ejercicio', 'tinyVersions.keywords.exercise'], ['gimnasio', 'tinyVersions.keywords.gym'],
    ['mover', 'tinyVersions.keywords.move'],
    ['dibujar', 'tinyVersions.keywords.draw'], ['foto', 'tinyVersions.keywords.snap'],
    ['foto', 'tinyVersions.keywords.photo'], ['video', 'tinyVersions.keywords.video'],
    ['leer', 'tinyVersions.keywords.read'], ['libro', 'tinyVersions.keywords.book'],
    ['llamar', 'tinyVersions.keywords.phone'], ['hablar', 'tinyVersions.keywords.chat'],
    ['contacto', 'tinyVersions.keywords.contact'], ['teléfono', 'tinyVersions.keywords.phone'],
    ['estudiar', 'tinyVersions.keywords.study'], ['aprender', 'tinyVersions.keywords.practice'],
    ['cocinar', 'tinyVersions.keywords.eat'], ['comer', 'tinyVersions.keywords.eat'],
    ['hacer', 'tinyVersions.keywords.make'], ['hervir', 'tinyVersions.keywords.boil'],
    ['plato', 'tinyVersions.keywords.dish'],
    ['limpiar', 'tinyVersions.keywords.clean'], ['ordenar', 'tinyVersions.keywords.tidy'],
    ['organizar', 'tinyVersions.keywords.organize'],
    ['dormir', 'tinyVersions.keywords.sleep'], ['descansar', 'tinyVersions.keywords.rest'],
    ['acostar', 'tinyVersions.keywords.lie'],
    ['escuchar', 'tinyVersions.keywords.listen'], ['canción', 'tinyVersions.keywords.song'],
    ['música', 'tinyVersions.keywords.music'],
    ['regar', 'tinyVersions.keywords.water_plant'], ['flor', 'tinyVersions.keywords.flower'],
    ['planta', 'tinyVersions.keywords.plant'],
    ['lavar', 'tinyVersions.keywords.wash'], ['enjuagar', 'tinyVersions.keywords.rinse'],
    ['cara', 'tinyVersions.keywords.face'],
    ['reír', 'tinyVersions.keywords.laugh'], ['ver', 'tinyVersions.keywords.watch'],
    ['serie', 'tinyVersions.keywords.show'], ['película', 'tinyVersions.keywords.movie'],
    ['beber', 'tinyVersions.keywords.drink_water'], ['té', 'tinyVersions.keywords.tea'],
    ['agua', 'tinyVersions.keywords.water'], ['café', 'tinyVersions.keywords.coffee'],
    ['salir', 'tinyVersions.keywords.go'], ['puerta', 'tinyVersions.keywords.door'],
    ['pasear', 'tinyVersions.keywords.stroll'], ['recorrer', 'tinyVersions.keywords.browse'],
    ['pensar', 'tinyVersions.keywords.think'], ['reflexionar', 'tinyVersions.keywords.ponder'],
    ['considerar', 'tinyVersions.keywords.consider'],
    ['garabatear', 'tinyVersions.keywords.doodle'], ['color', 'tinyVersions.keywords.color'],
    ['rasguear', 'tinyVersions.keywords.strum'], ['piano', 'tinyVersions.keywords.piano'],
    ['instrumento', 'tinyVersions.keywords.instrument'],
    ['cantar', 'tinyVersions.keywords.sing'],
    ['comprar', 'tinyVersions.keywords.buy'], ['tienda', 'tinyVersions.keywords.shop'],
    ['objeto', 'tinyVersions.keywords.item'],
    ['arreglar', 'tinyVersions.keywords.fix'], ['remendar', 'tinyVersions.keywords.patch'],
    ['organizar', 'tinyVersions.keywords.arrange'],
    ['enviar', 'tinyVersions.keywords.deliver'], ['correo', 'tinyVersions.keywords.mail'],
    ['paquete', 'tinyVersions.keywords.package'], ['carta', 'tinyVersions.keywords.letter'],
    ['viaje', 'tinyVersions.keywords.journey'], ['viajar', 'tinyVersions.keywords.trip'],
    ['jugar', 'tinyVersions.keywords.play'],
    ['yoga', 'tinyVersions.keywords.yoga'], ['meditar', 'tinyVersions.keywords.meditate'],
    ['quieto', 'tinyVersions.keywords.quiet'],
    ['correo', 'tinyVersions.keywords.email'],
    ['buscar', 'tinyVersions.keywords.check'], ['investigar', 'tinyVersions.keywords.search'],
    ['encontrar', 'tinyVersions.keywords.find'],
    ['preparar', 'tinyVersions.keywords.prepare'], ['listo', 'tinyVersions.keywords.ready'],
    ['planificar', 'tinyVersions.keywords.plan'],
    ['regalo', 'tinyVersions.keywords.gift'],
    ['cámara', 'tinyVersions.keywords.camera'], ['fotografía', 'tinyVersions.keywords.photograph'],
    ['preparar', 'tinyVersions.keywords.brew'], ['bebida', 'tinyVersions.keywords.beverage'],
  ],
};

function getTodayKey(): string {
  const d = new Date();
  return `meaning_session_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `meaning_session_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

function getFormattedDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const WORDS_KEY = 'nicep_words_wall';
const MAX_DAYS = 7;

export function useMemory() {
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);

  const hasNegativeWord = useCallback((text: string): boolean => {
    const words = NEGATIVE_WORDS[lang];
    return words.some((w) => text.toLowerCase().includes(w));
  }, [lang]);

  const getNegativeWord = useCallback((text: string): string | undefined => {
    const words = NEGATIVE_WORDS[lang];
    return words.find((w) => text.toLowerCase().includes(w));
  }, [lang]);

  const saveSession = useCallback((data: SessionData) => {
    const session = { ...data, timestamp: Date.now() };
    localStorage.setItem(getTodayKey(), JSON.stringify(session));
  }, []);

  const loadYesterday = useCallback((): string | null => {
    const yk = getYesterdayKey();
    const yesterday = localStorage.getItem(yk);
    if (!yesterday) return null;
    try {
      const data: SessionData = JSON.parse(yesterday);
      return data.sparkText || data.acceptText || null;
    } catch {
      return null;
    }
  }, []);

  const generateTinyVersion = useCallback((text: string): string => {
    const keywords = TINY_KEYWORDS[lang];
    const lower = text.toLowerCase();
    for (const [keyword, translationKey] of keywords) {
      if (lower.includes(keyword)) {
        return t(translationKey);
      }
    }
    return t('tinyVersions.fallback');
  }, [lang, t]);

  // Words Wall functions
  const loadWords = useCallback((): MemoryRecord[] => {
    try {
      const data = localStorage.getItem(WORDS_KEY);
      if (!data) return [];
      const records: MemoryRecord[] = JSON.parse(data);
      const cutoff = Date.now() - MAX_DAYS * 24 * 60 * 60 * 1000;
      return records.filter((r) => {
        const d = new Date(r.date);
        return d.getTime() > cutoff;
      });
    } catch {
      return [];
    }
  }, []);

  const loadLastWord = useCallback((): { text: string; date: string } | null => {
    try {
      const data = localStorage.getItem(WORDS_KEY);
      if (!data) return null;
      const records: MemoryRecord[] = JSON.parse(data);
      if (records.length === 0) return null;
      return { text: records[0].text, date: records[0].date };
    } catch {
      return null;
    }
  }, []);

  const addWord = useCallback((record: Omit<MemoryRecord, 'date'>) => {
    try {
      const existing = loadWords();
      const newRecord: MemoryRecord = { ...record, date: getFormattedDate() };
      const filtered = existing.filter(
        (r) => !(r.date === newRecord.date && r.text === newRecord.text)
      );
      const updated = [newRecord, ...filtered].slice(0, 100);
      localStorage.setItem(WORDS_KEY, JSON.stringify(updated));
    } catch {
      // silently fail
    }
  }, [loadWords]);

  const exportWords = useCallback((records: MemoryRecord[]): string => {
    const acceptLabel = t('memory.exportAccept');
    const sparkLabel = t('memory.exportSpark');
    const socraticPrefix = t('memory.exportSocraticPrefix');

    const lines = records.map((r) => {
      const prefix = r.path === 'accept' ? acceptLabel : sparkLabel;
      return `${r.date} ${prefix}\n${r.text}${r.socratic ? '\n' + socraticPrefix + r.socratic : ''}\n`;
    });
    return lines.join('\n---\n\n');
  }, [t]);

  return useMemo(
    () => ({
      hasNegativeWord,
      getNegativeWord,
      saveSession,
      loadYesterday,
      loadLastWord,
      generateTinyVersion,
      loadWords,
      addWord,
      exportWords,
    }),
    [hasNegativeWord, getNegativeWord, saveSession, loadYesterday, loadLastWord, generateTinyVersion, loadWords, addWord, exportWords]
  );
}
