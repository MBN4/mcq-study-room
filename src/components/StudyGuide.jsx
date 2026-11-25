import { motion } from 'framer-motion';
import { Play } from './Icons.jsx';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 260, damping: 26 } },
};

export default function StudyGuide({ subject, group, guide, range, onStart, answered }) {
  return (
    <motion.section
      className="glass study"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
    >
      <div className="kicker grad-text">{subject.name} · Group {group + 1} · Study first</div>
      <h2>{guide?.title ?? `Group ${group + 1}`}</h2>
      <p className="study-intro">{guide?.intro ?? 'Review the key ideas for this group before attempting the questions.'}</p>

      <motion.div className="blocks" variants={container} initial="hidden" animate="show">
        {(guide?.blocks ?? []).map(([title, body, formula], i) => (
          <motion.article className="block" key={title + i} variants={item} whileHover={{ x: 4 }}>
            <h3><span className="num">{String(i + 1).padStart(2, '0')}</span>{title}</h3>
            <p>{body}</p>
            {formula ? <div className="formula">{formula}</div> : null}
          </motion.article>
        ))}
      </motion.div>

      <div className="study-foot">
        <span className="hint">
          Questions {range[0]}–{range[1]} · {answered ? `${answered} already answered` : 'not started yet'}
        </span>
        <motion.button className="btn primary" onClick={onStart} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Play /> {answered ? 'Continue' : 'Start'} Group {group + 1}
        </motion.button>
      </div>
    </motion.section>
  );
}
