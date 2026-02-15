import type { Skills } from "../types";
import type { GithubData } from "./githubService";

type ResumeAnalysis = {
  atsScore: number;
  confidence: number;
  proficiency: "Beginner" | "Intermediate" | "Advanced";
  githubResumeComparison: {
    overlapSkills: string[];
    resumeOnlySkills: string[];
    githubOnlySkills: string[];
    matchScore: number;
  };
  summary: string[];
};

const SKILL_KEYWORDS: Record<keyof Skills, string[]> = {
  frontend: ["react", "next", "javascript", "typescript", "css", "html", "vite", "redux"],
  backend: ["node", "express", "api", "rest", "graphql", "java", "spring", "django", "flask"],
  dsa: ["algorithm", "data structure", "leetcode", "binary tree", "graph", "dp", "complexity"],
  system: ["architecture", "scalable", "microservice", "distributed", "kafka", "load balancer"],
  testing: ["jest", "unit test", "integration test", "e2e", "cypress", "qa", "pytest"],
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function detectResumeSkills(text: string): string[] {
  const normalized = normalize(text);
  const detected = new Set<string>();

  Object.values(SKILL_KEYWORDS).forEach((keywords) => {
    keywords.forEach((keyword) => {
      if (normalized.includes(keyword)) {
        detected.add(keyword);
      }
    });
  });

  return Array.from(detected);
}

type GithubSignals = Pick<GithubData, "languages" | "contributionConsistency">;

function detectGithubSkills(github: GithubSignals, skills: Skills): string[] {
  const detected = new Set<string>();
  github.languages.forEach((lang) => detected.add(lang.toLowerCase()));

  (Object.entries(skills) as [keyof Skills, number][])
    .filter(([, score]) => score >= 5)
    .forEach(([name]) => {
      SKILL_KEYWORDS[name].slice(0, 2).forEach((k) => detected.add(k));
    });

  return Array.from(detected);
}

export function analyzeResumeVsGithub(input: {
  resumeText?: string;
  githubData?: GithubSignals;
  skills: Skills;
}): ResumeAnalysis | undefined {
  const resumeText = input.resumeText?.trim();
  if (!resumeText) return undefined;

  const githubData = input.githubData ?? {
    languages: [],
    contributionConsistency: 0,
  };

  const resumeSkills = detectResumeSkills(resumeText);
  const githubSkills = detectGithubSkills(githubData, input.skills);

  const resumeSet = new Set(resumeSkills);
  const githubSet = new Set(githubSkills);

  const overlapSkills = Array.from(resumeSet).filter((s) => githubSet.has(s));
  const resumeOnlySkills = Array.from(resumeSet).filter((s) => !githubSet.has(s));
  const githubOnlySkills = Array.from(githubSet).filter((s) => !resumeSet.has(s));

  const unionSize = new Set([...resumeSkills, ...githubSkills]).size;
  const matchScore = unionSize > 0 ? Math.round((overlapSkills.length / unionSize) * 100) : 0;

  const keywordCoverage = clamp(Math.round((resumeSkills.length / 14) * 100), 0, 100);
  const structureBonus = /\b(project|experience|skills|education)\b/i.test(resumeText) ? 10 : 0;
  const lengthBonus = resumeText.length >= 400 ? 10 : 0;
  const atsScore = clamp(Math.round(keywordCoverage * 0.7 + matchScore * 0.2 + structureBonus + lengthBonus), 0, 100);

  const confidence = clamp(
    Math.round(matchScore * 0.45 + githubData.contributionConsistency * 0.35 + Math.min(20, resumeSkills.length * 2)),
    0,
    100
  );

  const proficiency: ResumeAnalysis["proficiency"] =
    confidence >= 75 ? "Advanced" : confidence >= 45 ? "Intermediate" : "Beginner";

  const summary = [
    `ATS score is ${atsScore} based on resume keyword coverage and structure.`,
    `Confidence is ${confidence} with GitHub/Resume match at ${matchScore}%.`,
    overlapSkills.length > 0
      ? `Strong overlap: ${overlapSkills.slice(0, 5).join(", ")}.`
      : "No strong overlap found between resume and GitHub signals.",
  ];

  return {
    atsScore,
    confidence,
    proficiency,
    githubResumeComparison: {
      overlapSkills,
      resumeOnlySkills,
      githubOnlySkills,
      matchScore,
    },
    summary,
  };
}
