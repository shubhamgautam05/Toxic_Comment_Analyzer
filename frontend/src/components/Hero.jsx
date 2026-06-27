import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const title = "ToxicScan";
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <div className="relative pt-24 pb-16 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Morphing Tech Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 animate-blob mix-blend-multiply filter blur-3xl opacity-30 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-success/20 animate-blob animation-delay-2000 mix-blend-multiply filter blur-3xl opacity-30 rounded-full" />

      {/* Floating Toxic Images (Emojis) */}
      {[ "☢️", "⚠️", "🧪", "🦠", "💀", "🍄", "☣️" ].map((emoji, index) => (
        <motion.div
          key={index}
          initial={{ y: 0, opacity: 0 }}
          animate={{ 
            y: [-20, -120], 
            opacity: [0, 1, 0],
            x: Math.sin(index) * 150 
          }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            delay: index * 1.5,
            ease: "easeInOut"
          }}
          className="absolute text-5xl pointer-events-none filter drop-shadow-2xl"
          style={{ 
            left: `${10 + index * 15}%`, 
            bottom: '10%' 
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-4">
          {title.split("").map((letter, index) => (
            <motion.span key={index} variants={child} className="inline-block">
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-xl md:text-2xl text-slate-600 max-w-2xl font-medium"
      >
        Harnessing AI to decode toxicity in text and images. 
        <span className="text-primary italic"> Cleanse the conversation.</span>
      </motion.p>
    </div>
  );
};

export default Hero;
