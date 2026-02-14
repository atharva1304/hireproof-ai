interface Props {
    strengths: string[];
    weaknesses: string[];
}

export default function StrengthWeakness({ strengths, weaknesses }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-2xl shadow-black/20">
                <h3 className="text-lg font-semibold text-emerald-400 mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Strengths
                </h3>
                <ul className="space-y-3">
                    {strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-white/70 text-sm leading-relaxed">{s}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 shadow-2xl shadow-black/20">
                <h3 className="text-lg font-semibold text-amber-400 mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    Weaknesses
                </h3>
                <ul className="space-y-3">
                    {weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <span className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-white/70 text-sm leading-relaxed">{w}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
