import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import BackgroundEffects from './components/BackgroundEffects';
import Hero from './components/Hero';
import InputPanel from './components/InputPanel';
import ResultsDisplay from './components/ResultsDisplay';
import HistorySidebar from './components/HistorySidebar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleAnalyze = async (payload) => {
    const loadingToast = toast.loading('Analyzing content with Toxic-BERT...');
    try {
      let response;
      if (payload.type === 'text') {
        response = await axios.post(`${API_BASE_URL}/analyze/text`, { text: payload.data });
      } else {
        const formData = new FormData();
        formData.append('file', payload.data);
        response = await axios.post(`${API_BASE_URL}/analyze/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setResult(response.data);
      fetchHistory(); // Refresh history
      
      if (response.data.is_toxic) {
        toast.error('Toxicity detected!', { id: loadingToast });
      } else {
        toast.success('Content is clean!', { id: loadingToast });
      }

      // Smooth scroll to results
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 500);

    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.', { id: loadingToast });
    }
  };

  const handleHistorySelect = (item) => {
    setResult({
        ...item,
        categories: item.categories_json, // Bridge DB naming to API naming
        is_toxic: item.verdict === 'TOXIC'
    });
    setIsSidebarOpen(false);
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative selection:bg-primary selection:text-white text-slate-300">
      <Toaster position="top-right" reverseOrder={false} />
      <BackgroundEffects />
      
      <HistorySidebar 
        history={history} 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelect={handleHistorySelect}
      />

      <main className="container mx-auto relative z-10">
        <Hero />
        <InputPanel onAnalyze={handleAnalyze} />
        {result && <ResultsDisplay result={result} />}
      </main>

      <footer className="text-center py-10 text-slate-500 font-bold border-t border-white/5 bg-white/[0.02] backdrop-blur-md">
        <p>© 2026 ToxicScan AI Laboratory. Advanced Content Moderation Intelligence.</p>
      </footer>
    </div>
  );
}

export default App;
