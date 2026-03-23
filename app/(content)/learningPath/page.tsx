"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { fetchSurveyAnswersBySurveyId } from "@/app/lib/data";
import React, { Suspense, useState, useEffect } from "react";
import claraImage from "@/app/assets/clara_agent.png";
import TimelineSVG from "@/app/ui/timeline-svg";

function SuruveyContent() {
  const searchParams = useSearchParams();
  const survey_id = searchParams ? searchParams.get("survey_id") : null; // Add a fallback here
  const [surveyAnswers, setSurveyAnswers] = useState([]);

  useEffect(() => {
    if (!survey_id) {
      console.error("survey_id is missing.");
      return;
    }

    const fetchSurveyAnswers = async () => {
      try {
        const survey_answers = await fetchSurveyAnswersBySurveyId(survey_id);
        setSurveyAnswers(survey_answers);
      } catch (error) {
        console.error("Error fetching survey answers:", error);
      }
    };
    fetchSurveyAnswers();
  }, [survey_id]); //Adding survey_id to the dependency array ensures fetchSurveyAnswers runs if survey_id changes, for example, if this component reloads with a new query parameter.

  console.log("survey_answers in lessons:", surveyAnswers);

  return (
    //<Suspense fallback={<div>Loading...</div>}>: This component wraps around your main content and displays a loading fallback (<div>Loading...</div>) while waiting for useSearchParams to resolve.

    <main className="flex min-h-screen flex-col items-center mt-4 lg:pt-12 pt-4 max-w-8xl">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:mx-20 mx-5 lg:gap-4 mt-12 bg-[#DBE2EF]"> */}
      <div className="lg:py-8 lg:mt-8 flex flex-col items-center">
        <h1 className="lg:text-3xl text-2xl font-bold text-pretty">
          Based on what you shared with us
        </h1>
        <h2 className="lg:text-3xl text-xl italic pt-8 text-pretty">
         Check out your Personalized learning path!
        </h2>
        {/* 
          <div className="text-lg items-center">
            {surveyAnswers
              .filter((answer) => answer.question_text.includes("studying"))
              .map((answer, indx) => (
                <div
                  key={answer.id}
                  className="grid grid-cols-1 md:grid-cols-2 lg:mx-10 mx-5 lg:gap-2 mt-2 bg-[#DBE2E}"
                >
                  <div>{answer.question_text}</div>
                  <div>{answer.answer}</div>
                </div>
              ))}
          </div> */}
      </div>
      {/* <div className="flex lg:mt-8 lg:pt-2 lg:pb-4 justify-center lg:mx-4 lg:px-4 lg:mx-20 lg:px-20 text-wrap text-pretty space-y-8">
          <Image
            className="rounded-md hidden md:block dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src={claraImage}
            alt="road map image"
            width={962}
            height={850}
            priority
          />

        </div> */}
      {/* </div> */}
      <div className="lg:w-full">
        {survey_id && <TimelineSVG survey_id = {survey_id} />}
      </div>
    </main>
  );
}

export default function LearningPath() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuruveyContent />
    </Suspense>
  );
}
