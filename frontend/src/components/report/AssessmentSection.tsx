import { useState } from "react";

const MOCK_ASSESSMENT = {
    coding: [
        "Implement a LRU cache with O(1) get and put operations",
        "Build a rate limiter using the sliding window algorithm",
        "Create a REST API endpoint with proper error handling and validation",
    ],
    aptitude: [
        "Design a database schema for a social media feed system",
        "Analyze the time complexity of a recursive Fibonacci implementation",
        "Explain the CAP theorem with real-world examples",
    ],
    project: [
        "Build a real-time chat application using WebSockets",
        "Create a CI/CD pipeline for a microservices architecture",
        "Implement a search autocomplete feature with debouncing",
    ],
};

export default function AssessmentSection() {
    const [showAssessment, setShowAssessment] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setShowAssessment(true);
        }, 2000);
    };

    const sections = [
        { label: "Coding Round", items: MOCK_ASSESSMENT.coding, icon: "💻", color: "text-purple-400", border: "border-purple-500/20" },
        { label: "Aptitude Round", items: MOCK_ASSESSMENT.aptitude, icon: "🧠", color: "text-cyan-400", border: "border-cyan-500/20" },
        { label: "Project Task", items: MOCK_ASSESSMENT.project, icon: "🚀", color: "text-emerald-400", border: "border-emerald-500/20" },
    ];

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                    Assessment Generator
                </h3>

                {!showAssessment && (
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-60"
                    >
                        {generating ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </span>
                        ) : (
                            "Generate Hiring Test"
                        )}
                    </button>
                )}
            </div>

            {showAssessment && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sections.map(({ label, items, icon, color, border }) => (
                        <div key={label} className={`p-4 rounded-xl bg-white/[0.02] border ${border}`}>
                            <p className={`text-sm font-bold ${color} mb-3 flex items-center gap-2`}>
                                <span>{icon}</span>
                                {label}
                            </p>
                            <ul className="space-y-2">
                                {items.map((item, i) => (
                                    <li key={i} className="text-white/60 text-xs leading-relaxed flex items-start gap-2">
                                        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-white/20" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {!showAssessment && !generating && (
                <p className="text-white/30 text-sm text-center py-8">
                    Generate a comprehensive hiring assessment with coding, aptitude, and project-based tasks.
                </p>
            )}
        </div>
    );
}
