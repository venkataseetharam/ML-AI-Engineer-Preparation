# AI/ML Engineer Preparation Tracker

A comprehensive web app to track your AI/ML Engineer interview preparation journey. Built with React, Firebase, and deployed on Vercel.

![AI/ML Prep Tracker](https://img.shields.io/badge/AI%2FML-Prep%20Tracker-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Features

### Track Your Progress Across 8 Key Areas:

1. **LeetCode Problems** (150 total)
   - Easy, Medium, Hard difficulty tracking
   - Visual breakdown by difficulty

2. **System Design** (15 designs)
   - Scalability patterns
   - Architecture designs

3. **ML Theory** (12 algorithms)
   - Implement ML algorithms from scratch
   - Deep understanding of fundamentals

4. **Industry-Grade Projects** (6 projects)
   - ML Project (end-to-end ML pipeline)
   - Deep Learning (computer vision, NLP)
   - RAG System (retrieval-augmented generation)
   - AI Agents (autonomous agents)
   - Fine-tuning (LLMs, domain adaptation)
   - LLM from Scratch (transformer architecture, reasoning models)

5. **Research Papers** (10 papers)
   - Read and implement key papers
   - Transformers, attention mechanisms, etc.

6. **Kaggle Competitions** (3 competitions)
   - Real-world ML challenges
   - Leaderboard experience

7. **MLOps/Deployment** (5 deployments)
   - Docker, APIs, cloud deployment
   - Production ML systems

8. **Content Creation**
   - Blog Posts (6 technical articles)
   - LinkedIn Posts (48 posts)
   - Mock Interviews (12 sessions)

### Additional Features:
- 🔥 Daily streak tracking
- 📊 Progress visualization with charts
- 📝 Daily notes and reflections
- ☁️ Cloud sync across all devices
- 📱 Mobile-responsive design
- 🔐 Google authentication
- 📈 14-day activity charts
- 💾 Data export functionality

## 🚀 Live Demo

**[View Live App](https://ml-ai-engineer-preparation.vercel.app)**

## 📋 What Makes This Different?

This tracker is specifically designed for **AI/ML Engineer roles**, not generic FAANG prep:

- **Practical Projects**: Focus on 6 industry-grade projects covering modern AI/ML
- **Research-Driven**: Track implementation of key research papers
- **MLOps Emphasis**: Includes deployment and production ML tracking
- **Kaggle Practice**: Real-world competition experience
- **No Job Applications**: Pure focus on technical preparation

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Hosting**: Vercel
- **Build Tool**: Vite

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ML-AI-Engineer-Preparation.git
   cd ML-AI-Engineer-Preparation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Google Authentication
   - Create a Firestore database
   - Copy your Firebase config

4. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Set Firestore Security Rules**
   In Firebase Console → Firestore → Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment instructions.

**Quick Deploy to Vercel:**

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

## 📊 Project Structure

```
maang-tracker/
├── src/
│   ├── App.jsx          # Main application component
│   ├── firebase.js      # Firebase configuration
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .env.example         # Environment variables template
├── DEPLOYMENT_GUIDE.md  # Deployment instructions
└── README.md            # This file
```

## 🎓 How to Use This Tracker

### Daily Workflow:
1. **Log In** with your Google account
2. **Daily Log Tab**: Record today's progress
   - LeetCode problems solved
   - System designs completed
   - ML algorithms implemented
   - Projects worked on
   - Papers read
   - Competitions participated
   - Deployments completed
3. **Dashboard Tab**: View your overall progress
4. **History Tab**: Review past activity

### Weekly Goals:
- LeetCode: 13 problems/week
- System Design: 2 designs/week
- ML Theory: 1 algorithm/week
- Projects: Complete 1 major milestone/week

### 12-Week Plan:
This tracker is designed for a **12-week intensive preparation** covering all aspects of AI/ML engineering interviews.

## 🔒 Privacy & Security

- Your data is **private** and secured by Firebase authentication
- Each user can only access their own data
- Firestore security rules enforce user isolation
- No data is shared with third parties
- The website is public, but your progress is not

## 🤝 Contributing

This is a public template! Feel free to:
- Fork this repository
- Customize for your needs
- Submit issues or PRs
- Share with others

## 📝 Customization Ideas

- Adjust targets in `src/App.jsx` → `TARGETS` object
- Add/remove project categories
- Modify the 12-week duration
- Change color scheme in Tailwind config
- Add more tracking fields

## 📄 License

MIT License - feel free to use this for your own preparation!

## 🙏 Acknowledgments

- Built as a comprehensive AI/ML preparation tool
- Inspired by the need for structured technical prep
- Designed for public sharing and community benefit

## 📬 Contact & Support

- **GitHub**: [Your GitHub](https://github.com/venkataseetharam)
- **Live App**: [ml-ai-engineer-preparation.vercel.app](https://ml-ai-engineer-preparation.vercel.app)

## 🎯 Recommended Resources

### LeetCode:
- Focus on: Arrays, Trees, Graphs, Dynamic Programming
- NeetCode 150 list
- Company-tagged questions

### System Design:
- Grokking the System Design Interview
- System Design Primer (GitHub)
- Design data-intensive applications

### ML Theory:
- Implement from scratch: Linear Regression, Decision Trees, Neural Networks
- Deep Learning Specialization (Coursera)
- Fast.ai courses

### Projects:
1. **ML**: Predictive model with full pipeline
2. **DL**: Image classification or NLP task
3. **RAG**: Document Q&A system
4. **Agents**: Multi-agent system or autonomous agent
5. **Fine-tuning**: Fine-tune LLM for specific domain
6. **LLM**: Build transformer or reasoning model

### Papers to Implement:
- Attention Is All You Need (Transformers)
- BERT, GPT series
- ResNet, Vision Transformers
- RAG, ReAct, Chain-of-Thought

### MLOps:
- FastAPI for model serving
- Docker containerization
- AWS SageMaker / GCP AI Platform
- ML monitoring and logging

---

**Good luck with your AI/ML Engineer preparation! 🚀**

If you find this helpful, please ⭐ star the repo and share with others!
