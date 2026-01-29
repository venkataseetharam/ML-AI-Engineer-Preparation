import React, { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import {
  Target, TrendingUp, Calendar, Award, BookOpen, Code, Brain,
  FileText, Download, Plus, Check, Flame, Clock,
  LogOut, User, Loader, Moon, Sun
} from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import ShortcutsPanel from './components/common/ShortcutsPanel';
import HeatmapCalendar from './components/dashboard/HeatmapCalendar';
import TimeDistributionChart from './components/dashboard/TimeDistributionChart';
import WeeklyTimeStats from './components/dashboard/WeeklyTimeStats';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const TARGETS = {
  leetcode: 150,
  systemDesign: 15,
  mlTheory: 12,
  projects: 6,
  mockInterviews: 12,
  researchPapers: 10,
  blogPosts: 6,
  linkedinPosts: 48
};

const defaultData = {
  dailyLogs: [],
  startDate: new Date().toISOString().split('T')[0],
  settings: {
    weeklyGoals: {
      leetcode: 13,
      systemDesign: 2,
      mlTheory: 1,
      projects: 1
    }
  }
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(defaultData);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [saving, setSaving] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [todayLog, setTodayLog] = useState({
    date: new Date().toISOString().split('T')[0],
    leetcodeEasy: 0,
    leetcodeMedium: 0,
    leetcodeHard: 0,
    systemDesign: 0,
    mlTheory: 0,
    projectML: false,
    projectDL: false,
    projectRAG: false,
    projectAgents: false,
    projectFineTuning: false,
    projectLLM: false,
    mockInterview: false,
    researchPaper: false,
    blogPost: false,
    linkedinPost: false,
    notes: '',
    timeSpent: {
      leetcode: 0,
      systemDesign: 0,
      mlTheory: 0,
      projects: 0,
      reading: 0,
      other: 0
    }
  });

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore listener for real-time data sync
  useEffect(() => {
    const ownerUID = import.meta.env.VITE_PUBLIC_OWNER_UID;
    const userToFetch = user ? user.uid : ownerUID;

    if (!userToFetch || userToFetch === 'YOUR_USER_ID_HERE') {
      setData(defaultData);
      return;
    }

    const docRef = doc(db, 'users', userToFetch);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else if (user) {
        // Initialize new user data only if they're logged in
        setDoc(docRef, defaultData);
      } else {
        // Owner hasn't created data yet
        setData(defaultData);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Log user ID when signed in (for copying to env file)
  useEffect(() => {
    if (user) {
      console.log('🔑 Your Firebase User ID (copy this to .env.local as VITE_PUBLIC_OWNER_UID):', user.uid);
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setData(defaultData);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const saveToFirestore = async (newData) => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, newData, { merge: true });
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  const handleLogSubmit = async () => {
    const existingIndex = data.dailyLogs.findIndex(log => log.date === todayLog.date);
    let newLogs;
    if (existingIndex >= 0) {
      newLogs = [...data.dailyLogs];
      newLogs[existingIndex] = todayLog;
    } else {
      newLogs = [...data.dailyLogs, todayLog];
    }
    const sortedLogs = newLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const newData = { ...data, dailyLogs: sortedLogs };
    setData(newData);
    await saveToFirestore(newData);
    alert('Progress saved to cloud!');
  };

  const calculateTotals = () => {
    return data.dailyLogs.reduce((acc, log) => ({
      leetcode: acc.leetcode + (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0),
      leetcodeEasy: acc.leetcodeEasy + (log.leetcodeEasy || 0),
      leetcodeMedium: acc.leetcodeMedium + (log.leetcodeMedium || 0),
      leetcodeHard: acc.leetcodeHard + (log.leetcodeHard || 0),
      systemDesign: acc.systemDesign + (log.systemDesign || 0),
      mlTheory: acc.mlTheory + (log.mlTheory || 0),
      projects: acc.projects + (log.projectML ? 1 : 0) + (log.projectDL ? 1 : 0) + (log.projectRAG ? 1 : 0) +
                (log.projectAgents ? 1 : 0) + (log.projectFineTuning ? 1 : 0) + (log.projectLLM ? 1 : 0),
      mockInterviews: acc.mockInterviews + (log.mockInterview ? 1 : 0),
      researchPapers: acc.researchPapers + (log.researchPaper ? 1 : 0),
      blogPosts: acc.blogPosts + (log.blogPost ? 1 : 0),
      linkedinPosts: acc.linkedinPosts + (log.linkedinPost ? 1 : 0)
    }), {
      leetcode: 0, leetcodeEasy: 0, leetcodeMedium: 0, leetcodeHard: 0,
      systemDesign: 0, mlTheory: 0, projects: 0,
      mockInterviews: 0, researchPapers: 0,
      blogPosts: 0, linkedinPosts: 0
    });
  };

  const calculateStreak = () => {
    if (data.dailyLogs.length === 0) return 0;
    const sortedLogs = [...data.dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        const hasActivity = (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0) > 0 ||
                          log.systemDesign > 0 || log.mlTheory > 0 || log.projectML || log.projectDL ||
                          log.projectRAG || log.projectAgents || log.projectFineTuning || log.projectLLM;
        if (hasActivity) {
          streak++;
          currentDate = logDate;
        } else break;
      } else break;
    }
    return streak;
  };

  const getWeekNumber = () => {
    if (!data.startDate) return 1;
    const start = new Date(data.startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(12, Math.ceil(diffDays / 7) || 1);
  };

  const calculateWeeklyProgress = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Get Monday of current week
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const weekLogs = data.dailyLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= monday && logDate <= now;
    });

    return weekLogs.reduce((acc, log) => ({
      leetcode: acc.leetcode + (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0),
      systemDesign: acc.systemDesign + (log.systemDesign || 0),
      mlTheory: acc.mlTheory + (log.mlTheory || 0),
      projects: acc.projects + (log.projectML ? 1 : 0) + (log.projectDL ? 1 : 0) + (log.projectRAG ? 1 : 0) +
                (log.projectAgents ? 1 : 0) + (log.projectFineTuning ? 1 : 0) + (log.projectLLM ? 1 : 0)
    }), {
      leetcode: 0,
      systemDesign: 0,
      mlTheory: 0,
      projects: 0
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aiml-prep-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+d': () => setActiveTab('dashboard'),
    'ctrl+l': () => user && setActiveTab('log'),
    'ctrl+h': () => setActiveTab('history'),
    'ctrl+c': () => setActiveTab('content'),
    'ctrl+s': (e) => {
      e?.preventDefault();
      if (user && activeTab === 'log') {
        handleLogSubmit();
      }
    },
    'ctrl+e': () => user && exportData(),
    'ctrl+shift+t': () => toggleTheme(),
    'esc': () => setShowShortcuts(false),
    '?': () => setShowShortcuts(prev => !prev),
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  // Show demo data if not logged in
  const isReadOnly = !user;

  const totals = calculateTotals();
  const streak = calculateStreak();
  const week = getWeekNumber();

  const weeklyProgress = calculateWeeklyProgress();
  const weeklyGoals = data.settings?.weeklyGoals || defaultData.settings.weeklyGoals;

  const progressData = [
    { name: 'LeetCode', current: totals.leetcode, target: TARGETS.leetcode, percent: Math.round((totals.leetcode / TARGETS.leetcode) * 100) },
    { name: 'Sys Design', current: totals.systemDesign, target: TARGETS.systemDesign, percent: Math.round((totals.systemDesign / TARGETS.systemDesign) * 100) },
    { name: 'ML Theory', current: totals.mlTheory, target: TARGETS.mlTheory, percent: Math.round((totals.mlTheory / TARGETS.mlTheory) * 100) },
    { name: 'Projects', current: totals.projects, target: TARGETS.projects, percent: Math.round((totals.projects / TARGETS.projects) * 100) },
    { name: 'Mocks', current: totals.mockInterviews, target: TARGETS.mockInterviews, percent: Math.round((totals.mockInterviews / TARGETS.mockInterviews) * 100) },
    { name: 'Papers', current: totals.researchPapers, target: TARGETS.researchPapers, percent: Math.round((totals.researchPapers / TARGETS.researchPapers) * 100) },
  ];

  const weeklyProgressData = [
    { name: 'LeetCode', current: weeklyProgress.leetcode, target: weeklyGoals.leetcode || 13, percent: Math.round((weeklyProgress.leetcode / (weeklyGoals.leetcode || 13)) * 100) },
    { name: 'System Design', current: weeklyProgress.systemDesign, target: weeklyGoals.systemDesign || 2, percent: Math.round((weeklyProgress.systemDesign / (weeklyGoals.systemDesign || 2)) * 100) },
    { name: 'ML Theory', current: weeklyProgress.mlTheory, target: weeklyGoals.mlTheory || 1, percent: Math.round((weeklyProgress.mlTheory / (weeklyGoals.mlTheory || 1)) * 100) },
    { name: 'Projects', current: weeklyProgress.projects, target: weeklyGoals.projects || 1, percent: Math.round((weeklyProgress.projects / (weeklyGoals.projects || 1)) * 100) },
  ];

  const chartData = data.dailyLogs.slice(-14).map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    leetcode: (log.leetcodeEasy || 0) + (log.leetcodeMedium || 0) + (log.leetcodeHard || 0),
    systemDesign: log.systemDesign || 0,
    mlTheory: log.mlTheory || 0
  }));

  const difficultyData = [
    { name: 'Easy', value: totals.leetcodeEasy, color: '#10B981' },
    { name: 'Medium', value: totals.leetcodeMedium, color: '#F59E0B' },
    { name: 'Hard', value: totals.leetcodeHard, color: '#EF4444' }
  ].filter(d => d.value > 0);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'log', label: 'Daily Log', icon: Plus },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'content', label: 'Content', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">AI/ML Engineer Prep Tracker</h1>
            <p className="text-gray-400">Week {week} of 12 • {Math.max(0, 12 - week)} weeks remaining</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                {saving && <Loader className="w-4 h-4 text-blue-400 animate-spin" />}
                <button onClick={exportData} className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-sm">
                  <Download size={16} /> Export
                </button>
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-sm hidden sm:inline">{user.displayName?.split(' ')[0]}</span>
                </div>
                <button onClick={handleSignOut} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <User size={18} />
                Sign In to Track Progress
              </button>
            )}
          </div>
        </div>

        {/* User ID Banner - Show when logged in and owner UID not configured */}
        {user && import.meta.env.VITE_PUBLIC_OWNER_UID === 'YOUR_USER_ID_HERE' && (
          <div className="bg-blue-900/40 border border-blue-600 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="font-semibold text-blue-300 mb-1">🔑 Enable Public Sharing</p>
                <p className="text-sm text-blue-200">Copy your User ID below to enable public viewing:</p>
              </div>
              <div className="flex gap-2 items-center bg-gray-900/50 px-4 py-2 rounded-lg">
                <code className="text-xs sm:text-sm text-green-300 font-mono">{user.uid}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.uid);
                    alert('User ID copied! Now paste it in .env.local as VITE_PUBLIC_OWNER_UID');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm whitespace-nowrap"
                >
                  Copy ID
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.filter(tab => user || tab.id !== 'log').map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={20} />
                  <span className="text-sm opacity-90">Streak</span>
                </div>
                <div className="text-3xl font-bold">{streak} days</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Code size={20} />
                  <span className="text-sm opacity-90">LeetCode</span>
                </div>
                <div className="text-3xl font-bold">{totals.leetcode}</div>
                <div className="text-sm opacity-75">/ {TARGETS.leetcode}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={20} />
                  <span className="text-sm opacity-90">System Design</span>
                </div>
                <div className="text-3xl font-bold">{totals.systemDesign}</div>
                <div className="text-sm opacity-75">/ {TARGETS.systemDesign}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={20} />
                  <span className="text-sm opacity-90">Projects</span>
                </div>
                <div className="text-3xl font-bold">{totals.projects}</div>
                <div className="text-sm opacity-75">/ {TARGETS.projects}</div>
              </div>
            </div>

            {/* Weekly Dashboard */}
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl border border-blue-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={24} className="text-blue-400" />
                This Week's Goals
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {weeklyProgressData.map((item) => (
                  <div key={item.name} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">{item.name}</div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-white">{item.current}</span>
                      <span className="text-gray-400">/ {item.target}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.current >= item.target ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, item.percent)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.current >= item.target ? '✓ Complete!' : `${item.target - item.current} remaining`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Heatmap */}
            <HeatmapCalendar dailyLogs={data.dailyLogs} />

            {/* Time Distribution Chart and Weekly Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeDistributionChart dailyLogs={data.dailyLogs} period="week" />
              <WeeklyTimeStats dailyLogs={data.dailyLogs} />
            </div>

            {/* Progress Bars */}
            <div className="bg-gray-800 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target size={20} className="text-blue-400" />
                12-Week Progress
              </h3>
              <div className="space-y-4">
                {progressData.map((item, idx) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.name}</span>
                      <span className="text-gray-400">{item.current} / {item.target} ({Math.min(100, item.percent)}%)</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.percent)}%`, backgroundColor: COLORS[idx] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Last 14 Days</h3>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                      <Legend />
                      <Bar dataKey="leetcode" name="LeetCode" fill="#3B82F6" />
                      <Bar dataKey="systemDesign" name="Sys Design" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-500">
                    Start logging to see your progress!
                  </div>
                )}
              </div>

              <div className="bg-gray-800 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">LeetCode by Difficulty</h3>
                {difficultyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-500">
                    No problems logged yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily Log Tab */}
        {activeTab === 'log' && (
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Plus size={24} className="text-green-400" />
              Log Today's Progress
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Date</label>
                <input
                  type="date"
                  value={todayLog.date}
                  onChange={(e) => setTodayLog({ ...todayLog, date: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Code size={18} className="text-blue-400" />
                  LeetCode Problems
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-green-400 mb-1">Easy</label>
                    <input
                      type="number"
                      min="0"
                      value={todayLog.leetcodeEasy}
                      onChange={(e) => setTodayLog({ ...todayLog, leetcodeEasy: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-yellow-400 mb-1">Medium</label>
                    <input
                      type="number"
                      min="0"
                      value={todayLog.leetcodeMedium}
                      onChange={(e) => setTodayLog({ ...todayLog, leetcodeMedium: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-red-400 mb-1">Hard</label>
                    <input
                      type="number"
                      min="0"
                      value={todayLog.leetcodeHard}
                      onChange={(e) => setTodayLog({ ...todayLog, leetcodeHard: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">System Designs</label>
                  <input
                    type="number"
                    min="0"
                    value={todayLog.systemDesign}
                    onChange={(e) => setTodayLog({ ...todayLog, systemDesign: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">ML Algos Implemented</label>
                  <input
                    type="number"
                    min="0"
                    value={todayLog.mlTheory}
                    onChange={(e) => setTodayLog({ ...todayLog, mlTheory: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              {/* Time Tracking Section */}
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock size={18} className="text-blue-400" />
                  Time Spent Today (hours)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">LeetCode</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={todayLog.timeSpent.leetcode}
                      onChange={(e) => setTodayLog({
                        ...todayLog,
                        timeSpent: { ...todayLog.timeSpent, leetcode: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">System Design</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={todayLog.timeSpent.systemDesign}
                      onChange={(e) => setTodayLog({
                        ...todayLog,
                        timeSpent: { ...todayLog.timeSpent, systemDesign: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">ML Theory</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={todayLog.timeSpent.mlTheory}
                      onChange={(e) => setTodayLog({
                        ...todayLog,
                        timeSpent: { ...todayLog.timeSpent, mlTheory: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Projects</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={todayLog.timeSpent.projects}
                      onChange={(e) => setTodayLog({
                        ...todayLog,
                        timeSpent: { ...todayLog.timeSpent, projects: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Reading</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={todayLog.timeSpent.reading}
                      onChange={(e) => setTodayLog({
                        ...todayLog,
                        timeSpent: { ...todayLog.timeSpent, reading: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Other</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={todayLog.timeSpent.other}
                      onChange={(e) => setTodayLog({
                        ...todayLog,
                        timeSpent: { ...todayLog.timeSpent, other: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-600 rounded px-3 py-2 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Total: {(
                    todayLog.timeSpent.leetcode +
                    todayLog.timeSpent.systemDesign +
                    todayLog.timeSpent.mlTheory +
                    todayLog.timeSpent.projects +
                    todayLog.timeSpent.reading +
                    todayLog.timeSpent.other
                  ).toFixed(1)} hours
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target size={18} className="text-purple-400" />
                  Industry-Grade Projects
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todayLog.projectML}
                      onChange={(e) => setTodayLog({ ...todayLog, projectML: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">ML Project</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todayLog.projectDL}
                      onChange={(e) => setTodayLog({ ...todayLog, projectDL: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Deep Learning</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todayLog.projectRAG}
                      onChange={(e) => setTodayLog({ ...todayLog, projectRAG: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">RAG System</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todayLog.projectAgents}
                      onChange={(e) => setTodayLog({ ...todayLog, projectAgents: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">AI Agents</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todayLog.projectFineTuning}
                      onChange={(e) => setTodayLog({ ...todayLog, projectFineTuning: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Fine-tuning</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todayLog.projectLLM}
                      onChange={(e) => setTodayLog({ ...todayLog, projectLLM: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">LLM/Reasoning</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={todayLog.mockInterview}
                    onChange={(e) => setTodayLog({ ...todayLog, mockInterview: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm">Mock Interview</span>
                </label>
                <label className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={todayLog.researchPaper}
                    onChange={(e) => setTodayLog({ ...todayLog, researchPaper: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm">Research Paper</span>
                </label>
                <label className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={todayLog.blogPost}
                    onChange={(e) => setTodayLog({ ...todayLog, blogPost: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm">Blog Post</span>
                </label>
                <label className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600">
                  <input
                    type="checkbox"
                    checked={todayLog.linkedinPost}
                    onChange={(e) => setTodayLog({ ...todayLog, linkedinPost: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm">LinkedIn Post</span>
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Notes</label>
                <textarea
                  value={todayLog.notes}
                  onChange={(e) => setTodayLog({ ...todayLog, notes: e.target.value })}
                  placeholder="What did you learn today?"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 h-24 resize-none"
                />
              </div>

              <button
                onClick={handleLogSubmit}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Check size={20} />}
                {saving ? 'Saving...' : 'Save Progress'}
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Calendar size={24} className="text-purple-400" />
              Activity History
            </h3>

            {data.dailyLogs.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {[...data.dailyLogs].reverse().map((log, idx) => (
                  <div key={idx} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">
                        {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex gap-2">
                        {log.mockInterview && <span className="text-xs bg-purple-600 px-2 py-1 rounded">Mock</span>}
                        {log.blogPost && <span className="text-xs bg-pink-600 px-2 py-1 rounded">Blog</span>}
                        {log.linkedinPost && <span className="text-xs bg-blue-600 px-2 py-1 rounded">LinkedIn</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">LC: </span>
                        <span className="text-green-400">{log.leetcodeEasy || 0}</span>/
                        <span className="text-yellow-400">{log.leetcodeMedium || 0}</span>/
                        <span className="text-red-400">{log.leetcodeHard || 0}</span>
                      </div>
                      <div><span className="text-gray-400">SD: </span>{log.systemDesign || 0}</div>
                      <div><span className="text-gray-400">ML: </span>{log.mlTheory || 0}</div>
                      <div><span className="text-gray-400">Proj: </span>{log.projectHours || 0}h</div>
                    </div>
                    {log.notes && <p className="text-sm text-gray-400 mt-2 italic">"{log.notes}"</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                No logs yet. Start tracking!
              </div>
            )}
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText size={24} className="text-pink-400" />
                Content Tracking
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-pink-400 mb-2">{totals.blogPosts}</div>
                  <div className="text-gray-400 mb-4">Blog Posts</div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full"
                      style={{ width: `${Math.min(100, (totals.blogPosts / TARGETS.blogPosts) * 100)}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Target: {TARGETS.blogPosts}</div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{totals.linkedinPosts}</div>
                  <div className="text-gray-400 mb-4">LinkedIn Posts</div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, (totals.linkedinPosts / TARGETS.linkedinPosts) * 100)}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Target: {TARGETS.linkedinPosts}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>☁️ Data syncs automatically to cloud</p>
        </div>
      </div>

      {/* Keyboard Shortcuts Panel */}
      <ShortcutsPanel
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
