import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { getAuthSession } from "../lib/session";
import { API } from "../lib/api";
import type { Candidate } from "../types/candidate";

export default function Dashboard() {
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const session = getAuthSession();
    const isRecruiter = session?.role !== "candidate";

    useEffect(() => {
        let cancelled = false;

        async function loadCandidates() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API}/api/candidates`);
                if (!res.ok) {
                    throw new Error(`Failed to load candidates (${res.status})`);
                }
                const data = (await res.json()) as Candidate[];
                if (!cancelled) {
                    setCandidates(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load candidates");
                    setCandidates([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCandidates();
        return () => {
            cancelled = true;
        };
    }, []);

    const levelColor = (level: string) => {
        if (level === "High") return "text-green-400 bg-green-500/10 border border-green-500/20";
        if (level === "Medium") return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
        return "text-red-400 bg-red-500/10 border border-red-500/20";
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto h-screen relative">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

                <div className="p-10 max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white">
                                {isRecruiter ? "Recruiter Intelligence Dashboard" : "Candidate Intelligence Dashboard"}
                            </h2>
                            <p className="text-white/40 text-sm mt-1">Manage and track your analyzed candidates.</p>
                        </div>

                        {isRecruiter ? (
                            <button
                                onClick={() => navigate("/scan")}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all shadow-lg shadow-white/5 active:scale-95 cursor-pointer"
                            >
                                Add Candidate
                            </button>
                        ) : null}
                    </div>

                    {loading ? (
                        <div className="min-h-[40vh] flex items-center justify-center border border-white/[0.1] rounded-2xl bg-white/[0.02]">
                            <p className="text-white/60 text-sm">Loading candidates...</p>
                        </div>
                    ) : error ? (
                        <div className="min-h-[40vh] flex items-center justify-center border border-red-500/30 rounded-2xl bg-red-500/5">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    ) : candidates.length === 0 ? (
                        <div className="min-h-[50vh] flex flex-col items-center justify-center border border-dashed border-white/[0.1] rounded-3xl bg-white/[0.02]">
                            <h3 className="text-lg font-medium text-white mb-2">No candidates scanned yet</h3>
                            <p className="text-white/40 text-sm mb-6 max-w-xs text-center">
                                Scan a GitHub/profile URL with resume text to see ATS and confidence.
                            </p>
                            {isRecruiter ? (
                                <button
                                    onClick={() => navigate("/scan")}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.05] border border-white/10 hover:bg-white/10 transition-colors text-white"
                                >
                                    Scan First Candidate
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-white/[0.1] bg-white/[0.02] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1100px] text-sm">
                                    <thead className="bg-white/[0.03] text-white/60">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-medium">Name</th>
                                            <th className="text-left px-4 py-3 font-medium">GitHub</th>
                                            <th className="text-left px-4 py-3 font-medium">ATS</th>
                                            <th className="text-left px-4 py-3 font-medium">Confidence</th>
                                            <th className="text-left px-4 py-3 font-medium">Proficiency</th>
                                            <th className="text-left px-4 py-3 font-medium">Score</th>
                                            <th className="text-left px-4 py-3 font-medium">Level</th>
                                            <th className="text-left px-4 py-3 font-medium">View Report</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidates.map((candidate, index) => (
                                            <tr key={`${candidate.id}-${index}`} className="border-t border-white/[0.06] hover:bg-white/[0.03]">
                                                <td className="px-4 py-3 text-white font-medium">{candidate.name}</td>
                                                <td className="px-4 py-3 text-white/80">{candidate.githubMonitoring?.username ?? "-"}</td>
                                                <td className="px-4 py-3 text-white/80">{candidate.resumeAnalysis?.atsScore ?? "-"}</td>
                                                <td className="px-4 py-3 text-white/80">
                                                    {candidate.resumeAnalysis ? `${candidate.resumeAnalysis.confidence}%` : "-"}
                                                </td>
                                                <td className="px-4 py-3 text-white/80">{candidate.resumeAnalysis?.proficiency ?? "-"}</td>
                                                <td className="px-4 py-3 text-white font-semibold">{candidate.score}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${levelColor(candidate.authenticityLevel)}`}>
                                                        {candidate.authenticityLevel}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => navigate(`/candidate/${candidate.id}`)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                                                    >
                                                        View Report
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
