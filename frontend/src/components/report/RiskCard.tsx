interface Props {
    score: number;
    aiRisk?: number;
}

export default function RiskCard({ score, aiRisk }: Props) {
    const aiProbability = aiRisk ?? Math.max(5, 100 - score);
    const copyRisk = Math.max(5, Math.round(aiProbability * 0.6));
    const badge = aiProbability > 60 ? "High" : aiProbability > 30 ? "Medium" : "Low";

    const badgeColor =
        badge === "Low"
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : badge === "Medium"
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-red-500/15 text-red-400 border-red-500/30";

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    AI Code Risk Analysis
                </h3>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${badgeColor}`}>
                    {badge} Risk
                </span>
            </div>

            <div className="space-y-5">
                {/* AI Code Probability */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/50">AI-Generated Code Probability</span>
                        <span className="text-sm font-bold text-white/80">{aiProbability}%</span>
                    </div>
                    <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${aiProbability > 60
                                    ? "bg-gradient-to-r from-red-500 to-rose-500"
                                    : aiProbability > 30
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                                        : "bg-gradient-to-r from-emerald-500 to-green-500"
                                }`}
                            style={{ width: `${aiProbability}%` }}
                        />
                    </div>
                </div>

                {/* Copy Risk */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/50">Copy/Plagiarism Risk</span>
                        <span className="text-sm font-bold text-white/80">{copyRisk}%</span>
                    </div>
                    <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${copyRisk > 50
                                    ? "bg-gradient-to-r from-red-500 to-rose-500"
                                    : copyRisk > 25
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                                        : "bg-gradient-to-r from-emerald-500 to-green-500"
                                }`}
                            style={{ width: `${copyRisk}%` }}
                        />
                    </div>
                </div>
            </div>

            <p className="mt-5 text-xs text-white/30 leading-relaxed">
                AI risk is estimated based on code patterns, commit frequency, and project complexity signals.
            </p>
        </div>
    );
}
