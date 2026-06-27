# ☢️ ToxicScan: AI-Powered Comment Guardian

🚀 **Live Demo:** [https://toxic-comment-analyzer-neon.vercel.app](https://toxic-comment-analyzer-neon.vercel.app)  
📦 **GitHub:** [https://github.com/shubhamgautam05/Toxic_Comment_Analyzer](https://github.com/shubhamgautam05/Toxic_Comment_Analyzer) 

ToxicScan is a high-performance, full-stack AI application designed to detect and categorize toxicity in both text and images. Built with a sophisticated light-themed interface and powered by state-of-the-art local NLP models, it provides real-time, high-accuracy analysis across 6 toxicity categories.

---

## 🚀 Features

- **Text Analysis**: Real-time toxicity detection using a local `Toxic-BERT` model.
- **Image OCR**: Extracts text from images using `EasyOCR` for cross-media analysis.
- **Detailed Categorization**: Detects levels of *Toxicity, Severe Toxicity, Obscenity, Threats, Insults,* and *Identity Hate*.
- **Word Attribution**: Highlights specific tokens in the text that triggered the detector with wavy animations.
- **Analysis History**: Persistently tracks previous scans using an integrated SQLite database.
- **AI-Lab UI**: A professional, premium light-themed interface with fluid animations using Framer Motion.
- **Floating Toxic Visuals**: Dynamic floating "toxic" elements that react to the user's presence.

---

## 🛠️ Technical Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (Premium Light Theme)
- **Animations**: Framer Motion
- **Data Visualization**: Recharts (for toxicity scoring)

### **Backend**
- **API Framework**: FastAPI (Asynchronous Python)
- **AI Engine**: 
  - `Toxic-BERT` (Local Transformer model for high-accuracy NLP)
  - `EasyOCR` (Computer Vision for text extraction from images)
- **Database**: SQLite with SQLAlchemy ORM
- **Containerization**: Docker & Docker Compose (with Hot Module Replacement)

---

## 📦 Installation & Setup

### **Prerequisites**
- Docker Desktop installed and running.
- Git installed.

### **Run with Docker (Live Dev Mode)**
1. Clone the repository:
   ```bash
   git clone https://github.com/shubhamgautam05/Toxic_Comment_Analyzer.git
   cd Toxic_Comment_Analyzer
   ```
2. Build and launch:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 How it Works

1. **Input**: Users provide a text snippet or upload an image containing text.
2. **Preprocessing**: The backend cleans the input and extracts text from images if necessary.
3. **Inference**: The local `Toxic-BERT` model calculates a probability score (0 to 1) for various toxicity categories.
4. **Attribution**: The system identifies which words contributed most to the score.
5. **Storage**: Results are logged in the database for history tracking.
6. **Visualization**: The React frontend displays the results with dynamic charts and highlighted text animations.

---

## 📁 Project Structure

```
Toxic_Comment_Analyzer/
├── frontend/          # React 18 + Vite + Tailwind CSS
├── backend/           # FastAPI + Toxic-BERT + EasyOCR + SQLite
├── docker-compose.yml # Full-stack container orchestration
└── README.md
```

---

## 👤 Author

**Shubham Gautam**  
GitHub: [@shubhamgautam05](https://github.com/shubhamgautam05)
