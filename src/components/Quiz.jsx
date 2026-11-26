import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowL, ArrowR, Book, Check, Eye, Flame, Info, Reset, X } from './Icons.jsx';
import { LETTERS, burst, shuffledLetters } from '../lib/utils.js';

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 60, filter: 'blur(4px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (dir) => ({ opacity: 0, x: dir * -60, filter: 'blur(4px)' }),
};

const optList = { show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } };
const optItem = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 30 } } };

function Mark({ ok }) {
  return (
    <motion.svg className="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"
      style={{ color: ok ? 'var(--good)' : 'var(--bad)' }}>
      {ok ? (
        <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35 }} />
      ) : (
        <motion.path d="M6 6l12 12M18 6L6 18" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
      )}
    </motion.svg>
  );
}

export default function Quiz({
  subject, index, within, size, direction, chosen, revealed, shuffle, streak,
  onPick, onReveal, onPrev, onNext, onGuide, onToggleShuffle, isFirst, isLast, explanation,
}) {
  const q = subject.questions[index];
  const order = shuffle ? shuffledLetters(`${subject.key}-${index}`) : LETTERS;
  const displayOf = (orig) => LETTERS[order.indexOf(orig)];
  const optRefs = useRef({});
  const answered = !!chosen;
  const correct = chosen === q.a;
  const showExplain = revealed || correct;

  const pick = (orig) => {
    if (answered) return;
    onPick(orig);
    if (orig === q.a) burst(optRefs.current[orig]);
  };

  return (
    <motion.section
      className="glass quiz"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
    >
      <div className="quiz-top">
        <span className="qnum">QUESTION <b>{String(within + 1).padStart(2, '0')}</b> / {size}</span>
        <div className="toolbar">
          <AnimatePresence>
            {streak >= 2 && (
              <motion.span className="streak" key="streak"
                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                <Flame width={15} height={15} />
                <motion.span key={streak} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{streak}</motion.span> streak
              </motion.span>
            )}
          </AnimatePresence>
          <button className="toggle" aria-pressed={shuffle} onClick={onToggleShuffle} title="Shuffle the order of answer options">
            <span className="switch"><i /></span> Shuffle options
          </button>
          <button className="btn small ghost" onClick={onGuide} title="Back to study guide (G)"><Book /> Guide</button>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={`${subject.key}-${index}-${shuffle}`}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          <h2 className="question">{q.q}</h2>

          <motion.div className="options" variants={optList} initial="hidden" animate="show">
            {order.map((orig) => {
              const isAnswer = orig === q.a;
              const isChosen = orig === chosen;
              const state =
                (answered || revealed) && isAnswer ? 'correct'
                : answered && isChosen ? 'wrong'
                : answered ? 'dim' : '';
              return (
                <motion.div key={orig} variants={optItem}>
                  <motion.button
                    ref={(el) => (optRefs.current[orig] = el)}
                    className={`option ${state}`}
                    data-key={orig}
                    disabled={answered}
                    onClick={() => pick(orig)}
                    whileHover={answered ? undefined : { y: -2 }}
                    whileTap={answered ? undefined : { scale: 0.985 }}
                    animate={
                      isChosen && !isAnswer ? { x: [0, -9, 9, -6, 6, -2, 0] }
                      : isChosen && isAnswer ? { scale: [1, 1.025, 1] }
                      : { x: 0, scale: 1 }
                    }
                    transition={{ duration: 0.45 }}
                    aria-label={`Option ${displayOf(orig)}: ${q.o[orig]}`}
                  >
                    {state === 'correct' && (
                      <motion.span className="ripple" initial={{ boxShadow: '0 0 0 0 var(--good)' }}
                        animate={{ boxShadow: '0 0 0 14px transparent' }} transition={{ duration: 0.7 }} />
                    )}
                    <span className="letter">{displayOf(orig)}</span>
                    <span className="label">{q.o[orig]}</span>
                    {state === 'correct' && <Mark ok />}
                    {state === 'wrong' && <Mark ok={false} />}
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            key={answered ? (correct ? 'g' : 'b') : 'n'}
            className={`feedback ${answered ? (correct ? 'good' : 'bad') : ''}`}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          >
            {answered ? (correct ? <Check /> : <X />) : <Info />}
            {answered
              ? correct ? 'Correct — nicely done!' : 'Not quite. Reveal the answer, read the explanation, or revisit the guide (G).'
              : 'Pick an answer for instant feedback — or press 1–4 / A–D.'}
          </motion.div>

          <AnimatePresence initial={false}>
            {showExplain && (
              <motion.div className="explain" key="explain"
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
                <div className="explain-inner">
                  {revealed && !correct && (
                    <div className="answer-line">Correct answer: {displayOf(q.a)}. {q.o[q.a]}</div>
                  )}
                  <strong>Why this is correct</strong>
                  {explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="controls">
        <motion.button className="btn" onClick={onPrev} disabled={isFirst} whileTap={{ scale: 0.95 }}>
          <ArrowL /> <span className="txt">Previous</span>
        </motion.button>
        <div className="controls-mid">
          {!correct && (
            <motion.button className="btn" onClick={onReveal} whileTap={{ scale: 0.95 }} title="Reveal answer (R)">
              <Eye /> <span className="txt">{revealed ? 'Hide' : 'Reveal'}</span>
            </motion.button>
          )}
        </div>
        <motion.button className="btn primary" onClick={onNext} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
          <span className="txt">{isLast ? 'Finish' : within === size - 1 ? 'Next group' : 'Next'}</span> <ArrowR />
        </motion.button>
      </div>
    </motion.section>
  );
}

export function Navigator({ subject, start, size, within, picks, onJump, onReset, wrongCount, onRetryWrong }) {
  return (
    <motion.div className="glass navigator" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <div className="nav-head">
        <span className="section-label">Question map</span>
        <div className="legend">
          <span><i style={{ background: 'var(--good)' }} />Correct</span>
          <span><i style={{ background: 'var(--bad)' }} />Wrong</span>
          <span><i style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }} />Open</span>
          {wrongCount > 0 && (
            <button className="btn small ghost" onClick={onRetryWrong} title="Clear only the questions you got wrong and try them again">
              <Reset /> Retry {wrongCount} wrong
            </button>
          )}
          <button className="btn small ghost" onClick={onReset} title="Clear answers in this group"><Reset /> Reset group</button>
        </div>
      </div>
      <div className="dots">
        {Array.from({ length: size }, (_, k) => {
          const i = start + k;
          const p = picks[i];
          const cls = p ? (p === subject.questions[i].a ? 'ok' : 'no') : '';
          return (
            <motion.button key={k} className={`dot ${cls} ${k === within ? 'cur' : ''}`} onClick={() => onJump(k)}
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} layout
              aria-label={`Question ${k + 1}${cls === 'ok' ? ', correct' : cls === 'no' ? ', wrong' : ''}`}>
              {k + 1}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
