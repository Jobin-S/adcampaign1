
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Code, Layout, Database, Layers, Clock, Zap, Send, Instagram, Youtube, Linkedin, Map, Brain, Sparkles, Cpu, AppWindow, Smartphone, Globe, Gamepad2, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

const questions = [
  {
    id: 1,
    question: "You get a free room makeover. What do you choose first?",
    options: [
      { text: "Smart lights that change with your voice", cluster: "AI", icon: <Brain className="w-6 h-6" /> },
      { text: "Colorful paintings and cool designs", cluster: "Web", icon: <Layout className="w-6 h-6" /> },
      { text: "A high-tech digital door lock", cluster: "Security", icon: <Shield className="w-6 h-6" /> },
      { text: "A big gaming console setup", cluster: "Game", icon: <Gamepad2 className="w-6 h-6" /> }
    ]
  },
  {
    id: 2,
    question: "What do you like most about your smartphone?",
    options: [
      { text: "All the different Apps I can use", cluster: "Mobile", icon: <Smartphone className="w-6 h-6" /> },
      { text: "The beautiful screen and visual design", cluster: "Web", icon: <Layout className="w-6 h-6" /> },
      { text: "Face ID and privacy locks", cluster: "Security", icon: <Shield className="w-6 h-6" /> },
      { text: "Siri or Google Assistant", cluster: "AI", icon: <Brain className="w-6 h-6" /> }
    ]
  },
  {
    id: 3,
    question: "It is Sunday! How do you want to spend it?",
    options: [
      { text: "Playing video games with friends", cluster: "Game", icon: <Gamepad2 className="w-6 h-6" /> },
      { text: "Organizing my files and budget", cluster: "Data", icon: <Database className="w-6 h-6" /> },
      { text: "Chatting on social media apps", cluster: "Mobile", icon: <Smartphone className="w-6 h-6" /> },
      { text: "Solving a mystery puzzle", cluster: "Security", icon: <Shield className="w-6 h-6" /> }
    ]
  },
  {
    id: 4,
    question: "You are aiming for a dream job. What matters most?",
    options: [
      { text: "Creating things that look beautiful", cluster: "Web", icon: <Layout className="w-6 h-6" /> },
      { text: "Finding facts and analyzing numbers", cluster: "Data", icon: <Database className="w-6 h-6" /> },
      { text: "Protecting secrets and safety", cluster: "Security", icon: <Shield className="w-6 h-6" /> },
      { text: "Using smart tools to do work for me", cluster: "AI", icon: <Brain className="w-6 h-6" /> }
    ]
  },
  {
    id: 5,
    question: "In a group project, what is your role?",
    options: [
      { text: "I design the poster and slides", cluster: "Web", icon: <Layout className="w-6 h-6" /> },
      { text: "I collect the data and facts", cluster: "Data", icon: <Database className="w-6 h-6" /> },
      { text: "I check for any mistakes or errors", cluster: "Security", icon: <Shield className="w-6 h-6" /> },
      { text: "I find the smartest shortcut to finish", cluster: "AI", icon: <Brain className="w-6 h-6" /> }
    ]
  },
  {
    id: 6,
    question: "If you could have a superpower, what would it be?",
    options: [
      { text: "To read minds and predict the future", cluster: "AI", icon: <Brain className="w-6 h-6" /> },
      { text: "To be invisible and go anywhere", cluster: "Security", icon: <Shield className="w-6 h-6" /> },
      { text: "To remember every number and fact", cluster: "Data", icon: <Database className="w-6 h-6" /> },
      { text: "To create a new fantasy world", cluster: "Game", icon: <Gamepad2 className="w-6 h-6" /> }
    ]
  },
  {
    id: 7,
    question: "If you were not in this college, what would you be?",
    options: [
      { text: "An Artist or Designer", cluster: "Web", icon: <Layout className="w-6 h-6" /> },
      { text: "A Police Officer or Detective", cluster: "Security", icon: <Shield className="w-6 h-6" /> },
      { text: "An Accountant or Banker", cluster: "Data", icon: <Database className="w-6 h-6" /> },
      { text: "A Professional Gamer", cluster: "Game", icon: <Gamepad2 className="w-6 h-6" /> }
    ]
  },
  {
    id: 8,
    question: "You have an idea for a new App. What does it do?",
    options: [
      { text: "It helps people chat with friends", cluster: "Mobile", icon: <Smartphone className="w-6 h-6" /> },
      { text: "It edits photos to look amazing", cluster: "Web", icon: <Layout className="w-6 h-6" /> },
      { text: "It does homework automatically", cluster: "AI", icon: <Brain className="w-6 h-6" /> },
      { text: "It tracks your fitness stats", cluster: "Data", icon: <Database className="w-6 h-6" /> }
    ]
  },
  {
    id: 9,
    question: "Which category are you?",
    options: [
      { text: "College Student", cluster: null, icon: <Layout className="w-6 h-6" /> },
      { text: "Graduate", cluster: null, icon: <Check className="w-6 h-6" /> },
      { text: "Working Professional", cluster: null, icon: <AppWindow className="w-6 h-6" /> },
      { text: "Other", cluster: null, icon: <Sparkles className="w-6 h-6" /> }
    ]
  }
];

const heroCopy = {
  originalMalayalam: {
    prefix: 'AI ഉപയോഗിച്ച് നിങ്ങൾക്ക് പറ്റിയ',
    career: 'IT Career',
    action: 'കണ്ടെത്തൂ,',
    durationPrefix: 'വെറും',
    durationNumber: '2',
    durationSuffix: 'മിനിറ്റിൽ...'
  },
  english: {
    prefix: 'Discover the',
    career: 'IT Career',
    action: 'That Fits You',
    durationPrefix: 'in just',
    durationNumber: '2',
    durationSuffix: 'minutes...'
  }
};

export default function App() {
  const [step, setStep] = useState('hero'); // hero, assessment, lead-magnet, success
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userData, setUserData] = useState({ name: '', whatsapp: '' });
  const [showRoadmapPopup, setShowRoadmapPopup] = useState(false);
  const [result, setResult] = useState(null);
  const [analyzingText, setAnalyzingText] = useState('Initializing AI Model...');
  const [isScrolled, setIsScrolled] = useState(false);



  useEffect(() => {
    console.log("App Version: 1.0.5 - Fixed Mobile Scroll");
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Handle Browser Back Button
  useEffect(() => {
    const handlePopState = (event) => {
      // If user presses back button and we are NOT in hero, go to hero
      if (step !== 'hero') {
        event.preventDefault();
        setStep('hero');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [step]);

  const startAssessment = () => {
    // Push a new state so the back button has something to "pop" to
    window.history.pushState({ page: 'assessment' }, '', '');

    // Resume if we have some answers and haven't finished yet
    const isResuming = Object.keys(answers).length > 0 && step !== 'success' && step !== 'lead-magnet';

    if (!isResuming) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setResult(null);
    }

    setStep('assessment');

  };

  const handleAnswer = (optionText) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: optionText };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    } else {
      setTimeout(() => calculateAndAdvance(newAnswers), 300);
    }
  };

  const calculateAndAdvance = (finalAnswers) => {
    // Scoring
    const scores = {
      'AI': 0,
      'Data': 0,
      'Security': 0,
      'Mobile': 0,
      'Web': 0,
      'Game': 0
    };

    // Calculate scores based on the 'cluster' property of the selected answer
    Object.keys(finalAnswers).forEach(qIndex => {
      const selectedOption = questions[qIndex].options.find(opt => opt.text === finalAnswers[qIndex]);
      if (selectedOption && selectedOption.cluster) {
        scores[selectedOption.cluster]++;
      }
    });

    // Find the winner
    let maxScore = -1;
    let winner = 'Web'; // Default

    Object.entries(scores).forEach(([cluster, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winner = cluster;
      }
    });

    // Map cluster to Title
    const resultTitles = {
      'AI': 'Artificial Intelligence & ML',
      'Data': 'Data Science',
      'Security': 'Cyber Security',
      'Mobile': 'Mobile Development',
      'Web': 'Web Development',
      'Game': 'Game Development'
    };

    setResult(resultTitles[winner] || 'Web Development');
    setStep('lead-magnet');
  };


  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!userData.name || !userData.whatsapp) return;

    // Payload
    const payload = {
      user_name: userData.name,
      phone_number: userData.whatsapp,
      assigned_path: result,
      language_preference: "Malayalam/English mix" // Static for now as per requirements
    };

    console.log("Sending payload:", payload);
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF0000', '#FFD700', '#0000FF']
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-200 relative overflow-x-hidden">

      {/* Decorative Left-Side Gradient Blob */}
      {/* Optimized Background using CSS Radial Gradients (No heavy blurs) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(186,230,253,0.4)_0%,transparent_70%)] blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,rgba(186,230,253,0.4)_0%,transparent_70%)] blur-3xl"></div>
      </div>

      {/* Header/Nav */}
      <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm border-b border-slate-100' : 'bg-transparent border-b border-transparent'}`}>
        <div className="w-full px-4 md:px-8 lg:px-12 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
            <img src="/logo.png" alt="Brototype" className="h-10 md:h-12 w-auto" />
          </div>
          <button
            onClick={startAssessment}
            disabled={step !== 'hero'}
            className={`px-8 py-3 font-bold rounded-xl shadow-lg transition-all text-base bg-gradient-to-r from-blue-600 to-sky-500 text-white ${step !== 'hero'
              ? 'opacity-80 cursor-not-allowed'
              : 'hover:shadow-xl hover:scale-105'
              }`}
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 pt-12 md:pt-20 pb-8 md:pb-12 flex flex-col items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">

          {step === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6 md:space-y-8"
            >
              <div className="space-y-5">
                <h1 className="text-[1.5rem] xs:text-[1.8rem] sm:text-3xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter pb-1">
                  <span className="inline-block whitespace-nowrap">{heroCopy.english.prefix}</span> <br className="md:hidden" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">{heroCopy.english.career}</span> <br className="hidden md:block" />
                  {heroCopy.english.action} with <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">AI</span>, <br className="md:hidden" />
                  {heroCopy.english.durationPrefix} <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">{heroCopy.english.durationNumber}</span> {heroCopy.english.durationSuffix}
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
                  Find your perfect IT career path <br className="md:hidden" />
                  using AI in just 2 minutes!
                </p>
              </div>

              <div className="relative w-[95%] md:w-auto inline-block mt-6 md:mt-0">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startAssessment}
                  className="group relative z-10 w-full md:w-auto justify-center inline-flex items-center gap-2 md:gap-3 px-4 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-2xl text-lg md:text-xl font-bold shadow-xl shadow-blue-400/50 hover:shadow-2xl hover:brightness-105 transition-all ring-4 ring-blue-500/20 overflow-hidden whitespace-nowrap"
                >
                  {/* Moving Shimmer Effect */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-2xl">
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '400%' }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 3,
                        ease: "linear",
                        repeatDelay: 2,
                        delay: 5
                      }}
                      className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                    />
                  </div>

                  <span className="relative z-10">Find My IT Career Now</span>
                  <ArrowRight className="relative z-10 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              <div className="pt-4 md:pt-12 flex gap-4 md:gap-8 justify-center text-slate-400 text-sm md:text-base">
                <div className="flex items-center gap-1.5 md:gap-2"><Clock className="w-4 h-4 md:w-5 md:h-5" /> 2 Mins</div>
                <div className="flex items-center gap-1.5 md:gap-2"><Zap className="w-4 h-4 md:w-5 md:h-5" /> AI Powered</div>
              </div>
            </motion.div>
          )}

          {step === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-xl md:max-w-4xl"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-12 border border-white/50 relative overflow-hidden">
                {/* Enhanced Progress Stepper */}
                <div className="mb-10 relative px-2">
                  {/* Background Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full z-0"></div>

                  {/* Active Progress Line */}
                  <motion.div
                    className="absolute top-1/2 left-0 h-1.5 bg-green-500 -translate-y-1/2 rounded-full z-0 origin-left"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(currentQuestionIndex / (questions.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />

                  {/* Steps */}
                  <div className="flex justify-between relative z-10 w-full">
                    {questions.map((q, idx) => {
                      const isCompleted = idx < currentQuestionIndex;
                      const isCurrent = idx === currentQuestionIndex;

                      return (
                        <div key={q.id} className="relative flex flex-col items-center">
                          <motion.div
                            initial={false}
                            animate={{
                              backgroundColor: isCompleted ? "#22c55e" : isCurrent ? "#2563eb" : "#ffffff",
                              borderColor: isCompleted ? "#22c55e" : isCurrent ? "#2563eb" : "#e2e8f0",
                              scale: isCurrent ? 1.2 : 1
                            }}
                            className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 transition-all duration-300 shadow-md ${isCompleted || isCurrent ? 'shadow-lg' : ''}`}
                          >
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                              >
                                <Check className="w-5 h-5 md:w-6 md:h-6 text-white stroke-[3]" />
                              </motion.div>
                            ) : isCurrent ? (
                              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full animate-ping" />
                            ) : (
                              <span className="text-xs md:text-sm text-slate-400 font-bold">{idx + 1}</span>
                            )}
                          </motion.div>

                          {/* Step Label (Optional, for current only maybe?) */}
                          {isCurrent && (
                            <motion.span
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 5 }}
                              className="absolute top-full mt-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest min-w-max hidden md:block"
                            >
                              Step {idx + 1}
                            </motion.span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mt-4 mb-8">
                      <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <h2 className="text-xl md:text-3xl font-bold text-slate-900 mt-2 leading-snug">
                        {questions[currentQuestionIndex].question}
                      </h2>
                    </div>



                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questions[currentQuestionIndex].options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(opt.text)}
                            className="p-4 md:p-5 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group flex items-center gap-3 md:gap-4 w-full shadow-sm hover:shadow-md bg-white"
                          >
                            <div className="p-2.5 md:p-3 bg-blue-100/50 text-blue-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                              {opt.icon}
                            </div>
                            <span className="font-semibold text-sm md:text-lg text-slate-700 group-hover:text-slate-900 leading-snug">
                              {opt.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-lg bg-white/90 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl border border-white/60 text-center relative overflow-hidden"
            >
              {/* Complex Background Tech Effect */}
              <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: '100%' }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-32 h-32 mb-10 relative flex items-center justify-center">
                  {/* Outer Pulsing Ring */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-blue-100 blur-xl"
                  />

                  {/* Rotating Dashed Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-blue-200"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border border-dotted border-indigo-300"
                  />

                  {/* Active Segment Rings */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-t-4 border-r-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-4 rounded-full border-b-2 border-l-2 border-transparent border-b-sky-500 border-l-sky-500 rounded-full"
                  />

                  {/* Central Brain Icon with Pulse */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="bg-white p-5 rounded-2xl shadow-xl shadow-blue-200/50 relative z-10"
                  >
                    {analyzingText === 'Analysing your thinking style...' && <Cpu className="w-12 h-12 text-purple-600" />}
                    {analyzingText === 'Finding suitable IT careers...' && <Database className="w-12 h-12 text-amber-500" />}
                    {analyzingText === 'Creating your personal roadmap...' && <Map className="w-12 h-12 text-green-500" />}
                    {analyzingText === 'Initializing AI Model...' && <Brain className="w-12 h-12 text-blue-600" />}
                  </motion.div>
                </div>

                <motion.h2
                  key={analyzingText} // key change triggers animation
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 h-16 flex items-center justify-center"
                >
                  {analyzingText}
                </motion.h2>

                <p className="text-slate-500 font-medium animate-pulse">
                  AI is calibrating your personalized roadmap...
                </p>

                {/* Advanced Loading Bar */}
                <div className="w-full max-w-xs h-3 bg-slate-100 rounded-full mt-8 overflow-hidden relative shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 background-animate"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ backgroundSize: '200% 100%' }}
                  />
                  {/* Processing blips */}
                  <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.2 }}
                    className="absolute top-0 right-0 h-full w-2 bg-white/50 blur-[2px]"
                  />
                </div>


              </div>
            </motion.div>
          )}

          {step === 'lead-magnet' && (
            <motion.div
              key="lead-magnet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200 animate-bounce">
                  <Check className="w-8 h-8 text-white stroke-[3]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your Career Result is Ready!</h2>
                <p className="text-slate-600 mt-2">Enter your WhatsApp number <br /> to know your career result</p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your Name"
                    value={userData.name}
                    onChange={e => setUserData({ ...userData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your WhatsApp Number"
                    value={userData.whatsapp}
                    onChange={e => setUserData({ ...userData, whatsapp: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 shadow-2xl shadow-green-500/40 border-t border-white/30 ring-1 ring-white/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    Get My Roadmap <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  </span>
                </button>
              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full px-4 md:px-0 md:max-w-[85%] lg:max-w-[80%] xl:max-w-[75%] mt-20 md:mt-0"
            >
              <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 md:min-h-[500px]">

                  {/* Left Side: Visuals & Headline */}
                  {/* Left Side: Visuals */}
                  <div className="md:col-span-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/20 relative border-b md:border-b-0 md:border-r border-white/60 min-h-[300px] md:min-h-full overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
                    </div>

                    <img
                      src={
                        result === 'Web Development' ? '/web_dev_kerala.png' :
                          result === 'Mobile Development' ? '/mobile_dev_kerala.png' :
                            result === 'Data Science' ? '/data_science_happy_kerala.png' :
                              result === 'Cyber Security' ? '/security_kerala.png' :
                                result === 'Game Development' ? '/game_dev_kerala.png' :
                                  result === 'Artificial Intelligence & ML' ? '/ai_specialist_happy_kerala.png' : // Reuse Data char for AI
                                    '/web_dev_kerala.png' // Default
                      }
                      alt={result}
                      className="w-full h-full object-cover absolute inset-0 z-10"
                    />
                  </div>

                  {/* Right Side: Content & CTA */}
                  <div className="md:col-span-7 p-4 md:p-6 flex flex-col justify-center text-left bg-white/40">

                    <div className="mb-6">
                      <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-blue-100 text-blue-700 text-xs md:text-sm font-bold uppercase tracking-wider mb-3 rounded-full">
                        Way to go, {userData.name}!
                      </span>
                      <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
                        {result === 'Web Development' && <>You're a natural <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500">Web Developer</span>.</>}
                        {result === 'Mobile Development' && <>You're a natural <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">Mobile Developer</span>.</>}
                        {result === 'Artificial Intelligence & ML' && <>You're a natural <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-500">AI Specialist</span>.</>}
                        {result === 'Data Science' && <>You're a natural <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-500">Data Scientist</span>.</>}
                        {result === 'Cyber Security' && <>You're a natural <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">Cyber Security Expert</span>.</>}
                        {result === 'Game Development' && <>You're a natural <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">Game Developer</span>.</>}
                      </h2>

                      {/* Short Body Text */}
                      <p className="text-slate-600 text-lg md:text-xl font-medium mb-6">
                        {result === 'Web Development' && "Build beautiful, interactive websites and apps."}
                        {result === 'Mobile Development' && "Create the apps that people use every day."}
                        {result === 'Artificial Intelligence & ML' && "Teach computers to think, learn, and predict."}
                        {result === 'Data Science' && "Uncover hidden truths and patterns in big data."}
                        {result === 'Cyber Security' && "Protect digital systems from hackers and threats."}
                        {result === 'Game Development' && "Design immersive worlds and fun experiences."}
                      </p>

                      {/* Value Chips */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {result === 'Web Development' && <>
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">🎨 Creative</span>
                          <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">🖌️ Visual</span>
                          <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm font-bold">🌐 Internet</span>
                        </>}
                        {result === 'Mobile Development' && <>
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-bold">📱 Apps</span>
                          <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-sm font-bold">👆 Touch</span>
                          <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold">🚀 Portable</span>
                        </>}
                        {result === 'AI & ML' || result === 'Artificial Intelligence & ML' && <>
                          <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">🧠 Smart Systems</span>
                          <span className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-sm font-bold">🤖 Automation</span>
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">🔮 Future</span>
                        </>}
                        {result === 'Data Science' && <>
                          <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-bold">📊 Analytics</span>
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">📈 Trends</span>
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">🔢 Big Data</span>
                        </>}
                        {result === 'Cyber Security' && <>
                          <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-bold">🛡️ Defense</span>
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">🔒 Protection</span>
                          <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold">🕵️ Ethical Hacking</span>
                        </>}
                        {result === 'Game Development' && <>
                          <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">🎮 Gameplay</span>
                          <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-bold">🌍 3D Worlds</span>
                          <span className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm font-bold">🎲 Fun</span>
                        </>}
                      </div>
                    </div>

                    {/* Roadmap Box */}
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 md:p-5 mb-4 md:mb-6 flex items-center gap-3 md:gap-4 shadow-sm">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-lg md:text-2xl shadow-sm shrink-0">
                        📱
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-0.5">Check your WhatsApp!</h3>
                        <p className="text-slate-600 text-xs md:text-sm font-medium">Your step-by-step roadmap to a ₹40k+ job is waiting.</p>
                      </div>
                    </div>









                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Start Learning Now</span>
                      <a
                        href="https://www.youtube.com/@BrototypeMalayalam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 md:py-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-xl font-bold text-sm sm:text-base md:text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 md:gap-3 group px-2"
                      >
                        <svg className="w-6 h-6 md:w-7 md:h-7 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#FF0000" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816z" />
                          <path fill="#FFFFFF" d="M9.615 8.816l8 3.993-8 4.007z" />
                        </svg>
                        <span className="truncate">Start Your First Lesson (Free)</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform text-white/80 shrink-0" />
                      </a>

                    </div>

                  </div>

                </div>
              </div>
            </motion.div>
          )}




        </AnimatePresence>
      </main>
      <footer className="w-full bg-white border-t border-slate-100 py-8 md:py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">

          {/* Left: Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <img src="/logo.png" alt="Brototype" className="h-10 md:h-12 w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
          </div>

          {/* Center: Links & Contact */}
          <div className="flex-[2] flex flex-col items-center gap-3 text-slate-400 text-base font-medium text-center">
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-center">
              <a href="https://learningclub.brototype.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 hover:bg-clip-text hover:text-transparent transition-all duration-300">Privacy Policy</a>
              <span className="hidden md:inline text-slate-300">|</span>
              <a href="tel:+917034395811" className="hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 hover:bg-clip-text hover:text-transparent transition-all duration-300">For any queries: +91 70343 95811</a>
            </div>
            <div className="text-sm mt-6 pt-4 border-t border-slate-50 w-full max-w-xs md:max-w-md">
              © {new Date().getFullYear()} Brototype. All rights reserved.
            </div>
          </div>

          {/* Right: Socials */}
          <div className="flex-1 flex justify-center md:justify-end gap-8 text-slate-400">
            <a href="https://www.instagram.com/brototype.malayalam/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E4405F] hover:scale-110 transition-all">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5a4.25 4.25 0 004.25 4.25h8.5a4.25 4.25 0 004.25-4.25v-8.5a4.25 4.25 0 00-4.25-4.25h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM18 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@BrototypeMalayalam" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF0000] hover:scale-110 transition-all">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/brototype/mycompany/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] hover:scale-110 transition-all">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div >
  );
}
