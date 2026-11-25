import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { SUBJECTS, GROUP_SIZE } from './data/index.js';
import { LETTERS, burst, celebrate, shuffledLetters, usePersistentState } from './lib/utils.js';
import { AnimatedNumber, Background, ScoreRing } from './components/Bits.jsx';
import StudyGuide from './components/StudyGuide.jsx';
import Quiz, { Navigator } from './components/Quiz.jsx';
import { Logo, Moon, Sun, Reset } from './components/Icons.jsx';

const emptyPicks = () => Object.fromEntries(Object.keys(SUBJECTS).map((k) => [k, {}]));

function stats(subject, picks, from = 0, to = subject.questions.length) {
  let answered = 0, correct = 0;
  for (let i = from; i < to; i++) {
    const p = picks[i];
    if (p) { answered++; if (p === subject.questions[i].a) correct++; }
  }
  return { answered, correct };
}

export default function App() {
  const [theme, setTheme] = usePersistentState('mcq.theme', 'dark');
  const [subjectKey, setSubjectKey] = usePersistentState('mcq.subject', 'midterm');
  const [group, setGroup] = usePersistentState('mcq.group', 0);
  const [within, setWithin] = usePersistentState('mcq.within', 0);
  const [view, setView] = usePersistentState('mcq.view', 'study');
  const [allPicks, setAllPicks] = usePersistentState('mcq.picks', emptyPicks());
  const [shuffle, setShuffle] = usePersistentState('mcq.shuffle', false);
  const [revealed, setRevealed] = useState({});
  const [direction, setDirection] = useState(1);
  const [streak, setStreak] = useState(0);
  const [modal, setModal] = useState(null);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const subject = SUBJECTS[subjectKey] ?? SUBJECTS.midterm;
  const picks = allPicks[subject.key] ?? {};
  const total = subject.questions.length;
  const groupCount = Math.ceil(total / GROUP_SIZE);
  const g = Math.min(group, groupCount - 1);
  const start = g * GROUP_SIZE;
  const size = Math.min(GROUP_SIZE, total - start);
  const w = Math.min(within, size - 1);
  const index = start + w;
  const gStats = stats(subject, picks, start, start + size);
  const sStats = stats(subject, picks);
  const overall = useMemo(() => Object.values(SUBJECTS).reduce((acc, s) => {
    const st = stats(s, allPicks[s.key] ?? {});
    return { answered: acc.answered + st.answered, correct: acc.correct + st.correct, total: acc.total + s.questions.length };
  }, { answered: 0, correct: 0, total: 0 }), [allPicks]);

  const explanation = useMemo(() => {
    const q = subject.questions[index];
    if (subject.explanations?.[index]) return subject.explanations[index];
    const order = shuffle ? shuffledLetters(`${subject.key}-${index}`) : LETTERS;
    const disp = LETTERS[order.indexOf(q.a)];
    return `Option ${disp} — “${q.o[q.a]}” — is the correct answer. Link the key term in the question to this definition or process, and notice why the other options don’t fit.`;
  }, [subject, index, shuffle]);

  const selectSubject = (k) => { setSubjectKey(k); setGroup(0); setWithin(0); setView('study'); setStreak(0); };
  const selectGroup = (k) => { setDirection(k > g ? 1 : -1); setGroup(k); setWithin(0); setView('study'); };

  const onPick = (letter) => {
    setAllPicks((prev) => ({ ...prev, [subject.key]: { ...prev[subject.key], [index]: letter } }));
    setStreak((s) => (letter === subject.questions[index].a ? s + 1 : 0));
    const after = stats(subject, { ...picks, [index]: letter }, start, start + size);
    if (after.answered === size) {
      setTimeout(() => {
        setModal({ ...after, size, group: g });
        if (after.correct / size >= 0.7) celebrate();
      }, 900);
    }
  };

  const go = useCallback((delta) => {
    setDirection(delta);
    if (delta < 0) {
      if (w > 0) setWithin(w - 1);
      else if (g > 0) { setGroup(g - 1); setWithin(GROUP_SIZE - 1); setView('quiz'); }
    } else {
      if (w < size - 1) setWithin(w + 1);
      else if (g < groupCount - 1) { setGroup(g + 1); setWithin(0); setView('study'); }
      else setModal({ ...gStats, size, group: g, final: true });
    }
  }, [w, g, size, groupCount, gStats, setWithin, setGroup, setView]);

  const resetGroup = () => {
    setAllPicks((prev) => {
      const next = { ...prev[subject.key] };
      for (let i = start; i < start + size; i++) delete next[i];
      return { ...prev, [subject.key]: next };
    });
    setRevealed({});
    setWithin(0);
    setStreak(0);
    setModal(null);
  };

  const revealKey = `${subject.key}-${index}`;
  const toggleReveal = () => setRevealed((r) => ({ ...r, [revealKey]: !r[revealKey] }));

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || modal) return;
      if (view === 'study') {
        if (e.key === 'Enter') { e.preventDefault(); setView('quiz'); }
        return;
      }
      const k = e.key.toUpperCase();
      const pos = ['1', '2', '3', '4'].indexOf(k) >= 0 ? Number(k) - 1 : LETTERS.indexOf(k);
      if (pos >= 0 && e.key.length === 1) {
        if (picks[index]) return;
        const order = shuffle ? shuffledLetters(`${subject.key}-${index}`) : LETTERS;
        const orig = order[pos];
        onPick(orig);
        if (orig === subject.questions[index].a) burst(document.querySelector(`.option[data-key="${orig}"]:not(:disabled)`));
      } else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (k === 'R') toggleReveal();
      else if (k === 'G') setView('study');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <MotionConfig reducedMotion="user">
      <Background />
      <main className="wrap">
        <motion.header className="header" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="brand">
            <motion.div className="logo" initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }} whileHover={{ rotate: 8, scale: 1.06 }}>
              <Logo />
            </motion.div>
            <div>
              <div className="eyebrow">Interactive exam prep</div>
              <h1 className="title">MCQ <span className="grad-text">Study Room</span></h1>
            </div>
          </div>
          <div className="header-actions">
            <div className="stat-pill">
              <ScoreRingMini value={overall.answered} total={overall.total} />
              <span><b><AnimatedNumber value={overall.answered} /></b> / {overall.total}<span className="hide-sm"> answered</span></span>
            </div>
            <motion.button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              whileTap={{ scale: 0.88, rotate: 30 }} aria-label="Toggle colour theme">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'grid' }}>
                  {theme === 'dark' ? <Sun /> : <Moon />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.header>

        <LayoutGroup id="subjects">
          <nav className="subjects">
            {Object.values(SUBJECTS).map((s, i) => {
              const st = stats(s, allPicks[s.key] ?? {});
              const active = s.key === subject.key;
              return (
                <motion.button key={s.key} className="subject" style={{ '--accent': s.hue }} onClick={() => selectSubject(s.key)}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i + 0.1 }}
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} aria-pressed={active}>
                  {active && <motion.div layoutId="subject-active" className="active-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <div className="subject-top">
                    <span className="subject-emoji">{s.emoji}</span>
                    <span className="subject-badge">{s.questions.length} Q</span>
                  </div>
                  <div className="subject-text">
                    <div className="subject-name">{s.name}</div>
                    <div className="subject-tag">{s.tagline}</div>
                  </div>
                  <div className="mini-bar">
                    <motion.div initial={false} animate={{ width: `${(st.answered / s.questions.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                  </div>
                </motion.button>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="section-row">
          <span className="section-label">Groups</span>
          <span className="section-meta">
            {sStats.answered}/{total} answered · {sStats.correct} correct
            {sStats.answered > 0 && <> · {Math.round((sStats.correct / sStats.answered) * 100)}% accuracy</>}
          </span>
        </div>
        <LayoutGroup id="groups">
          <nav className="groups" style={{ '--accent': subject.hue }}>
            {Array.from({ length: groupCount }, (_, k) => {
              const gs = Math.min(GROUP_SIZE, total - k * GROUP_SIZE);
              const st = stats(subject, picks, k * GROUP_SIZE, k * GROUP_SIZE + gs);
              return (
                <motion.button key={`${subject.key}-${k}`} className="group" onClick={() => selectGroup(k)}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.03 * k }}
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} aria-pressed={k === g}>
                  {k === g && <motion.div layoutId="group-active" className="active-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  {st.answered === gs && <span className="done-dot" />}
                  <strong>Group {k + 1}</strong>
                  <span>{st.answered}/{gs} · {st.correct} ✓</span>
                </motion.button>
              );
            })}
          </nav>
        </LayoutGroup>

        <div className="section-row" style={{ marginTop: 20 }}>
          <span className="section-label">
            {subject.short} · Group {g + 1} · Q{start + 1}–{start + size}
          </span>
          <span className="section-meta">{gStats.answered}/{size} answered · {gStats.correct} correct</span>
        </div>
        <div className="track" style={{ margin: '0 0 18px' }}>
          <motion.div className="fill" initial={false} animate={{ width: `${(gStats.answered / size) * 100}%` }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} />
        </div>

        <AnimatePresence mode="wait">
          {view === 'study' ? (
            <StudyGuide key={`study-${subject.key}-${g}`} subject={subject} group={g} guide={subject.guides?.[g]}
              range={[start + 1, start + size]} answered={gStats.answered} onStart={() => setView('quiz')} />
          ) : (
            <motion.div key={`quiz-${subject.key}-${g}`}>
              <Quiz
                subject={subject} index={index} within={w} size={size} direction={direction}
                chosen={picks[index]} revealed={!!revealed[revealKey]} shuffle={shuffle} streak={streak}
                onPick={onPick} onReveal={toggleReveal} onPrev={() => go(-1)} onNext={() => go(1)}
                onGuide={() => setView('study')} onToggleShuffle={() => setShuffle(!shuffle)}
                isFirst={g === 0 && w === 0} isLast={g === groupCount - 1 && w === size - 1}
                explanation={explanation}
              />
              <Navigator subject={subject} start={start} size={size} within={w} picks={picks}
                onJump={(k) => { setDirection(k > w ? 1 : -1); setWithin(k); }} onReset={resetGroup} />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="foot">
          Progress is saved in this browser. Shortcuts: <span className="kbd">1–4</span> answer · <span className="kbd">←</span>
          <span className="kbd">→</span> navigate · <span className="kbd">R</span> reveal · <span className="kbd">G</span> guide · <span className="kbd">Enter</span> start
        </p>
      </main>

      <AnimatePresence>
        {modal && (
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)}>
            <motion.div className="glass modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true"
              initial={{ opacity: 0, scale: 0.85, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
              <div style={{ display: 'grid', placeItems: 'center' }}>
                <ScoreRing value={modal.correct} total={modal.size} size={132} label="score" />
              </div>
              <h3>{modal.correct / modal.size >= 0.85 ? 'Outstanding! 🎉' : modal.correct / modal.size >= 0.6 ? 'Nice work! 💪' : 'Keep practising 📚'}</h3>
              <p>{subject.name} · Group {modal.group + 1}{modal.final ? ' — end of subject' : ''}</p>
              <div className="modal-stats">
                <div><b>{modal.correct}</b><span>Correct</span></div>
                <div><b>{modal.answered - modal.correct}</b><span>Wrong</span></div>
                <div><b>{modal.size - modal.answered}</b><span>Skipped</span></div>
              </div>
              <div className="modal-actions">
                <button className="btn" onClick={resetGroup}><Reset /> Retry group</button>
                {modal.group < groupCount - 1 ? (
                  <button className="btn primary" onClick={() => { setModal(null); selectGroup(modal.group + 1); }}>Next group →</button>
                ) : (
                  <button className="btn primary" onClick={() => setModal(null)}>Done</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function ScoreRingMini({ value, total }) {
  const r = 10, c = 2 * Math.PI * r;
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
      <circle cx="13" cy="13" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="4" />
      <motion.circle cx="13" cy="13" r={r} fill="none" stroke="var(--c2)" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} initial={false} animate={{ strokeDashoffset: c * (1 - (total ? value / total : 0)) }} />
    </svg>
  );
}
