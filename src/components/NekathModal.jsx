import { motion, AnimatePresence } from 'framer-motion';

const nekathData = [
  {
    title: "නව සඳ බැලීම (New Moon Viewing)",
    desc: "අභිනව චන්ද්‍ර වර්ෂය සඳහා මාර්තු මස 20 වන සිකුරාදා දින ද, අභිතව සූර්ය වර්ෂය සඳහා අප්‍රේල් මස 19 වන ඉරිදාදිත ද නව සඳ බැලීම මැනව."
  },
  {
    title: "පරණ අවුරුද්ද සඳහා ස්නානය (Old Year Bathing)",
    desc: "අප්‍රේල් මස 13 වැනි සදු දින දිවුල් පත් යුෂ මිශ්‍ර නානු ගා ස්නානය කොට ඉෂ්ට දේවතා අනුස්මරණයේ යෙදී වාසය මැනවී."
  },
  {
    title: "අලූත් අවුරුදු උදාව (New Year Dawn)",
    desc: "අප්‍රේල් මස 14 වැනි අඟහරුවාදා පූර්ව භාග 09.32 ට සිංහල අලූත් අවුරුද්ද උදාවෙයි."
  },
  {
    title: "පුණ්‍ය කාලය (Punya Kalaya)",
    desc: "අප්‍රේල් මස 14 වැනි අගහරුවාදා පූර්ව භාග 03.08 සිට එදිනම අපර භාග 03.56 දක්වා පුණ්‍ය කාලය බැවින් අප්‍රේල් මස 14 වන අගහරුවාදා පූර්ව භාග 03.08 ට පළමුව ආහාර පාන ගෙන සියලු වැඩ අත්හැර ආගමික වතාවත් වල යෙදීමද, පුණ්‍ය කාලයේ අපර කොටස එනම් අප්‍රේල් මස 14 වන අඟහරුවාදා පූර්ව භාග 09.32 සිට එදින අපර භාග 08.56 දක්වා ආහාර පිසීම, වැඩ ඇල්ලීම, ගණුදෙනු කිරීම හා ආහාර අනුභවය ආදී නැකත් චාරිත්‍ර විධි ඉටු කිරීම මැනවි."
  },
  {
    title: "ආහාර පිසීම (Lighting the Hearth)",
    desc: "අප්‍රේල් මස 14 වෙනි අගහරුවාදා පූර්ව භාග 10.41 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා ලිප් බැඳ ගිණි මොලවා කිරි බතක්ද, කැවිලි වර්ගයක්ද, දී කිරි වලද ද, පිලියෙල කර ගැනීම මැනවි."
  },
  {
    title: "වැඩ ඇල්ලීම, ගණුදෙනු කිරීම හා ආහාර අනුභවය (First Meal & Work)",
    desc: "අප්‍රේල් මස 14 වෙනි අඟහරුවාදා අපර භාග 12.05 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා සියලු වැඩ අල්ලා ගනුදෙනු කොට ආහාර අනුභවය කිරීම මැනවි."
  },
  {
    title: "හිසතෙල් ගෑම (Oil Anointing)",
    desc: "අප්‍රේල් මස 15 වෙහි බදාදා පූර්ව භාග 06.54 ට නැගෙනහිර දිශාව බලා හිසට කොහොඹ පත්ද, පයට කොළොන් පද, තබා පච්ච වර්ගා වස්ත්‍රාභරණයෙන් සැරසී කොහොඹ පත් යුෂ මිශ්‍ර නානු හා තෙල් ගා ස්නානය කිරීම මැනවි."
  },
  {
    title: "රැකී රක්ෂා සඳහා පිටත්ව යෑම (Leaving for Work)",
    desc: "අප්‍රේල් මස 20 වැනි සඳුදා පූර්ව භාග 06.27 ට ශ්වේත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී කිරිබත් සහ එළකිරි මිශ්‍ර කැවිලිද අනුභව කර දකුණු දිශාව බලා පිටත් වීම මැනවි."
  },
  {
    title: "පැළ සිටුවීමට (Planting)",
    desc: "අප්‍රේල් මස 23 වැනි බ්‍රහස්පතින්දා රන්වන් පැහැති වස්ත්‍රාභරණයෙන් සැරසී පූර්ව භාග 11.36 ට උතුරු දිශාව බලා පැළ සිටුවීම මැනවි."
  }
];

export default function NekathModal({ show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop and Modal Wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: 480,
                maxHeight: '90vh',
                position: 'relative',
                padding: '2.5rem 1.5rem 2rem',
                overflowY: 'auto',
                border: '1px solid rgba(255,215,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                width: 32,
                height: 32,
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>

            <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🪔</div>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFD700, #F5A623)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
              }}>
                Aurudu Nekath 2026
              </h2>
              <p style={{ color: 'rgba(255,248,231,0.5)', fontSize: '0.9rem' }}>
                සිංහල අලුත් අවුරුදු සුභ නැකත්
              </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {nekathData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    paddingBottom: '1.5rem',
                    borderBottom: index < nekathData.length - 1 ? '1px solid rgba(255,248,231,0.1)' : 'none'
                  }}
                >
                  <h3 style={{
                    color: '#FFD700',
                    fontWeight: 700,
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ color: '#F5A623' }}>•</span> {item.title}
                  </h3>
                  <p style={{
                    color: 'rgba(255,248,231,0.8)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    textAlign: 'justify'
                  }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <footer style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                className="btn-gold"
                style={{ padding: '0.8rem 2.5rem', width: '100%' }}
                onClick={onClose}
              >
                Close
              </button>
            </footer>
          </motion.div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
  );
}
