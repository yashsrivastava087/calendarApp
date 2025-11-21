import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  LogOut,
  Video,
  Server,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

// --- Configuration ---
// Set to TRUE to default to Real Backend
const USE_REAL_BACKEND = true;
const API_BASE_URL = "http://localhost:3000";

// --- Types ---
interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: { email: string }[];
  description?: string;
  link?: string;
}
interface User {
  name: string;
  email: string;
  avatar: string;
}

// --- Services ---
const login = async (useReal: boolean): Promise<User | null> => {
  if (!useReal) {
    // Mock Login
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            name: "Demo User",
            email: "demo@example.com",
            avatar:
              "https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff",
          }),
        800
      )
    );
  }

  // Real Login
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, { method: "POST" });
    const data = await res.json();

    if (data.user) return data.user; // Already logged in
    if (data.authUrl) {
      window.location.href = data.authUrl; // Redirect to Google
      return null;
    }
    throw new Error("Server returned invalid login state");
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

const fetchMeetings = async (useReal: boolean) => {
  if (!useReal) {
    // Mock Data
    return { upcoming: [], past: [] };
  }
  const res = await fetch(`${API_BASE_URL}/api/meetings`);
  if (!res.ok) throw new Error("Failed to fetch");
  return await res.json();
};

// --- Components ---
const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-4 hover:shadow-md transition-all">
    <div className="flex justify-between mb-2">
      <div>
        <div className="flex items-center text-sm text-blue-600 font-medium mb-1">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(meeting.startTime).toLocaleDateString()}
        </div>
        <h3 className="font-bold text-gray-900">{meeting.title}</h3>
      </div>
      <div className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-100 h-fit text-gray-500 flex items-center">
        <Clock className="w-3 h-3 mr-1" />
        {new Date(meeting.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <div className="flex items-center">
        <Users className="w-3 h-3 mr-1" /> {meeting.attendees.length}
      </div>
      {meeting.link && (
        <div className="flex items-center text-blue-600">
          <Video className="w-3 h-3 mr-1" /> Video
        </div>
      )}
    </div>
  </div>
);

export default function App() {
  const [useReal, setUseReal] = useState(USE_REAL_BACKEND);
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<{ upcoming: Meeting[]; past: Meeting[] }>({
    upcoming: [],
    past: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Google Redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success" && useReal) {
      handleLogin();
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await login(useReal);
      if (userData) {
        setUser(userData);
        const meetings = await fetchMeetings(useReal);
        setData(meetings);
      }
    } catch (e) {
      setError("Connection failed. Is the backend running on port 3000?");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setUseReal(!useReal)}
            className="text-xs bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <Server className="w-3 h-3" /> Mode:{" "}
            {useReal ? "Real Backend" : "Mock Data"}
          </button>
        </div>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Calendar Connect
          </h1>
          <p className="text-gray-500 mb-8">
            Securely connect your Google Calendar
          </p>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign in with Google"
            )}
          </button>
          {error && (
            <div className="mt-4 text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl">My Calendar</h1>
        </div>
        <button
          onClick={() => setUser(null)}
          className="text-gray-400 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="font-bold text-lg mb-4 text-gray-700 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Upcoming
          </h2>
          {data.upcoming.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
          {data.upcoming.length === 0 && (
            <p className="text-gray-400 italic">No upcoming meetings.</p>
          )}
        </section>
        <section>
          <h2 className="font-bold text-lg mb-4 text-gray-700 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Past
          </h2>
          {data.past.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
          {data.past.length === 0 && (
            <p className="text-gray-400 italic">No past meetings.</p>
          )}
        </section>
      </main>
    </div>
  );
}
