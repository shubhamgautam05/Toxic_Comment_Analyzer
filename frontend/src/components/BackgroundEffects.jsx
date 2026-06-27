import React from 'react';
import { motion } from 'framer-motion';

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FAFAF7]">
      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 opacity-30 mesh-gradient animate-hue-shift" />
      
      {/* Dot Grid */}
      <div className="absolute inset-0 dot-grid opacity-20" />

      {/* Scanning Laser Line */}
      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-10"
      />

      {/* Digital Particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className="absolute w-1.5 h-1.5 bg-primary/20 rounded-full blur-[1px]"
        />
      ))}

      {/* Floating Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-success/5 rounded-full blur-[100px]" />
    </div>
  );
};

export default BackgroundEffects;
