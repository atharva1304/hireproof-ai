import type { Candidate } from "../../types/candidate";

interface Props {
    candidate: Candidate;
}

function extractGithubUsername(url: string): string {
    try {
        const parts = new URL(url).pathname.split("/").filter(Boolean);
        return parts[0] || "unknown";
    } catch {
        return "unknown";
    }
}

export default function CandidateHeader({ candidate }: Props) {
    const username = candidate.github
        ? candidate.github.replace("https://github.com/", "")
        : extractGithubUsername(candidate.profileUrl);

    const role = candidate.role || "Software Engineer";

    const riskColor =
        candidate.score > 75
            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            : candidate.score >= 45
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-red-500/15 text-red-400 border-red-500/30";

    const riskLabel = candidate.score > 75 ? "Low Risk" : candidate.score >= 45 ? "Medium Risk" : "High Risk";

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] p-8 md:p-10">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left: Name & details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-purple-400/80">
                            Recruiter Intelligence Report
                        </p>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                        {candidate.name}
                    </h1>

                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-white/50 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            @{username}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/50 text-sm">{role}</span>
                    </div>
                </div>

                {/* Right: Score + Badges */}
                <div className="flex items-center gap-4">
                    {/* Authenticity Score */}
                    <div className="text-center">
                        <span className="text-6xl font-bold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                            {candidate.score}
                        </span>
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider mt-1">
                            Authenticity
                        </p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-col gap-2">
                        <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${riskColor}`}
                        >
                            {riskLabel}
                        </span>
                        <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${candidate.authenticityLevel === "High"
                                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                    : candidate.authenticityLevel === "Medium"
                                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                        : "bg-red-500/15 text-red-400 border-red-500/30"
                                }`}
                        >
                            {candidate.authenticityLevel} Auth
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
