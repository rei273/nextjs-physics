import React, { useEffect, useState } from "react";
import { Milestone, AIContent } from "@/app/lib/definitions";
import Link from "next/link";

type ParsedAIContent = AIContent & {
  goal?: string | null;
};

function parseContent(content: string): ParsedAIContent {
  const patterns = {
    title: /^###\s*(.*)$/m,
    goal: /\*\*Goal\*\*:\s*(.*)/,
    duration: /\*\*Duration\*\*:\s*(.*)/,
    dailyCommitment: /\*\*Daily Commitment\*\*:\s*(.*)/,
    stages: /###\s*\**(Stage\s*\d+):\s* (.*?)\s*\*{0,2}\n(.*?)---/gs,

    goals: /\*\*Goals\*\*:\s*(.*)/,
    focus: /\*\*Focus\*\*:\s*(.*)/,
    topics: /\*\*Topics\*\*:\s*\n([\s\S]*?)\n\n/,
    activities: /\*\*Activities\*\*:\s*\n([\s\S]*?)\n\n/,
  };

  const result: ParsedAIContent = {
    title: "Personalized Learning Path",
    stages: [],
  };
  result.title =
    content.match(patterns.title)?.[1] || "Personalized Learning Path";
  result.goal = content.match(patterns.goal)?.[1] || null;
  result.duration = content.match(patterns.duration)?.[1] || undefined;
  result.daily_commitment =
    content.match(patterns.dailyCommitment)?.[1] || undefined;

  const stages = [...content.matchAll(patterns.stages)];

  result.stages = stages.map((stage, stageIdx) => {
    return {
      title: stage?.[2] || "Untitled",
      goals: stage.toString().match(patterns.goals)?.[1] || undefined,
      focus: stage.toString().match(patterns.focus)?.[1] || undefined,
      topics:
        stage
          .toString()
          .match(patterns.topics)?.[1]
          .split("\n")
          .map((topic, topicIdx) => ({
            title: topic.replace(/^- /, "").trim(),
            status: topicIdx === 0 && stageIdx === 0 ? "Ready" : "Locked",
          })) || [],
      activities:
        stage
          .toString()
          .match(patterns.activities)?.[1]
          .split("\n")
          .map((activity) => activity.replace(/^-/, "").trim()) || [],
    };
  });

  return result;
}

function extractMilestones(parsedContent: AIContent) {
  const milestones: Milestone[] = [];

  const stages = parsedContent.stages;

  stages.forEach((stage, index) => {
    milestones.push({
      title: stage.title,
      description: stage.focus ?? stage.goals ?? "",
      topics: stage.topics ?? [],
      activities: stage.activities ?? [],
      positionX: index * 15 - 5,
      positionY: 1,
    });
  });

  return milestones;
}

const TimelineSVG: React.FC<{ survey_id: string }> = ({
  survey_id,
}: {
  survey_id: string;
}) => {
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await fetch(
          `/api/learningPath?survey_id=${survey_id}`
        );
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`Failed to fetch learning path in Timeline with error: ${errorData.message || 'Unknown error'}`);
        }
        const data = await response.json();
        setLearningPath(data);
      } catch (err) {
        console.error("Error fetching learning path:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [survey_id]);

  if (loading) return (<div className="flex justify-center"><p className="text-2xl">Loading...</p></div>);
  if (!learningPath) return <div className="flex justify-center"><p className="text-2xl">No data available</p></div>;

  const content = learningPath;

  const parsedAIContent = parseContent(content);
  const overall_goal = parsedAIContent.goal;

  const milestones = extractMilestones(parsedAIContent);

  // Assume userProgress is fetched from a database or API
  const userProgress = {
    completedTopics: [] as string[], //"Nature of electric fields"
  };

  return (
    <div className="flex flex-col justify-center items-center lg:p-2 dark:invert">
      <div>
        <h3 className="text-2xl font-bold pb-8">{`Learning goal: ${overall_goal}`}</h3>
      </div>
      <div className="overflow-auto md:h-[90vh] h-[70vh] lg:w-[70%] mx-auto border border-gray-300 rounded p-2 ">
        <svg
          viewBox="0 0 110 130"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Define SVG markers for milestones*/}
          <defs>
            <marker
              id="circle"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
            >
              <circle cx="3" cy="3" r="2" fill="#4A90E2" />
            </marker>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
            </marker>
          </defs>

          <polyline
            points="5,5 5,125"
            fill="none"
            stroke="grey"
            strokeWidth="1"
            markerStart="url(#circle)"
            markerMid="url(#circle)"
            markerEnd="url(#arrow)"
          />

          {milestones.map((milestone, idx) => {
            const yOffset = 5 + idx * 30; // Adjust Y spacing between milestones

            return (
              <g key={idx} transform={`translate(5, ${yOffset})`}>
                <circle cx="0" cy="0" r="2" fill="#F28A21" />
                {/* Title */}

                <text
                  x="3"
                  y="1"
                  fill="#2A3663"
                  fontSize="2.5"
                  fontWeight="bold"
                  textAnchor="start"
                >
                  {milestone.title}
                </text>

                {/* Description */}
                <text x="5" y="5" fill="black" fontSize="2">
                  {milestone.description}
                </text>

                {milestone.topics.map((topic, topicIdx) => {
                  {
                    if (userProgress.completedTopics.includes(topic.title)) {
                      topic.status = "Completed";
                    } else if (
                      topic.status !== "Completed" &&
                      topic.status !== "Ready"
                    ) {
                      topic.status = "Locked";
                    }
                  }
                  return (
                    <g
                      key={topicIdx}
                      transform={`translate(0, ${(topicIdx + 0) * 5 + 10})`}
                    >
                      {/* Sub-circle for topics */}
                      <circle
                        cx="0"
                        cy="0"
                        r="1.5"
                        fill={
                          topic.status === "Completed"
                            ? "green"
                            : topic.status === "Ready"
                            ? "blue"
                            : "gray"
                        }
                      />

                      {topic.status === "Ready" ? (
                        <Link
                          href={`/lessons/current/${encodeURIComponent(
                            topic.title
                          )}`}
                          className=""
                        >
                          <text x="5" y="1" fill="#555" fontSize="2">
                            <tspan>{topic.title}</tspan>
                            <tspan
                              x={topic.title.length + 8}
                              dy="0"
                              fontSize="2.5"
                              fill="#F28A21"
                              className="underline underline-offset-4 hover:opacity-70 hover:focus:outline-none focus:opacity-80"
                            >
                              Start lesson
                            </tspan>
                          </text>
                        </Link>
                      ) : topic.status === "Locked" ? (
                        <Link
                          href={`/lessons/preview/${encodeURIComponent(
                            topic.title
                          )}?modal=true`}
                        >
                          {/* href={`/lessons/preview/${topic.slug}?modal=true` as=`lessons/preview/@modal/${topic.slug}`}> */}
                          <text x="5" y="1" fill="#555" fontSize="2">
                            <tspan>{topic.title}</tspan>
                            <tspan
                              x={topic.title.length + 8}
                              dy="0"
                              fontSize="2"
                              fill="#3F72AF"
                              className="underline underline-offset-4 hover:opacity-70 hover:focus:outline-none focus:opacity-80"
                            >
                              Preview lesson
                            </tspan>
                          </text>
                        </Link>
                      ) : (
                        <Link
                          href="/tutorials"
                          className="underline underline-offset-4 hover:opacity-80 hover:focus:outline-none focus:opacity-80"
                        >
                          <text x="5" y="0" fill="#555" fontSize="2">
                            {topic.title}
                          </text>
                        </Link>
                      )}

                      <text x="5" y="3" fill="#888" fontSize="2">
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default TimelineSVG;
