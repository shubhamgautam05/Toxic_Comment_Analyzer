import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheckIcon, ShieldExclamationIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const ResultsDisplay = ({ result }) => {
  if (!result) return null;

  const { original_text, is_toxic, toxicity_score, categories, highlighted_tokens, verdict } = result;

  const chartData = [
    { name: 'Toxic', value: toxicity_score },
    { name: 'Clean', value: 1 - toxicity_score },
  ];

  const COLORS = [is_toxic ? '#EF4444' : '#22C55E', '#E2E8F0'];

  const categoryConfigs = {
    toxic: { label: 'Toxic', color: 'bg-danger' },
    severe_toxic: { label: 'Severe', color: 'bg-red-700' },
    obscene: { label: 'Obscene', color: 'bg-amber-500' },
    threat: { label: 'Threat', color: 'bg-black' },
    insult: { label: 'Insult', color: 'bg-orange-600' },
    identity_hate: { label: 'Identity Hate', color: 'bg-rose-900' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 pb-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Overall Score Card */}
        <div className="lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <InformationCircleIcon className="w-6 h-6 text-primary" />
                Impact Score
            </h3>
            
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%" minHeight={150}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={450}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black" style={{ color: COLORS[0] }}>
                        {Math.round(toxicity_score * 100)}%
                    </span>
                    <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Assessed</span>
                </div>
            </div>

            {/* Verdict Banner */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: is_toxic 
                        ? ["0 0 0px rgba(239,68,68,0)", "0 0 20px rgba(239,68,68,0.4)", "0 0 0px rgba(239,68,68,0)"]
                        : ["0 0 0px rgba(34,197,94,0)", "0 0 20px rgba(34,197,94,0.4)", "0 0 0px rgba(34,197,94,0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-xl ${is_toxic ? 'bg-danger' : 'bg-success'}`}
            >
                {is_toxic ? <ShieldExclamationIcon className="w-8 h-8" /> : <ShieldCheckIcon className="w-8 h-8" />}
                {is_toxic ? 'TOXIC DETECTED' : 'CLEAN CONTENT'}
            </motion.div>
        </div>

        {/* Right: Detailed Analysis */}
        <div className="lg:col-span-2 space-y-8">
            {/* Highlighted Text Panel */}
            <div className="glass-card p-8">
                <h3 className="text-2xl font-black mb-4">Content Breakdown</h3>
                <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 min-h-[100px] leading-relaxed text-xl font-medium">
                    {highlighted_tokens.map((token, idx) => (
                        <span 
                            key={idx} 
                            className={`inline-block mr-1.5 transition-all ${token.toxic ? 'toxic-underline text-danger cursor-help' : 'text-slate-600'}`}
                            title={token.toxic ? `Toxicity: ${Math.round(token.score * 100)}%` : ''}
                        >
                            {token.word}
                        </span>
                    ))}
                </div>
            </div>

            {/* Categories Grid */}
            <div className="glass-card p-8">
                <h3 className="text-2xl font-black mb-6">Probability per Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(categories).map(([key, value], idx) => (
                        <motion.div 
                            key={key}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-700 capitalize">
                                    {key.replace('_', ' ')}
                                </span>
                                <span className={`text-xs font-black px-2 py-1 rounded-md text-white ${categoryConfigs[key].color}`}>
                                    {Math.round(value * 100)}%
                                </span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                    className={`h-full ${categoryConfigs[key].color}`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;
