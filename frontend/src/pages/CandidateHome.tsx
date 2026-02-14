import { useNavigate } from "react-router-dom";
import { getAuthSession, clearAuthSession } from "../lib/session";

export default function CandidateHome() {
    const navigate = useNavigate();
    const session = getAuthSession();

    const handleLogout = () => {
        clearAuthSession();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
                <h1 className="text-xl font-bold">
                    Hire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Proof</span>{" "}
                    <span className="text-white/60 font-light">AI</span>
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-white/50">
                        {session?.user?.name || "Candidate"}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg text-sm font-medium border border-white/[0.1] text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-8 py-16">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 flex items-center justify-center">
                        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-bold">
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{session?.user?.name || "Candidate"}</span>
                    </h2>

                    <p className="text-white/40 max-w-lg mx-auto">
                        Your candidate dashboard is coming soon. You'll be able to view your skill profile, assessments, and reports here.
                    </p>

                    <div className="pt-6 flex justify-center gap-4">
                        <button
                            onClick={() => navigate("/profile")}
                            className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
                        >
                            View Profile
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
