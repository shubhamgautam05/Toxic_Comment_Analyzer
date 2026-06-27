import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { DocumentTextIcon, PhotoIcon, CloudArrowUpIcon, SparklesIcon } from '@heroicons/react/24/outline';

const InputPanel = ({ onAnalyze }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    multiple: false 
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      if (activeTab === 'text') {
        await onAnalyze({ type: 'text', data: text });
      } else {
        await onAnalyze({ type: 'image', data: imageFile });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 mb-20">
      <div className="glass-card p-2 mb-6 flex relative overflow-hidden">
        <motion.div 
          layoutId="tab"
          className="absolute inset-y-2 bg-primary rounded-2xl shadow-lg shadow-primary/30"
          style={{ 
            width: 'calc(50% - 8px)', 
            left: activeTab === 'text' ? '8px' : 'calc(50%)' 
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
        <button 
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors relative z-10 ${activeTab === 'text' ? 'text-white' : 'text-slate-500'}`}
        >
          <DocumentTextIcon className="w-6 h-6" />
          Text Input
        </button>
        <button 
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-colors relative z-10 ${activeTab === 'image' ? 'text-white' : 'text-slate-500'}`}
        >
          <PhotoIcon className="w-6 h-6" />
          Image Upload
        </button>
      </div>

      <div className="glass-card p-8 min-h-[300px] flex flex-col group relative">
        {/* Glow border effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-focus-within:border-primary/30 transition-colors pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeTab === 'text' ? (
            <motion.div
              key="text"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col"
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the comment you want to analyze..."
                className="flex-1 bg-transparent border-none outline-none text-xl resize-none min-h-[200px] placeholder:text-slate-300 font-medium text-slate-900"
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-slate-400 font-bold bg-slate-100 px-3 py-1 rounded-full text-sm">
                  {text.length} characters
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={loading ? { scale: [1, 0.98, 1], rotate: [0, -1, 1, 0] } : {}}
                  transition={{ duration: 0.5, repeat: loading ? Infinity : 0 }}
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="bg-gradient-to-r from-primary to-violet-400 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <SparklesIcon className="w-6 h-6" />
                  )}
                  {loading ? 'Analyzing...' : 'Analyze Text'}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="image"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div 
                {...getRootProps()} 
                className={`flex-1 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center p-10 cursor-pointer transition-all ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'}`}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className="relative group">
                    <img src={imagePreview} alt="Preview" className="max-h-[300px] rounded-2xl shadow-lg border border-slate-100" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <CloudArrowUpIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-100 p-6 rounded-full mb-4">
                      <CloudArrowUpIcon className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-xl font-bold text-slate-500 text-center">
                      Drag & Drop image here <br />
                      <span className="text-sm font-medium text-slate-400">supports PNG, JPG up to 10MB</span>
                    </p>
                  </>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnalyze}
                  disabled={loading || !imageFile}
                  className="bg-gradient-to-r from-primary to-violet-400 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center gap-3 disabled:opacity-50"
                >
                   {loading ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <SparklesIcon className="w-6 h-6" />
                  )}
                  {loading ? 'Processing OCR...' : 'Extract & Analyze'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InputPanel;
