import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon, XMarkIcon, ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

const HistorySidebar = ({ history, isOpen, onToggle, onSelect }) => {
  const [filter, setFilter] = useState('All');

  const filteredHistory = history.filter(item => {
    if (filter === 'Toxic') return item.verdict === 'TOXIC';
    if (filter === 'Clean') return item.verdict === 'CLEAN';
    return true;
  });

  return (
    <>
      {/* Trigger Button (Floating when closed) */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-white/[0.03] backdrop-blur-md border-y border-l border-white/10 p-4 rounded-l-3xl shadow-2xl z-40 group hover:bg-primary transition-all duration-300"
        >
          <ClockIcon className="w-8 h-8 text-primary group-hover:text-white" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-full max-w-sm bg-[#0a0a0c]/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ClockIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-black text-white">History</h2>
                </div>
                <button onClick={onToggle} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <XMarkIcon className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 flex gap-2">
                {['All', 'Toxic', 'Clean'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
                      filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                    <div className="bg-white/5 p-6 rounded-full text-slate-700">
                        <TrashIcon className="w-12 h-12" />
                    </div>
                    <p className="font-bold text-slate-600">No records found matching "{filter}"</p>
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl shadow-sm cursor-pointer hover:border-primary/30 transition-all group"
                      onClick={() => onSelect(item)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                          item.verdict === 'TOXIC' ? 'bg-danger text-white' : 'bg-success text-white'
                        }`}>
                          {item.verdict}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-400 line-clamp-2 group-hover:text-slate-200 transition-colors">
                        {item.original_text}
                      </p>
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                         <div className="flex -space-x-1">
                            {/* Small indicators for categories if they exist */}
                            {Object.entries(item.categories_json || {}).map(([key, val], idx) => (
                                val > 0.5 && <div key={key} className="w-2 h-2 rounded-full border border-[#0a0a0c]" style={{ backgroundColor: val > 0.8 ? '#EF4444' : '#F59E0B' }} />
                            ))}
                         </div>
                         <div className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center">
                            View details <ChevronLeftIcon className="w-3 h-3 rotate-180 ml-1" />
                         </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HistorySidebar;
