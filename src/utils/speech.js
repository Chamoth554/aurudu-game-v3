// Web Speech API utility for voice prompts
let synth = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export const speak = (text) => {
  if (!synth) return;
  
  synth.cancel();

  const utter = new SpeechSynthesisUtterance();
  utter.rate = 1.0; 
  utter.pitch = 1.0;
  utter.volume = 1.0;
  utter.lang = 'en-US';
  utter.text = text;

  // Handle Android/Chrome issue where speech first time might be silent
  if (synth.speaking) {
    synth.cancel();
  }

  synth.speak(utter);
};

export const stopSpeech = () => {
  if (synth) synth.cancel();
};
