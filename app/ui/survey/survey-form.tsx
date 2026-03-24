"use client";
import React, { useState, useEffect, useActionState } from "react";
import ProgressBar from "@/app/ui/progressBar";
import Button from "@/app/ui/button";
import LoadingSpinner from "@/app/ui/loading-spinner";
//import { useFormState } from "react-dom";

import {
  fetchSurveyQuestions,
  fetchSurveyQuestionOptions,
} from "@/app/lib/data";
import { createSurvey } from "@/app/lib/actions";
import { SurveyQuestion } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

export default function SurveyForm() {
  // const [formState, formAction, isPending] = useFormState(
  //   createSurvey,
  //   undefined
  // );

  const [formState, formAction, isPending] = useActionState(createSurvey, undefined);

  const [currentQuestion, setCurrentQuestion] = useState(0); //keep track of current question for progress bar
  //   const [loading, setLoading] = useState(true); // State to manage loading status
  const [questions, setQuestions] = useState<SurveyQuestion[] | null>(null); //state to hold the survey questions. Treat null as loading state
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({}); // Store accumulated form data
  const [selectedAnswer, setSelectedAnswer] = useState(""); // Track the selected answer
  const [selectedQuestion, setSelecteQuestion] = useState(""); // Track the selected answer
  const router = useRouter();

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      try {
        const questionsData = await fetchSurveyQuestions();
        const questionsWithOptions = await Promise.all(
          questionsData.map(async (question: SurveyQuestion) => {
            const options = await fetchSurveyQuestionOptions(question.id);
            return { ...question, options };
          })
        );
        setQuestions(questionsWithOptions); // Updates questions, removing the need for loading state
      } catch (error) {
        console.error("Error fetching survey questions or options:", error);
      }
    };

    fetchQuestionsAndOptions(); // Call async function inside useEffect
  }, []); // Empty dependency array to run only once on mount

  /*
questions in state will look like:
[
  {
    id: 'question_id_1',
    question_text: 'Some question text',
    options: [ Options array for this question ]
},
// More questions
]

*/

  // Debugging log to check `questions` and `currentQuestion`
  //console.log("Current Question Index:", currentQuestion);
  //console.log("Questions:", questions);
  //console.log("formData: ", formData);

  if (questions === null) {
    return <div>Loading survey questions</div>;
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div>
          <LoadingSpinner />{" "}
        </div>
        <div> Analyzing your responses...</div>
      </div>
    );
  }

  // Increment current question
  const handleNext = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!selectedAnswer) {
      // If no answer is selected, do nothing or show an error
      alert("Please select an answer before proceeding.");
      return;
    }

    // setFormData((prevData) => ({
    //   ...prevData,
    //   [selectedQuestion]: selectedAnswer,
    // }));

    // Temporarily store updated form data for immediate use in the last question check
    const updatedFormData = {
      ...formData,
      [selectedQuestion]: selectedAnswer,
    };

    setFormData(updatedFormData)

    setSelectedAnswer(""); //clear the selected Answer for the next question
    setSelecteQuestion("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      //const nameInput = event.target.nodeName.split("_")[0];
    } else {
      console.log("What is updatedFormData after last question: ", updatedFormData);
      //formAction(formData);
      formAction(updatedFormData); //use updatedFormData because formData is not updated. formData is only updated after the form is already sent for processing!
      setIsProcessing(true);
      // setTimeout(
      //   () => {
      //     router.push("/lessons");
      //   },
      //   1000 //1000ms delay for processing
      // );
    }
  };

  // Update the selected answer state when a radio button is clicked
  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const target = event.target as HTMLTextAreaElement | HTMLInputElement;

    //console.log(target.name);
    const questionId = target.name.split("_")[1];
    //console.log(event.target.value);
    setSelecteQuestion(questionId);
    setSelectedAnswer(target.value);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  console.log("Progress: ", progress);

  return (
    // Centers the form container itself within the available space.
    <div className="w-full flex p-8 justify-center">
      {/*max-w-lg This limits the width of the form, keeping it from stretching unnecessarily wide on larger screens. */}
      <form className="max-w-lg" action="">
        <div className="flex flex-col items-center">
          {questions.length === 0 ? (
            <p>No Questions Available</p>
          ) : (
            // Centers the question text within the form container.
            <div className="w-full text-center">
              <ul>
                {/* Show current question */}
                <p className="text-lg italic pb-8">
                  {questions[currentQuestion].question_text}
                </p>

                <div className="">
                  {questions[currentQuestion].question_text.includes(
                    "challenging"
                  ) ? (
                    <textarea
                      className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 whitespace-pre-wrap text-justify leading-9 "
                      name={`answer_${questions[currentQuestion].id}`}
                      id={`answer_${questions[currentQuestion].id}`}
                      rows={3}
                      placeholder="Write your thoughts here..."
                      onChange={handleAnswerChange}
                      //   onKeyDown={handleKeyDown}
                      //   required
                    />
                  ) : (
                    <ul className="space-y-2">
                      {questions[currentQuestion].options.map((option) => (
                        <li
                          key={option.id}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="radio"
                            id={`option_${option.id}`}
                            name={`answer_${questions[currentQuestion].id}`}
                            value={option.option_text}
                            className="h-4 w-4 bg-gray-100 border-gray-300 focus:ring-blue-600 focus:ring-1 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={handleAnswerChange}
                          />
                          <label
                            htmlFor={`option_${option.id}`}
                            className="text-md text-gray-700 dark:text-gray-300"
                          >
                            {option.option_text}
                          </label>
                        </li>
                      ))}

                      {/* <div className="w-full">
                        <select
                          name={`answerOption_${questions[currentQuestion].id}`}
                          id={`answerOption_${questions[currentQuestion].id}`}
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                          defaultValue=""
                          aria-describedby={`answer_${questions[currentQuestion].id}`}
                        >
                          <option value="" disabled>
                            Select an choice
                          </option>
                          {questions[currentQuestion].options.map((option) => (
                            <option key={option.id} value={option.option_text}>
                              {option.option_text}
                            </option>
                          ))}
                        </select>
                      </div> */}
                    </ul>
                  )}
                </div>
              </ul>
            </div>
          )}
          {/* Next button */}
        </div>
        <div className="flex justify-end pt-8">
          <Button
            type="button"
            onClick={handleNext}
            // disabled={currentQuestion === questions.length - 1}
          >
            {currentQuestion === questions.length - 1 ? 'Submit': 'Next'}
          </Button>
        </div>
        <div className="mt-8">
          {/* Show progress */}
          <ProgressBar progress={progress} />
        </div>
      </form>
    </div>
  );
}
