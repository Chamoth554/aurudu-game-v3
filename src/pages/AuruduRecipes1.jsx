import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { speak } from '../utils/speech';
import '../styles/AuruduRecipes.css';

export default function AuruduRecipes() {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState(0);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const recipes = [
  {
    id: 1,
    name: "කිරිබත්",
    englishName: "Kiribath (Milk Rice)",
    emoji: "🍚",
    description: "කිරිබත් යනු අවුරුදු උත්සවයේ සම්ප්‍රදායික ආහාරයකි. එය කිරි සහ ලුණු සමඟ සකස් කරයි.",
    ingredients: [
      "බත් කෝප්ප 1½",
      "පොල් කිරි කෝප්ප 1",
      "ලුණු තේ හැඳි ¼"
    ],
    steps: [
      "බත් සෝදා සාමාන්‍ය ලෙස පිසගන්න.",
      "බත් පිසුණු පසු පොල් කිරි සහ ලුණු එක් කරන්න.",
      "හොඳින් කලවම් කර මඳ ගින්නෙහි තවත් මිනිත්තු කිහිපයක් පිසගන්න.",
      "තැටියකට දමා සමතලා කර කැබලි ලෙස කපා පිරිනමන්න."
    ]
  },
  {
    id: 2,
    name: "කොකිස්",
    englishName: "Kokis (Spiral Pastry)",
    emoji: "🌀",
    description: "කොකිස් යනු අවුරුදු කාලයේ සාම්ප්‍රදායික ලෙස සකස් කරන රසවත් කෑමකි.",
    ingredients: [
      "අමු පිටි කෝප්ප 2",
      "බිත්තර 2",
      "පොල් කිරි කෝප්ප 1",
      "සීනි කෝප්ප ½",
      "ලුණු සුළු ප්‍රමාණයක්"
    ],
    steps: [
      "සියලු ද්‍රව්‍ය එකට මිශ්‍ර කර දියර මිශ්‍රණයක් සකස් කරන්න.",
      "කොකිස් අච්චුව තෙල්වල රත් කරන්න.",
      "අච්චුව මිශ්‍රණයට දමා තෙල්වල බදිනවා.",
      "රන්වන් පැහැයට බදින ලද පසු ඉවත් කරන්න."
    ]
  },
  {
    id: 3,
    name: "කැවුම්",
    englishName: "Kavum (Oil Cake)",
    emoji: "🍮",
    description: "කැවුම් යනු කිතුල් පැණි සහ පිටි භාවිතයෙන් සකස් කරන ජනප්‍රිය රසකැවිල්ලකි.",
    ingredients: [
      "අටා පිටි කෝප්ප 1",
      "කිතුල් පැණි කෝප්ප ¾",
      "බිත්තර 1",
      "තෙල් (බදීමට)"
    ],
    steps: [
      "පිටි සහ පැණි මිශ්‍ර කර ගන්න.",
      "බිත්තර එකතු කර හොඳින් කලවම් කරන්න.",
      "මිශ්‍රණය කුඩා ප්‍රමාණ වලින් තෙල්වල බදන්න.",
      "රන්වන් පැහැයට පැමිණි විට ඉවත් කරන්න."
    ]
  },
  {
    id: 4,
    name: "අලුවා",
    englishName: "Aluwa (Sweet)",
    emoji: "🍯",
    description: "අලුවා යනු සීනි සහ පිටි භාවිතයෙන් සකස් කරන සම්ප්‍රදායික රසකැවිල්ලකි.",
    ingredients: [
      "සීනි කෝප්ප 1",
      "අලුවා පිටි කෝප්ප 1",
      "වතුර ස්වල්පයක්",
      "කජු (විකල්ප)"
    ],
    steps: [
      "සීනි සහ වතුර උණු කර සිරප් එකක් සකස් කරන්න.",
      "එයට පිටි එක් කර හොඳින් කලවම් කරන්න.",
      "තැටියකට දමා සමතලා කරන්න.",
      "සිසිල් වූ පසු කැබලි ලෙස කපා ගන්න."
    ]
  },
  {
    id: 5,
    name: "අස්මි",
    englishName: "Asmi",
    emoji: "🍪",
    description: "අස්මි යනු කරවිල පත්‍ර යුෂ සහ පිටි භාවිතයෙන් සකස් කරන රසවත් අවුරුදු කෑමකි.",
    ingredients: [
      "අමු පිටි කෝප්ප 2",
      "කරවිල පත්‍ර යුෂ",
      "සීනි සිරප්",
      "තෙල් (බදීමට)"
    ],
    steps: [
      "පිටි සහ පත්‍ර යුෂ මිශ්‍ර කර ගන්න.",
      "තෙල්වල සිහින් ලෙස වත් කර බදන්න.",
      "බැදූ පසු සීනි සිරප් දමා ගන්න."
    ]
  },
  {
    id: 6,
    name: "මුං කැවුම්",
    englishName: "Mung Kavum",
    emoji: "💚",
    description: "මුං කැවුම් යනු මුං ඇට භාවිතයෙන් සකස් කරන රසවත් කෑමකි.",
    ingredients: [
      "මුං ඇට කෝප්ප 1",
      "සීනි කෝප්ප ½",
      "බිත්තර 1",
      "තෙල් (බදීමට)"
    ],
    steps: [
      "මුං ඇට උයලා පිස්සන්න.",
      "සීනි සහ බිත්තර එකතු කරන්න.",
      "කුඩා බෝල ලෙස සාදා තෙල්වල බදන්න."
    ]
  },
  {
    id: 7,
    name: "උඳුවල්",
    englishName: "Unduwal",
    emoji: "🌯",
    description: "උඳුවල් යනු පිටි පිරවුමක් සමඟ සකස් කරන රසවත් කෑමකි.",
    ingredients: [
      "පිටි කෝප්ප 2",
      "වතුර",
      "ලුණු",
      "පිරවුම සඳහා මිශ්‍රණයක්"
    ],
    steps: [
      "පිටි සහ වතුර මිශ්‍ර කර ලේපයක් සකස් කරන්න.",
      "පිරවුම දමා රෝල් කරන්න.",
      "තෙල්වල බදන්න."
    ]
  },
  {
    id: 8,
    name: "දොදොල්",
    englishName: "Dodol",
    emoji: "🤎",
    description: "දොදොල් යනු පැණි, පොල් කිරි සහ පිටි භාවිතයෙන් සකස් කරන සම්ප්‍රදායික රසකැවිල්ලකි.",
    ingredients: [
      "කිතුල් පැණි",
      "පොල් කිරි",
      "පිටි"
    ],
    steps: [
      "සියලු ද්‍රව්‍ය එකට මිශ්‍ර කරන්න.",
      "මඳ ගින්නෙහි දිගටම කලවම් කර පිසගන්න.",
      "තැටියකට දමා සිසිල් කර කැබලි කපා ගන්න."
    ]
  },
  {
    id: 9,
    name: "කෙසෙල් පකෝඩි",
    englishName: "Banana Fritters",
    emoji: "🍌",
    description: "කෙසෙල් පකෝඩි යනු කෙසෙල් සහ පිටි භාවිතයෙන් සකස් කරන රසවත් කෑමකි.",
    ingredients: [
      "කෙසෙල්",
      "පිටි",
      "සීනි",
      "බිත්තර",
      "තෙල්"
    ],
    steps: [
      "කෙසෙල් කැබලි කපා ගන්න.",
      "පිටි සහ බිත්තර මිශ්‍ර කරන්න.",
      "කෙසෙල් මිශ්‍රණයට දමා තෙල්වල බදන්න."
    ]
  },
  {
    id: 10,
    name: "වෙලි තලපා",
    englishName: "Weli Thalapa",
    emoji: "🥞",
    description: "වෙලි තලපා යනු පිටි සහ කිරි භාවිතයෙන් සකස් කරන රසවත් ආහාරයකි.",
    ingredients: [
      "පිටි",
      "කිරි",
      "බිත්තර",
      "සීනි"
    ],
    steps: [
      "සියලු ද්‍රව්‍ය මිශ්‍ර කරන්න.",
      "තවායක දමා දෙපස බැද ගන්න."
    ]
  }
];

  useEffect(() => {
    speak('Avurudu Recipes');
  }, []);

  const toggleRecipe = (index) => {
    setExpandedRecipe(expandedRecipe === index ? null : index);
  };

  const handleBack = () => {
    navigate('/game-select');
  };

  return (
    <div className="festive-bg aurudu-recipes-container">
      <motion.div
        className="recipes-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="back-button" onClick={handleBack}>
          ← ආපසු
        </button>
        <h1>🍛 අවුරුදු ආහාර එකතුව 🍛</h1>
        <p className="subtitle">සම්ප්‍රදායික සිංහල ආහාරවල ගැඹුරු දැනුම</p>
      </motion.div>

      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            className={`recipe-card ${expandedRecipe === index ? 'expanded' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => toggleRecipe(index)}
          >
            <div className="recipe-header">
              <span className="recipe-emoji">{recipe.emoji}</span>
              <div className="recipe-title">
                <h2>{recipe.name}</h2>
                <p className="recipe-english">{recipe.englishName}</p>
              </div>
              <span className="expand-icon">
                {expandedRecipe === index ? '−' : '+'}
              </span>
            </div>

            {expandedRecipe === index && (
              <motion.div
                className="recipe-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="recipe-description">{recipe.description}</p>

                <div className="recipe-section">
                  <h3>📋 අවශ්‍ය ද්‍රව්‍ය</h3>
                  <ul className="ingredients-list">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="recipe-section">
                  <h3>👨‍🍳 සෑදෙන ආකාරය</h3>
                  <ol className="steps-list">
                    {recipe.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="recipes-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
       <p>🎉 සුභ අලුත් අවුරුද්දක් වේවා! රසවත් අවුරුදු කෑම රසවිඳින්න! 🎉</p>
      </motion.div>
    </div>
  );
}
