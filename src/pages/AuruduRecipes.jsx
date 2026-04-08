import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// import { speak } from '../utils/speech'; // මෙය ඔබට අවශ්‍ය නම් පමණක් තබාගන්න

export default function AuruduRecipes() {
  const navigate = useNavigate();
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const recipes = [
    {
      id: 1,
      name: "කිරිබත්",
      englishName: "Kiribath (Milk Rice)",
      emoji: "🍚",
      description: "සෞභාග්‍යය සංකේතවත් කරමින් අලුත් අවුරුදු උදාවත් සමඟ පිසිනු ලබන ප්‍රධානතම ආහාරයයි.",
      ingredients: ["සුදු කැකුළු සහල් 500g", "උකු මිටිකිරි කෝප්ප 2", "රස අනුව ලුණු", "වතුර කෝප්ප 4-5"],
      steps: [
        "සහල් සෝදා වතුර දමා බත් මඳක් වැඩිපුර තැම්බෙන සේ පිසගන්න.",
        "පොල්කිරි වලට ලුණු දිය කර බතට එක් කරන්න.",
        "පොල්කිරි බතට උරාගෙන කිරි ඉතිරෙන තෙක් මඳ ගින්නේ විනාඩි 10ක් තබා නිවෙන්නට හරින්න.",
        "තැටියකට දමා සමතලා කර දියමන්ති හැඩයට කපා පිරිනමන්න."
      ]
    },
    {
      id: 2,
      name: "කොකිස්",
      englishName: "Kokis (Crunchy Star)",
      emoji: "🌀",
      description: "අවුරුදු මේසයට හැඩය සහ ශබ්දය එක් කරන කරපින ලන ප්‍රණීත කැවිල්ලකි.",
      ingredients: ["කැකුළු හාල්පිටි 500g", "උකු මිටිකිරි කෝප්ප 2", "බිත්තර 1", "කහ කුඩු සහ ලුණු ස්වල්පයක්", "බැදීමට තෙල්"],
      steps: [
        "හාල්පිටි, කහ, ලුණු සහ බිත්තරය පොල්කිරි සමඟ මිශ්‍ර කර උකු දියරයක් සාදාගන්න.",
        "තෙල් තාච්චිය ලිප තබා කොකිස් අච්චුව තෙලේ දමා හොඳින් රත් කරන්න.",
        "රත් වූ අච්චුව පිටි මිශ්‍රණයේ (අඩක් පමණ) ගිල්වා නැවත තෙලට දමා ගසා ගලවා ගන්න.",
        "රන්වන් පැහැ වන තෙක් බැද තෙල් බේරාගන්න."
      ]
    },
    {
      id: 3,
      name: "කොණ්ඩ කැවුම්",
      englishName: "Konda Kavum (Oil Cake)",
      emoji: "🍮",
      description: "කැවිලි අතර රජු ලෙස සැලකෙන, ඉතා දක්ෂ ලෙස සාදාගත යුතු සාම්ප්‍රදායික කැවිල්ලකි.",
      ingredients: ["හාල්පිටි 500g", "පොල් හෝ කිතුල් පැණි 500ml", "සීනි 100g", "බැදීමට තෙල්"],
      steps: [
        "පැණි සහ සීනි රත් කර එයට හාල්පිටි එක් කර පදම් වීමට පැය කිහිපයක් තබන්න.",
        "රත් වූ තෙල් තාච්චියකට මිශ්‍රණයෙන් හැන්දක් වත් කරන්න.",
        "මැදින් ඉදිමී එන විට ඉරට්ටකින් කරකවමින් කොණ්ඩය සාදා තෙල් ඉසිමින් බැදගන්න."
      ]
    },
    {
      id: 4,
      name: "අලුවා",
      englishName: "Aluwa",
      emoji: "🍯",
      description: "සහල් පිටි සහ පැණි රසය මුසු වූ, ඉක්මනින් සාදාගත හැකි කැවිල්ලකි.",
      ingredients: ["බැදගත් හාල්පිටි 500g", "පැණි 500ml", "කැඩූ කජු සහ කරදමුංගු කුඩු"],
      steps: [
        "පැණි තාච්චියක දමා නූල් පදම එනතුරු රත් කර ලිපෙන් බාන්න.",
        "එයට කරදමුංගු, කජු සහ බැදගත් හාල්පිටි එක් කර වේගයෙන් කලවම් කරන්න.",
        "පිටි ඉසින ලද ලෑල්ලක් මත මිශ්‍රණය අතුරා නිවුණු පසු කෑලි කපාගන්න."
      ]
    },
    {
      id: 5,
      name: "ආස්මී",
      englishName: "Asmi",
      emoji: "🍪",
      description: "දැල් ආකාරයට සාදන, අවුරුදු මේසයට අලංකාරයක් එක් කරන උසස් කැවිල්ලකි.",
      ingredients: ["හාල්පිටි 500g", "ඝන පොල්කිරි", "දවුල් කුරුඳු කොළ යුෂ", "සීනි පැණි (ඉහළින් දැමීමට)"],
      steps: [
        "හාල්පිටි සහ පොල්කිරි මිශ්‍ර කර එයට දවුල් කුරුඳු යුෂ එක් කර ඇලෙන සුළු පිටි දියරයක් සාදාගන්න.",
        "සිදුරු සහිත හැන්දකින් රත් වූ තෙලට දැලක් මෙන් වත් කර බැදගන්න.",
        "දින කිහිපයකට පසු නැවත තෙලේ බැද ඉහළින් වර්ණ ගැන්වූ සීනි පැණි වත් කරන්න."
      ]
    },
    {
      id: 6,
      name: "මුං කැවුම්",
      englishName: "Mung Kavum",
      emoji: "💚",
      description: "මුං පිටි සහ පැණි රසය මුසු වූ පෝෂණීය කැවිල්ලකි.",
      ingredients: ["බැදගත් මුං පිටි 250g", "හාල්පිටි 250g", "පැණි 500ml", "බැදීමට තෙල්"],
      steps: [
        "පැණි රත් කර එයට මුං පිටි සහ හාල්පිටි එක් කර ඝන පදමට සාදා කැබලි කපාගන්න.",
        "එම කැබලි හාල්පිටි සහ පොල්කිරි මිශ්‍ර බැටර් එකක දවටාගන්න.",
        "ගැඹුරු තෙලේ රන්වන් පැහැ වන තුරු බැදගන්න."
      ]
    },
    {
      id: 7,
      name: "පැණි වළලු",
      englishName: "Unduwal (Pani Walalu)",
      emoji: "🌀",
      description: "උඳු පිටිවලින් සාදන, පැණි පිරුණු ඉතා ප්‍රණීත කැවිල්ලකි.",
      ingredients: ["උඳු පිටි 250g", "හාල්පිටි 100g", "කිතුල් පැණි 500ml", "පොල්කිරි"],
      steps: [
        "උඳු පිටි සහ හාල්පිටි පොල්කිරිවලින් අනා පැය 8ක් පදම් වීමට තබන්න.",
        "සිදුරක් සහිත රෙදි කඩකින් රත් වූ තෙලට වළලු ආකාරයට වත් කර බැදගන්න.",
        "බැදගත් වළලු කෙලින්ම සකසා ගත් උකු පැණි සිරප් එකට දමා පෙඟෙන්නට හරින්න."
      ]
    },
    {
      id: 8,
      name: "දොදොල්",
      englishName: "Dodol",
      emoji: "🤎",
      description: "පැණි සහ පොල්කිරි නටවා වැඩි වෙලාවක් හැඳිගෑමෙන් සාදාගන්නා රාජකීය රසකැවිල්ලකි.",
      ingredients: ["හාල්පිටි 500g", "කිතුල් පැණි 1L", "උකු පොල්කිරි 2L", "කජු"],
      steps: [
        "පොල්කිරි, පැණි සහ හාල්පිටි හොඳින් මිශ්‍ර කර තාච්චියක දමා ලිප තබන්න.",
        "මිශ්‍රණය ඝන වී තෙල් වෙන් වන තුරු පැය කිහිපයක් නොනවත්වා හැඳිගාන්න.",
        "තැටියකට දමා තද කර නිවුණු පසු කැබලි කපාගන්න."
      ]
    },
    {
      id: 9,
      name: "අග්ගලා",
      englishName: "Aggala",
      emoji: "🌕",
      description: "බැදගත් හාල් පිටි සහ පැණි මිශ්‍ර කර සාදාගන්නා ගුණදායක සාම්ප්‍රදායික කැවිල්ලකි.",
      ingredients: ["බැදගත් හාල්පිටි 500g", "පැණි හෝ සීනි සිරප්", "ගම්මිරිස් කුඩු ස්වල්පයක්", "ගාගත් පොල් ස්වල්පයක්"],
      steps: [
        "හාල්පිටි සහ ගාගත් පොල් මඳක් රන්වන් පැහැ වන තුරු බැදගන්න.",
        "එයට පැණි සහ රස අනුව ගම්මිරිස් කුඩු එකතු කර හොඳින් අනාගන්න.",
        "මිශ්‍රණය නිවෙන්නට පෙර කුඩා බෝල සකස් කර මතුපිටට පිටි ස්වල්පයක් තවරාගන්න."
      ]
    },
    {
      id: 10,
      name: "වැලි තලප",
      englishName: "Weli Thalapa",
      emoji: "🥞",
      description: "හාල්පිටි කැට හුමාලයෙන් තම්බා පැණි සමඟ මුසු කර සාදන පැරණි කැවිල්ලකි.",
      ingredients: ["හාල්පිටි 500g", "පැණි 500ml", "ලුණු ස්වල්පයක්"],
      steps: [
        "හාල්පිටිවලට ලුණු මිශ්‍ර කර වතුර ඉසිමින් කුඩා පිට්ටු කැට මෙන් සාදාගන්න.",
        "එම කැට විනාඩි 20ක් හුමාලයෙන් තම්බා ගන්න.",
        "රත් කළ නූල් පදම ආ පැණිවලට පිටි කැට එක් කර පදම් වන තෙක් කලවම් කර තැටියක අතුරා ගන්න."
      ]
    }
  ];

  /* // මෙම කොටස speak function එක සඳහා වේ. අවශ්‍ය නම් ඉවත් කරන්න.
  useEffect(() => {
    if (typeof speak === 'function') {
      speak('Avurudu Recipes');
    }
  }, []);
  */

  const toggleRecipe = (index) => {
    setExpandedRecipe(expandedRecipe === index ? null : index);
  };

  const handleBack = () => {
    navigate('/game-select');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <>
      <style>{`
        /* Container & Background */
        .aurudu-recipes-container {
          min-height: 100vh;
          padding: 40px 20px;
          font-family: 'Poppins', 'Abhaya Libre', sans-serif;
          color: #ffffff;
          /* Modern festive gradient background */
          background: linear-gradient(135deg, #2b0a18 0%, #611822 50%, #993322 100%);
          background-attachment: fixed;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Header Styles */
        .recipes-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
          width: 100%;
          max-width: 1200px;
        }

        .glowing-title {
          font-size: 2.8rem;
          margin-bottom: 10px;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
          color: #ffd700; /* Gold text */
        }

        .subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          letter-spacing: 1px;
        }

        /* Glassmorphism Back Button */
        .glass-back-button {
          position: absolute;
          left: 0;
          top: 10px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .glass-back-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        /* Grid Layout */
        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
          width: 100%;
          max-width: 1200px;
        }

        /* Glassmorphism Cards */
        .glass-card {
          background: rgba(255, 255, 255, 0.08); /* Transparent base */
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 25px;
          overflow: hidden;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
          transition: border-color 0.3s ease;
        }

        .glass-card:hover {
          border-color: rgba(255, 215, 0, 0.4); /* Glow gold on hover */
        }

        .glass-card.expanded {
          grid-column: 1 / -1; /* Take full width when expanded */
          background: rgba(255, 255, 255, 0.12);
        }

        /* Card Header */
        .recipe-header {
          display: flex;
          align-items: center;
          gap: 15px;
          user-select: none;
        }

        .recipe-emoji {
          font-size: 3rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        }

        .recipe-title-container h2 {
          margin: 0;
          font-size: 1.6rem;
          color: #fff;
        }

        .recipe-english {
          margin: 5px 0 0 0;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .expand-icon {
          margin-left: auto;
          font-size: 2rem;
          font-weight: 300;
          color: #ffd700;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        /* Expanded Content */
        .recipe-content {
          margin-top: 20px;
          overflow: hidden;
        }

        .recipe-description {
          font-size: 1.1rem;
          line-height: 1.6;
          border-left: 4px solid #ffd700;
          padding-left: 15px;
          margin-bottom: 25px;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Inner Glass Panels for Details */
        .recipe-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .glass-panel {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 15px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .recipe-section h3 {
          margin-top: 0;
          color: #ffd700;
          font-size: 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 10px;
          margin-bottom: 15px;
        }

        .ingredients-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .ingredients-list li {
          padding: 8px 0;
          position: relative;
          padding-left: 20px;
          color: rgba(255, 255, 255, 0.85);
        }

        .ingredients-list li::before {
          content: '•';
          color: #ffd700;
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        .steps-list {
          padding-left: 20px;
          margin: 0;
          color: rgba(255, 255, 255, 0.85);
        }

        .steps-list li {
          padding: 8px 0;
          line-height: 1.5;
        }

        .steps-list li::marker {
          color: #ffd700;
          font-weight: bold;
        }

        /* Footer */
        .recipes-footer {
          margin-top: 50px;
          text-align: center;
          font-size: 1.2rem;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .recipes-grid {
            grid-template-columns: 1fr;
          }
          .glass-back-button {
            position: relative;
            margin-bottom: 20px;
            display: inline-flex;
            left: auto;
            top: auto;
          }
          .glowing-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="aurudu-recipes-container">
        <motion.div
          className="recipes-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <button className="glass-back-button" onClick={handleBack}>
            <span className="back-icon">←</span> ආපසු
          </button>
          <h1 className="glowing-title">🍛 අවුරුදු ආහාර එකතුව 🍛</h1>
          <p className="subtitle">ශ්‍රී ලාංකීය සම්ප්‍රදායික රසය සහ දැනුම</p>
        </motion.div>

        <motion.div 
          className="recipes-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              layout
              className={`glass-card ${expandedRecipe === index ? 'expanded' : ''}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: expandedRecipe === index ? 1 : 1.02, translateY: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="recipe-header" 
                onClick={() => toggleRecipe(index)}
                style={{ cursor: 'pointer' }}
              >
                <span className="recipe-emoji">{recipe.emoji}</span>
                <div className="recipe-title-container">
                  <h2>{recipe.name}</h2>
                  <p className="recipe-english">{recipe.englishName}</p>
                </div>
                <motion.div 
                  className="expand-icon"
                  animate={{ rotate: expandedRecipe === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  +
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedRecipe === index && (
                  <motion.div
                    className="recipe-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <motion.p 
                      className="recipe-description"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {recipe.description}
                    </motion.p>

                    <div className="recipe-details-grid">
                      <motion.div 
                        className="recipe-section glass-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3>📋 අවශ්‍ය ද්‍රව්‍ය</h3>
                        <ul className="ingredients-list">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient}</li>
                          ))}
                        </ul>
                      </motion.div>

                      <motion.div 
                        className="recipe-section glass-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3>👨‍🍳 සාදන ආකාරය</h3>
                        <ol className="steps-list">
                          {recipe.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="recipes-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
         <p>🎉 සුභ අලුත් අවුරුද්දක් වේවා! සෞභාග්‍යය පිරි රසවත් අවුරුදු මංගල්‍යයක් වේවා! 🎉</p>
        </motion.div>
      </div>
    </>
  );
}