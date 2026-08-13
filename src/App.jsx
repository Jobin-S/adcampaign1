
import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Clock, Database, FileText, Layout, MessageCircle, Sparkles, AppWindow, Smartphone, Gamepad2, Shield, Zap, Brain } from 'lucide-react';
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

const resultProfiles = {
  'Web Development': {
    label: 'Web Developer',
    image: 'https://findmycareer.pages.dev/web_dev_kerala.png',
    accent: 'from-blue-600 to-sky-500',
    badge: 'Creative builder',
    summary: 'You seem drawn to visual work, interactive ideas, and creating things people can use on the web.',
    why: 'Your answers point toward design sense, curiosity about apps, and comfort with building public-facing products.',
    chips: ['Websites', 'UI design', 'Frontend logic'],
    roadmap: ['HTML, CSS, and JavaScript foundations', 'React projects for your portfolio', 'How to prepare for junior developer interviews']
  },
  'Mobile Development': {
    label: 'Mobile Developer',
    image: 'https://findmycareer.pages.dev/mobile_dev_kerala.png',
    accent: 'from-green-500 to-teal-500',
    badge: 'App-minded problem solver',
    summary: 'You seem interested in everyday apps, smooth user experiences, and products people carry with them.',
    why: 'Your answers show a preference for practical tools, communication, and app-based problem solving.',
    chips: ['Android apps', 'User flows', 'App projects'],
    roadmap: ['Programming basics for mobile apps', 'Building simple Android or cross-platform apps', 'Portfolio projects recruiters can understand']
  },
  'Artificial Intelligence & ML': {
    label: 'AI Specialist',
    image: 'https://findmycareer.pages.dev/ai_specialist_happy_kerala.png',
    accent: 'from-violet-600 to-indigo-500',
    badge: 'Automation thinker',
    summary: 'You seem excited by smart tools, shortcuts, prediction, and systems that can learn from patterns.',
    why: 'Your answers lean toward using technology to make decisions faster and solve problems intelligently.',
    chips: ['Python', 'Machine learning', 'AI tools'],
    roadmap: ['Python and data basics', 'Beginner machine learning projects', 'How to build useful AI demos without getting lost']
  },
  'Data Science': {
    label: 'Data Scientist',
    image: 'https://findmycareer.pages.dev/data_science_happy_kerala.png',
    accent: 'from-cyan-600 to-blue-500',
    badge: 'Pattern finder',
    summary: 'You seem comfortable with facts, numbers, organization, and turning messy information into decisions.',
    why: 'Your answers suggest patience for analysis and a habit of looking for evidence before acting.',
    chips: ['Data analysis', 'Dashboards', 'Python'],
    roadmap: ['Excel and statistics fundamentals', 'Python for data analysis', 'Projects using real datasets and dashboards']
  },
  'Cyber Security': {
    label: 'Cyber Security Specialist',
    image: 'https://findmycareer.pages.dev/security_kerala.png',
    accent: 'from-red-600 to-orange-500',
    badge: 'Digital protector',
    summary: 'You seem naturally alert to safety, privacy, mistakes, and how systems can be protected.',
    why: 'Your answers show a defensive mindset and interest in finding risks before they become problems.',
    chips: ['Networks', 'Ethical hacking', 'Security basics'],
    roadmap: ['Computer networks and Linux basics', 'Security tools and beginner labs', 'How to build a safe practice portfolio']
  },
  'Game Development': {
    label: 'Game Developer',
    image: 'https://findmycareer.pages.dev/game_dev_kerala.png',
    accent: 'from-orange-500 to-yellow-500',
    badge: 'Experience creator',
    summary: 'You seem motivated by play, imagination, and creating interactive worlds that people enjoy.',
    why: 'Your answers point toward creativity, systems thinking, and interest in how rules become experiences.',
    chips: ['Game logic', 'Unity basics', 'Interactive projects'],
    roadmap: ['Programming fundamentals for games', 'Small 2D game projects', 'How to turn playable demos into a portfolio']
  }
};

const getRegisterEndpoint = () => {
  if (window.location.hostname === 'brototype.com' || window.location.hostname === 'www.brototype.com') {
    return 'https://findmycareer.pages.dev/api/register';
  }

  return '/api/register';
};

export default function App() {
  const [step, setStep] = useState('hero'); // hero, assessment, success
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userData, setUserData] = useState({ name: '', whatsapp: '' });
  const [result, setResult] = useState(null);
  const [resultCluster, setResultCluster] = useState('Web');
  const [roadmapRequested, setRoadmapRequested] = useState(false);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [website, setWebsite] = useState('');
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
    const isResuming = Object.keys(answers).length > 0 && step !== 'success';

    if (!isResuming) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setResult(null);
      setResultCluster('Web');
      setRoadmapRequested(false);
      setRegisterError('');
      setRegisterSubmitting(false);
      setWebsite('');
      setUserData({ name: '', whatsapp: '' });
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

    setResultCluster(winner);
    setResult(resultTitles[winner] || 'Web Development');
    setRoadmapRequested(false);
    setRegisterError('');
    setRegisterSubmitting(false);
    setWebsite('');
    setStep('success');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!userData.name.trim() || userData.whatsapp.length !== 10 || registerSubmitting) return;

    setRegisterSubmitting(true);
    setRegisterError('');

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const secondSource = searchParams.get('ref') || 'direct';

      const response = await fetch(getRegisterEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          whatsapp: userData.whatsapp,
          user_name: userData.name,
          phone_number: userData.whatsapp,
          assigned_path: result,
          result_cluster: resultCluster,
          category: answers[8] || null,
          answers,
          website,
          second_source: secondSource,
          language_preference: "Malayalam/English mix",
          source: 'career-assessment-landing'
        })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Could not send your roadmap right now. Please try again.');
      }

      setRoadmapRequested(true);
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#2563eb', '#f8fafc']
      });
    } catch (error) {
      setRegisterError(error.message || 'Could not send your roadmap right now. Please try again.');
    } finally {
      setRegisterSubmitting(false);
    }
  };

  const profile = resultProfiles[result] || resultProfiles['Web Development'];
  const resultAnswerCount = Object.entries(answers)
    .filter(([qIndex]) => questions[qIndex]?.options.some(option => option.text === answers[qIndex] && option.cluster === resultCluster))
    .length;

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
            <img src="https://findmycareer.pages.dev/logo.png" alt="Brototype" className="h-10 md:h-12 w-auto" />
          </div>
          {step === 'hero' && (
            <button
              onClick={startAssessment}
              className="px-8 py-3 font-bold rounded-xl shadow-lg transition-all text-base bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:shadow-xl hover:scale-105"
            >
              Get Started
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 pt-12 md:pt-20 pb-8 md:pb-12 flex flex-col items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">

          {step === 'hero' && (
            <Motion.div
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
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startAssessment}
                  className="group relative z-10 w-full md:w-auto justify-center inline-flex items-center gap-2 md:gap-3 px-4 py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-2xl text-lg md:text-xl font-bold shadow-xl shadow-blue-400/50 hover:shadow-2xl hover:brightness-105 transition-all ring-4 ring-blue-500/20 overflow-hidden whitespace-nowrap"
                >
                  {/* Moving Shimmer Effect */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-2xl">
                    <Motion.div
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

                  <span className="relative z-10">Find My Dream Career Now</span>
                  <ArrowRight className="relative z-10 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                </Motion.button>
              </div>

              <div className="pt-4 md:pt-12 flex gap-4 md:gap-8 justify-center text-slate-400 text-sm md:text-base">
                <div className="flex items-center gap-1.5 md:gap-2"><Clock className="w-4 h-4 md:w-5 md:h-5" /> 2 Mins</div>
                <div className="flex items-center gap-1.5 md:gap-2"><Zap className="w-4 h-4 md:w-5 md:h-5" /> AI Powered</div>
              </div>
            </Motion.div>
          )}

          {step === 'assessment' && (
            <Motion.div
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
                  <Motion.div
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
                          <Motion.div
                            initial={false}
                            animate={{
                              backgroundColor: isCompleted ? "#22c55e" : isCurrent ? "#2563eb" : "#ffffff",
                              borderColor: isCompleted ? "#22c55e" : isCurrent ? "#2563eb" : "#e2e8f0",
                              scale: isCurrent ? 1.2 : 1
                            }}
                            className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 transition-all duration-300 shadow-md ${isCompleted || isCurrent ? 'shadow-lg' : ''}`}
                          >
                            {isCompleted ? (
                              <Motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                              >
                                <Check className="w-5 h-5 md:w-6 md:h-6 text-white stroke-[3]" />
                              </Motion.div>
                            ) : isCurrent ? (
                              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full animate-ping" />
                            ) : (
                              <span className="text-xs md:text-sm text-slate-400 font-bold">{idx + 1}</span>
                            )}
                          </Motion.div>

                          {/* Step Label (Optional, for current only maybe?) */}
                          {isCurrent && (
                            <Motion.span
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 5 }}
                              className="absolute top-full mt-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest min-w-max hidden md:block"
                            >
                              Step {idx + 1}
                            </Motion.span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <Motion.div
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
                  </Motion.div>
                </AnimatePresence>
              </div>
            </Motion.div>
          )}

          {step === 'success' && (
            <Motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full max-w-5xl mt-16 md:mt-4"
            >
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
                  <div className="relative min-h-[220px] overflow-hidden bg-slate-100 lg:min-h-full">
                    <img
                      src={profile.image}
                      alt={profile.label}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-white/75">Your result</p>
                      <h2 className="mt-1 text-3xl font-black leading-tight text-white">{profile.label}</h2>
                    </div>
                  </div>

                  <div className="p-5 text-left md:p-7">
                    <div className="mb-5">
                      <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                        <Sparkles className="h-4 w-4" />
                        Based on your answers
                      </span>
                      <h1 className="text-2xl font-black leading-tight text-slate-950 md:text-4xl">
                        You are a strong fit for <span className={`bg-gradient-to-r ${profile.accent} bg-clip-text text-transparent`}>{profile.label}</span>
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 md:text-base">
                        {profile.summary}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4 md:p-5">
                      <div className="mb-4 flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-black text-slate-950 md:text-xl">Want the free roadmap?</h3>
                          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                            We will send the {profile.label} PDF on WhatsApp.
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                          {Math.max(resultAnswerCount, 1)} matching answer{resultAnswerCount === 1 ? '' : 's'}
                        </span>
                        {profile.chips.slice(0, 2).map((chip) => (
                          <span key={chip} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                            {chip}
                          </span>
                        ))}
                      </div>

                      <div className="mb-4 grid gap-2 md:grid-cols-3">
                        {profile.roadmap.slice(0, 3).map((item) => (
                          <div key={item} className="flex items-start gap-2 rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold leading-snug text-slate-700">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {roadmapRequested ? (
                        <Motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl bg-white p-4 text-center shadow-sm"
                        >
                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <Check className="h-6 w-6 stroke-[3]" />
                          </div>
                          <h4 className="text-base font-black text-slate-950">Roadmap request received</h4>
                          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                            Thanks, {userData.name}. We will send the {profile.label} roadmap to {userData.whatsapp} on WhatsApp.
                          </p>
                        </Motion.div>
                      ) : (
                        <form onSubmit={handleRegisterSubmit} className="grid gap-3 md:grid-cols-2">
                          <label className="hidden">
                            Website
                            <input
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                              value={website}
                              onChange={e => setWebsite(e.target.value)}
                            />
                          </label>
                          <div className="flex flex-col">
                            <label className="mb-1.5 flex min-h-0 items-end text-sm font-bold text-slate-800 md:min-h-[2.75rem]">What name should we call you?</label>
                            <input
                              type="text"
                              required
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100"
                              placeholder="Your name"
                              value={userData.name}
                              onChange={e => {
                                setRegisterError('');
                                setUserData({ ...userData, name: e.target.value });
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="mb-1.5 flex min-h-0 items-end text-sm font-bold text-slate-800 md:min-h-[2.75rem]">Which WhatsApp number should we send your roadmap to?</label>
                            <input
                              type="tel"
                              required
                              inputMode="numeric"
                              pattern="[0-9]{10}"
                              maxLength={10}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100"
                              placeholder="WhatsApp number"
                              value={userData.whatsapp}
                              onChange={e => {
                                setRegisterError('');
                                setUserData({ ...userData, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) });
                              }}
                            />
                          </div>
                          {registerError && (
                            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 md:col-span-2">
                              {registerError}
                            </p>
                          )}
                          <button
                            type="submit"
                            disabled={registerSubmitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-green-600/20 transition-all hover:-translate-y-0.5 hover:bg-green-700 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-green-400 disabled:hover:translate-y-0 md:col-span-2"
                          >
                            <MessageCircle className="h-5 w-5" />
                            {registerSubmitting ? 'Sending roadmap...' : 'Send my free roadmap on WhatsApp'}
                          </button>
                        </form>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </main>
      {step !== 'success' && <footer className="w-full bg-white border-t border-slate-100 py-8 md:py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">

          {/* Left: Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <img src="https://findmycareer.pages.dev/logo.png" alt="Brototype" className="h-10 md:h-12 w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
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
      </footer>}
    </div >
  );
}
