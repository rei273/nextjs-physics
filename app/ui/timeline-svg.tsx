import React, { useEffect, useState } from "react";
import { Milestone, AIContent } from "@/app/lib/definitions";
import Link from "next/link";
//import { fetchLearningPath } from "@/app/lib/data"

function parseContent(content: string) {
  const patterns = {
    title: /^###\s*(.*)$/m,
    goal: /\*\*Goal\*\*:\s*(.*)/,
    duration: /\*\*Duration\*\*:\s*(.*)/,
    dailyCommitment: /\*\*Daily Commitment\*\*:\s*(.*)/,
    stages: /###\s*\**(Stage\s*\d+):\s* (.*?)\s*\*{0,2}\n(.*?)---/gs, //stage[2]: title
    //stages: /###\s*(\*{0,2})(Stage\s*\d+:(.*?))\1/g, // Stage\s*\d+: Matches "Stage 1", but it is not in a capturing group, so it’s not included in the result array.   (Stage\s*\d+): Captures the text "Stage 1".  \*{0,2}: Matches 0, 1, or 2 asterisks (*). (\*{0,2}): Captures the matched asterisks to use later in the regex (via \1) for consistency in closing. \1: Ensures the matched asterisks are closed with the same number of * that opened the section.

    goals: /\*\*Goals\*\*:\s*(.*)/,
    focus: /\*\*Focus\*\*:\s*(.*)/,
    topics: /\*\*Topics\*\*:\s*\n([\s\S]*?)\n\n/,
    activities: /\*\*Activities\*\*:\s*\n([\s\S]*?)\n\n/,
  };

  const result: Record<string, any> = {};
  result.title =
    content.match(patterns.title)?.[1] || "Personalized Learning Path";
  result.goal = content.match(patterns.goal)?.[1] || null;
  result.duration = content.match(patterns.duration)?.[1] || null;
  result.dailyCommitment = content.match(patterns.dailyCommitment)?.[1] || null;

  const stages = [...content.matchAll(patterns.stages)];
  console.log(`type of stages: ${typeof stages}`);
  console.log(`stages in parseContent: ${stages}`);

  result.stages = stages.map((stage, stageIdx) => {
    const stageContent = stage;
    console.log("Stage content: ", stageContent);
    //console.log("Goals in stages: ", stage.match(patterns.goals)?.[1])
    //console.log("Focus in stages: ", stage.match(patterns.focus)?.[1] )

    return {
      title: stage?.[2] || "Untitled",
      goals: stage.toString().match(patterns.goals)?.[1] || null,
      focus: stage.toString().match(patterns.focus)?.[1] || null,
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
  console.log("result from parseContent: ", result);
  return result;
}

function extractMilestones(parsedContent: AIContent) {
  const milestones: Milestone[] = [];

  const stages = parsedContent.stages;
  console.log(`stages for milestones: ${stages}`);

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
  /*

  //Split the content into Stage using "---" separator
  const stages = content.split("---");
 
  //process each stage to extract title, goals, and topics
  stages.forEach((stage, index) => {
    const tiltleMatch = stage.match(/### (Stage \d+: .+)/);
    const goalsMatch = stage.match(/\*\*Goals\*\*: (.+)/);
    console.log("goalsMatch: ", goalsMatch);
    const topicsMatch = stage.match(/\*\*Topics\*\*:\n((?:- .+\n)+)/);
    console.log("topicsMatch: ", topicsMatch);

    if (tiltleMatch && goalsMatch && topicsMatch) {
      console.log("titleMatch: ", tiltleMatch);
      //Extract topis as an array
      const topics = topicsMatch[1]
        .split("\n") //split by newline
        .filter((line) => line.startsWith("- ")) //keep only lines that start with "- "
        .map((line, idx) => ({
          title: line.replace("- ", "").trim(), //remove '- ' and trim spaces
          status: idx === 0 && index === 1 ? "Ready" : "Locked", // First topic is "Ready", others are "Locked" by default
        }));

      milestones.push({
        title: tiltleMatch[1],
        description: goalsMatch[1],
        topics: topics,
        positionX: 10 + index * 15 - 15, //dynamically calcualte position on the timeline
        positionY: 1,
      });
    }
  });

  */

  console.log("milestones: ", milestones);
  return milestones;
}

const TimelineSVG: React.FC<{ survey_id: string }> = ({
  survey_id,
}: {
  survey_id: string;
}) => {
  console.log("survey in timeline: ", survey_id);
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        console.log("useEffect triggered with survey_id:", survey_id);
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
  //console.log("learningPath returned in timeline: ", learningPath)

  // const content = learningPath["generated_learning_path"]["content"];
  const content = learningPath;
  //console.log("Type of cotent: ", typeof content);
  //console.log("content returned from cache or API: ", content);

  const parsedAIContent = parseContent(content);
  const overall_goal = parsedAIContent.goal;
  console.log(`overall goal for milestone: ${overall_goal}`);
  //console.log(`Parsed AI Content: ${JSON.stringify(parsedAIContent)}`)
  const milestones = extractMilestones(parsedAIContent);

  // Assume userProgress is fetched from a database or API
  const userProgress = {
    completedTopics: [], //"Nature of electric fields"
  };

  return (
    <div className="flex flex-col justify-center items-center lg:p-2 dark:invert">
      <div>
        <h3 className="text-2xl font-bold pb-8">{`Learning goal: ${overall_goal}`}</h3>
      </div>
      <div className="overflow-auto md:h-[90vh] h-[70vh] lg:w-[70%] mx-auto border border-gray-300 rounded p-2 ">
        <svg
          viewBox="0 0 110 130" //define the coordinate system
          className="w-full h-full" // border-dashed border-2 border-indigo-600
          // preserveAspectRatio="xMidYMid meet" // Adjust scaling behavior
          preserveAspectRatio="none" //scale horizontally
        >
          {/* Define SVG markers for milestones*/}
          <defs>
            <marker
              id="circle"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              //   markerUnits="strokeWidth"
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
              {/* The <path d="M 0 0 L 10 5 L 0 10 z" /> creates a triangular arrow shape.
    M 0 0 moves to the starting point of the triangle.
    L 10 5 draws a line to the point (10, 5).
    L 0 10 draws another line to (0, 10).
    z closes the shape to form a triangle.
    The fill attribute is set to #4A90E2 to match the color of your other markers. */}

              <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
            </marker>
          </defs>

          {/* Zigzag path with markers  */}
          {/* <polyline
              points="10,80 30,60 50,68 70,60 90,65"
              fill="none"
              stroke="grey"
              strokeWidth="2"
              markerStart="url(#circle)"
              markerMid="url(#circle)"
              markerEnd="url(#circle)"
            /> */}

          {/* <path
              d="M 10 10 L 90 10" // Draws a straight line from (10,10) to (90,10)
              stroke="grey"
              strokeWidth="2"
              markerStart="url(#circle)"
              markerMid="url(#circle)"
              markerEnd="url(#circle)"
            /> */}

          <polyline
            points="5,5 5,125"
            fill="none"
            stroke="grey"
            strokeWidth="1"
            markerStart="url(#circle)"
            markerMid="url(#circle)"
            markerEnd="url(#arrow)"
          />

          {/* Circles at Milestones */}
          {/* <circle cx="10" cy="10" r="2" fill="#3B82F6" />
        <circle cx="10" cy="25" r="2" fill="#3B82F6" />
        <circle cx="10" cy="40" r="2" fill="#3B82F6" />
        <circle cx="10" cy="55" r="2" fill="#3B82F6" />
        <circle cx="10" cy="70" r="2" fill="#3B82F6" /> */}

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
                        // Completed lessons
                        <Link
                          href="/tutorials"
                          className="underline underline-offset-4 hover:opacity-80 hover:focus:outline-none focus:opacity-80"
                        >
                          <text x="5" y="0" fill="#555" fontSize="2">
                            {topic.title}
                          </text>
                        </Link>
                      )}

                      {/* Topic Title */}
                      {/* <Link
                      href="/"
                      className="underline underline-offset-4 hover:opacity-80 hover:focus:outline-none focus:opacity-80"
                    >
                      <text x="5" y="0" fill="#555" fontSize="2">
                        {topic.title}
                      </text>
                    </Link> */}
                      {/* Topic Description */}
                      <text x="5" y="3" fill="#888" fontSize="2">
                        {/* {topic.description} */}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
            // <text
            //   key={idx}
            //   x={10 + 3}
            //   y={milestone.positionX}
            //   fill="#3B82F6"
            //   fontSize="3"
            //   fontWeight="bold"
            // >
            //   {milestone.title}
            // </text>;
          })}
          {/* {milestones.map((milestone, idx) =>
              idx % 2 === 1 ? (
                <text
                  key={idx}
                  x={milestone.positionX - 2}
                  y={10 - 5}
                  fill="#3B82F6"
                  fontSize="3"
                >
                  {milestone.title}
                </text>
              ) : (
                <text
                  key={idx}
                  x={milestone.positionX - 5}
                  y={10 + 8}
                  fill="#3B82F6"
                  fontSize="3"
                >
                  {milestone.title}
                </text>
              )
            )} */}
        </svg>
      </div>
    </div>
  );
};

export default TimelineSVG;

// const milestones: Milestone[] = [
//   {
//     year: 1998,
//     title: "Project Launch",
//     description: "Initial launch...",
//     positionX: 10,
//     positionY: 80,
//   },
//   {
//     year: 2004,
//     title: "Growth Phase",
//     description: "Major expansion...",
//     positionX: 25,
//     positionY: 60,
//   },
//   {
//     year: 2009,
//     title: "Milestone 3",
//     description: "Another milestone...",
//     positionX: 40,
//     positionY: 68,
//   },
//   {
//     year: 2015,
//     title: "Milestone 4",
//     description: "Another milestone...",
//     positionX: 55,
//     positionY: 60,
//   },
//   {
//     year: 2020,
//     title: "Current Status",
//     description: "Present status...",
//     positionX: 70,
//     positionY: 65,
//   },
// ];
