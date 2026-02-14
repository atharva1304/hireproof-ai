import { useState, useEffect } from "react";
import type { Candidate } from "../../types/candidate";
import { API } from "../../lib/api";

interface AIRecommendation {
    recommendation: string;
    summary: string;
    interviewFocus: string[];
}

interface Props {
    candidateA: Candidate;
    candidateB: Candidate;
}

function generateFallback(a: Candidate, b: Candidate): AIRecommendation {
    const diff = Math.abs(a.score - b.score);
    const winner = a.score >= b.score ? a : b;
    const loser = a.score >= b.score ? b : a;

    if (diff <= 10) {
        return {
            recommendation: "Interview Both Candidates",
            summary: `${a.name} (score ${a.score}) and ${b.name} (score ${b.score}) are very close in overall capability. Both show strong potential — ${a.strengths[0]?.toLowerCase() || "solid fundamentals"} vs ${b.strengths[0]?.toLowerCase() || "solid fundamentals"}. A structured interview round is recommended to differentiate based on culture fit, communication, and problem-solving approach.`,
            interviewFocus: [
                "Compare problem-solving approaches with a live coding session",
                `Assess ${a.name}'s ${a.weaknesses[0]?.toLowerCase() || "areas for growth"} through targeted questions`,
                `Evaluate ${b.name}'s ${b.weaknesses[0]?.toLowerCase() || "areas for growth"} with practical scenarios`,
                "Test culture fit and team collaboration skills",
                "Discuss long-term career goals and role alignment",
            ],
        };
    }

    return {
        recommendation: `Hire ${winner.name}`,
        summary: `${winner.name} scores significantly higher (${winner.score} vs ${loser.score}) and demonstrates stronger overall capability. Key strengths include ${winner.strengths.slice(0, 2).join(" and ").toLowerCase() || "strong technical skills"}. While ${loser.name} shows potential in areas like ${loser.strengths[0]?.toLowerCase() || "certain areas"}, the gap in authenticity score and skill depth makes ${winner.name} the stronger choice for this role.`,
        interviewFocus: [
            `Verify ${winner.name}'s ${winner.weaknesses[0]?.toLowerCase() || "potential gaps"} with targeted technical questions`,
            `Deep-dive into ${winner.name}'s strongest projects to confirm hands-on experience`,
            "Ask behavioral questions about teamwork and ownership",
            `Probe risk area: ${winner.risks[0]?.toLowerCase() || "consistency of contributions"}`,
            "Discuss expected growth trajectory and learning mindset",
        ],
    };
}

export default function ComparisonAIRecommendation({ candidateA, candidateB }: Props) {
    const [result, setResult] = useState<AIRecommendation | null>(null);
    const [loading, setLoading] = useState(true);
    const [fromAI, setFromAI] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setResult(null);
        setFromAI(false);

        const fetchRecommendation = async () => {
            try {
                const res = await fetch(`${API}/api/compare`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ candidateA, candidateB }),
                });

                if (!cancelled && res.ok) {
                    const data = await res.json();
                    setResult(data);
                    setFromAI(true);
                    setLoading(false);
                    return;
                }
            } catch {
                // fall through to fallback
            }

            // Fallback: generate locally
            if (!cancelled) {
                await new Promise((r) => setTimeout(r, 1200)); // simulate thinking
                setResult(generateFallback(candidateA, candidateB));
                setLoading(false);
            }
        };

        fetchRecommendation();
        return () => { cancelled = true; };
    }, [candidateA.id, candidateB.id]);

    if (loading) {
        return (
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/20">
                <div className="flex items-center justify-center gap-3 py-6">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                    <span className="text-white/50 text-sm font-medium">Generating AI recommendation...</span>
                </div>
            </div>
        );
    }

    if (!result) return null;

    const isHireBoth = result.recommendation.toLowerCase().includes("both");

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            {/* Header */}
            <div className="px-8 py-5 border-b border-white/[0.06] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-base font-bold text-white">AI Hiring Recommendation</h3>
                    <p className="text-[10px] uppercase tracking-wider text-white/30 mt-0.5">
                        {fromAI ? "Powered by Gemini AI" : "Heuristic Analysis"}
                    </p>
                </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-6">
                {/* Recommendation Badge */}
                <div className="flex items-center gap-3">
                    <div
                        className={`px-4 py-2 rounded-xl text-sm font-bold border ${isHireBoth
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            }`}
                    >
                        {isHireBoth ? (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                                {result.recommendation}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-2.52.952m0 0a6.003 6.003 0 01-2.52-.952" />
                                </svg>
                                {result.recommendation}
                            </span>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Analysis Summary</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{result.summary}</p>
                </div>

                {/* Interview Focus */}
                {result.interviewFocus.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Suggested Interview Focus</h4>
                        <div className="space-y-2">
                            {result.interviewFocus.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                    <span className="shrink-0 w-5 h-5 rounded-md bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400">
                                        {i + 1}
                                    </span>
                                    <p className="text-white/55 text-sm leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
