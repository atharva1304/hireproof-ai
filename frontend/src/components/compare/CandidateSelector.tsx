import type { Candidate } from "../../types/candidate";

interface Props {
    label: string;
    candidates: Candidate[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    disabledId?: string | null;
}

export default function CandidateSelector({
    label,
    candidates,
    selectedId,
    onSelect,
    disabledId,
}: Props) {
    return (
        <div className="flex-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    value={selectedId ?? ""}
                    onChange={(e) => onSelect(e.target.value)}
                    className="w-full appearance-none bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all cursor-pointer hover:bg-white/[0.06]"
                >
                    <option value="" disabled className="bg-[#0a0a0f] text-white/50">
                        Select a candidate...
                    </option>
                    {candidates.map((c) => (
                        <option
                            key={c.id}
                            value={c.id}
                            disabled={c.id === disabledId}
                            className="bg-[#0a0a0f] text-white"
                        >
                            {c.name} — Score: {c.score}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
