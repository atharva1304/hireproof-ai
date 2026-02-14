import type { GitHubMonitoring } from "../../types/candidate";

interface Props {
    monitoring?: GitHubMonitoring;
    score: number;
}

export default function ContributionCard({ monitoring, score }: Props) {
    const depth = monitoring
        ? Math.min(100, Math.round((monitoring.complexityScore + monitoring.collaborationScore) / 2))
        : Math.min(100, Math.round(score * 0.85));

    const soloRatio = monitoring
        ? Math.max(20, 100 - monitoring.collaborationScore)
        : 65;

    const complexity = monitoring
        ? monitoring.complexityScore
        : Math.min(100, Math.round(score * 0.7));

    const items = [
        { label: "Contribution Depth", value: depth, color: "from-purple-500 to-blue-500" },
        { label: "Solo Contribution", value: soloRatio, suffix: "%", color: "from-cyan-500 to-emerald-500" },
        { label: "Code Complexity", value: complexity, color: "from-amber-500 to-orange-500" },
    ];

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                Contribution Depth
            </h3>

            <div className="space-y-5">
                {items.map(({ label, value, color }) => (
                    <div key={label}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/50">{label}</span>
                            <span className="text-sm font-bold text-white/80">{value}%</span>
                        </div>
                        <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
                                style={{ width: `${value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {monitoring && (
                <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-2xl font-bold text-white">{monitoring.repoCount}</p>
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Repos</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-2xl font-bold text-white">{monitoring.totalCommits}</p>
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Commits</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-2xl font-bold text-white">{monitoring.contributionConsistency}%</p>
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Consistency</p>
                    </div>
                </div>
            )}
        </div>
    );
}
