import { useState } from "react";

interface Props {
    questions: string[];
}

export default function InterviewSection({ questions }: Props) {
    const [showQuestions, setShowQuestions] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setShowQuestions(true);
        }, 1500);
    };

    // Categorize questions
    const technical = questions.slice(0, Math.ceil(questions.length * 0.4));
    const project = questions.slice(Math.ceil(questions.length * 0.4), Math.ceil(questions.length * 0.7));
    const systemDesign = questions.slice(Math.ceil(questions.length * 0.7));

    const categories = [
        { label: "Technical", items: technical, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/10" },
        { label: "Project-Based", items: project, color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/10" },
        { label: "System Design", items: systemDesign, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10" },
    ];

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                    Interview Copilot
                </h3>

                {!showQuestions && (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-60"
                    >
                        {generating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </span>
                        ) : (
                            "Generate Interview Questions"
                        )}
                    </button>
                )}
            </div>

            {showQuestions && (
                <div className="space-y-6">
                    {categories.map(({ label, items, color, border, bg }) =>
                        items.length > 0 ? (
                            <div key={label}>
                                <p className={`text-xs font-bold uppercase tracking-wider ${color} mb-3`}>{label}</p>
                                <div className="space-y-2">
                                    {items.map((q, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border ${border} hover:bg-white/[0.04] transition-colors`}
                                        >
                                            <span className={`shrink-0 w-7 h-7 rounded-lg ${bg} flex items-center justify-center text-xs font-bold ${color}`}>
                                                {i + 1}
                                            </span>
                                            <p className="text-white/70 text-sm leading-relaxed pt-0.5">{q}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            )}

            {!showQuestions && !generating && (
                <p className="text-white/30 text-sm text-center py-8">
                    Click "Generate" to create personalized interview questions based on the candidate's profile.
                </p>
            )}
        </div>
    );
}
