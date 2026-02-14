interface Props {
    score: number;
    riskLevel: "Low" | "Medium" | "High";
    authenticityLevel: "High" | "Medium" | "Low";
}

export default function AuthenticityScoreCard({ score, riskLevel, authenticityLevel }: Props) {
    const radius = 90;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = (score / 100) * circumference;
    const offset = circumference - progress;

    const color =
        score > 75
            ? { ring: "#10b981", glow: "rgba(16,185,129,0.3)", text: "text-emerald-400", label: "Excellent" }
            : score >= 45
                ? { ring: "#f59e0b", glow: "rgba(245,158,11,0.3)", text: "text-amber-400", label: "Moderate" }
                : { ring: "#ef4444", glow: "rgba(239,68,68,0.3)", text: "text-red-400", label: "Poor" };

    const confidence = score > 75 ? 92 : score >= 45 ? 74 : 45;

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Authenticity Assessment
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score Circle */}
                <div className="relative shrink-0" style={{ width: radius * 2, height: radius * 2 }}>
                    <div
                        className="absolute inset-0 rounded-full blur-2xl opacity-40"
                        style={{ backgroundColor: color.glow }}
                    />
                    <svg width={radius * 2} height={radius * 2} className="relative z-10 -rotate-90">
                        <circle
                            cx={radius} cy={radius} r={normalizedRadius}
                            fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
                        />
                        <circle
                            cx={radius} cy={radius} r={normalizedRadius}
                            fill="transparent" stroke={color.ring} strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={circumference} strokeDashoffset={offset}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        <span className="text-xs font-medium uppercase tracking-widest text-white/40">Score</span>
                        <span className={`text-5xl font-bold ${color.text}`}>{score}</span>
                        <span className={`text-xs font-semibold ${color.text} mt-1`}>{color.label}</span>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4 w-full">
                    {/* Risk Level */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-sm text-white/50">Risk Level</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${riskLevel === "Low"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : riskLevel === "Medium"
                                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                    : "bg-red-500/15 text-red-400 border-red-500/30"
                            }`}>
                            {riskLevel}
                        </span>
                    </div>

                    {/* Authenticity */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <span className="text-sm text-white/50">Authenticity</span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${authenticityLevel === "High"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : authenticityLevel === "Medium"
                                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                    : "bg-red-500/15 text-red-400 border-red-500/30"
                            }`}>
                            {authenticityLevel}
                        </span>
                    </div>

                    {/* Confidence Indicator */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/50">Confidence</span>
                            <span className="text-sm font-semibold text-white/80">{confidence}%</span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000 ease-out"
                                style={{ width: `${confidence}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-white/40 leading-relaxed">
                        {score > 75
                            ? "Profile demonstrates strong authenticity signals with consistent, genuine contributions."
                            : score >= 45
                                ? "Moderate confidence in profile authenticity. Some areas may need further verification."
                                : "Low authenticity score detected. Significant red flags require careful evaluation."}
                    </p>
                </div>
            </div>
        </div>
    );
}
