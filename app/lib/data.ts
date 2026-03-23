import { sql } from "@vercel/postgres";
import { Tutorial, Question, Equipment, Option } from "./definitions";
import { TutorialsTable, TutorialImage, MyFormData, AIContent } from "./definitions";
import { list } from "@vercel/blob";
//import { open, close, readFile, appendFile } from "fs";
//import { promisify } from "util";

export async function fetchDiscussions() {
  try {
    const data = await sql`SELECT * FROM discussions ORDER BY date DESC;`;
    const discussions = data.rows;
    return discussions;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch asked questions");
  }
}

export async function fetchDisussionReplies() {
  try {
    const data = await sql`SELECT * FROM replies ORDER BY date DESC;`;
    const all_replies = data.rows;
    return all_replies;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch all replies!");
  }
}

export async function fetchLessons() {
  try {
    const data = await sql`SELECT * FROM lessons ORDER BY created_at ASC;`;

    const lessons = data.rows;

    return lessons;
  } catch (error) {
    console.error("Database error: ", error);
    throw new Error("Failed to fetch all lessons!");
  }
}

export async function fetchAllImagesFromBlob() {
  try {
    const blobs = await list();

    return blobs;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch blobs!");
  }
}

//how to go through blob:
// const images = await fetchAllImagesFromBlob();

// <div>
//   {images.blobs
//       .filter((image) =>
//          image.pathname.startsWith(`homepage_${tutorial.slug}`))
//        .map((image) => (
//           <Image
//             className="rounded-lg w-96 h-96"
//             priority
//             key={image.pathname}
//             // src={tutorial.image_url}
//             src={image.url}
//             alt={tutorial.title}
//             width={1064}
//             height={1064}
//           />
//         ))}
// </div>

export async function fetchHomePageImages() {
  try {
    const data =
      await sql`SELECT tutorials_images.image_url, tutorials_images.image_name FROM tutorials_images WHERE image_name LIKE 'homepage%';`;
    const images = data.rows;
    return images;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch images for the homepage!");
  }
}

export async function fetchImagesByLessonSlug(slug: string) {
  try {
    const data = await sql<TutorialImage>`SELECT tutorials_images.image_url, 
                                      tutorials_images.image_name 
                                    FROM tutorials_images
                                    JOIN lessons ON tutorials_images.tutorial_id = lessons.tutorial_id 
                                    WHERE lessons.slug = ${slug};`;
    const images = data.rows;
    return images;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch images for the lesson.");
  }
}

export async function fetchLessonBySlug(slug: string) {
  try {
    const data = await sql`SELECT 
           lessons.slug, lessons.title, lessons.image_url, lessons.content, lessons.qslug FROM lessons WHERE lessons.slug= ${slug};`;

    const lesson = data.rows.map((lesson) => ({
      ...lesson,
    }));

    return lesson[0];
  } catch (error) {
    console.log("Database error: ", error);
    throw new Error("Failed to fetch lesson.");
  }
}

export async function fetchQuestionsBySlug(slug: string) {
  try {
    const data =
      await sql<Question>`SELECT questions.question_id, questions.question_slug, questions.type, questions.question FROM questions WHERE questions.question_slug= ${slug};`;

    const questions = data.rows.map((question) => ({
      ...question,
    }));

    return questions;
  } catch (error) {
    console.log("Database error: ", error);
    throw new Error("Failed to fetch questions.");
  }
}

export async function fetchEquipmentBySlug(slug: string) {
  try {
    const data =
      await sql<Equipment>`SELECT demoequipment.equipment FROM demoequipment WHERE demoequipment.question_slug=${slug};`;

    const equipmentAll = data.rows.map((eqipment) => ({
      ...eqipment,
    }));
    return equipmentAll;
  } catch (error) {
    console.log("Database error: ", error);
    throw new Error("Failed to fetch equipment info.");
  }
}

export async function fetchOptionsAnswersBySlug(slug: string) {
  try {
    const data =
      await sql<Option>`SELECT optionAnswers.id, optionAnswers.option_text, optionAnswers.is_correct FROM optionanswers WHERE optionAnswers.question_slug = ${slug};`;

    const options = data.rows.map((option) => ({
      ...option,
    }));
    return options;
  } catch (error) {
    console.log("Database error: ", error);
    throw new Error("Failed to fetch options answer.");
  }
}

export async function fetchCorrectAnswerbyQuestionId(questionId: string) {
  try {
    const correctAnswers =
      await sql`SELECT question_id, correct_answer FROM questions WHERE question_id = ANY(${questionId});
        `;
    return correctAnswers.rows;
  } catch (error) {
    console.error("Error fetching correct answers:", error);
    return {
      message: "Error fetching correct answers.",
    };
  }
}

export async function fetchTranslation(
  text: string,
  srcLang: string,
  tgtLang: string
) {
  const response = await fetch("http://127.0.0.1:8000/translate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      src_lang: srcLang,
      tgt_lang: tgtLang,
    }),
  });

  const data = await response.json();
  return data.translated_text;
}

export async function fetchSurveyQuestions() {
  const fetchURL =
    process.env.NODE_ENV === "production"
      ? "https://nextjs-physics-survey-service-ed3eab6bd412.herokuapp.com/survey_questions"
      : "http://localhost:3001/survey_questions";
  const response = await fetch(fetchURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch survey questions");
  }
  const result = await response.json();
  console.log("result from fetchSurveyQuestions", result);
  return result;
}

export async function fetchSurveyQuestionOptions(question_id: string) {
  const fetchURL =
    process.env.NODE_ENV === "production"
      ? "https://nextjs-physics-survey-service-ed3eab6bd412.herokuapp.com/survey_questions_options"
      : "http://localhost:3001/survey_questions_options";
  const response = await fetch(`${fetchURL}/${question_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch options for survey questions.");
  }

  const result = await response.json();
  console.log("Result fetching survey questions options: ", result);
  return result;
}

export async function createSurveyEntry(formData: MyFormData) {
  try {
    const fetchURL =
      process.env.NODE_ENV === "production"
        ? "https://nextjs-physics-survey-service-ed3eab6bd412.herokuapp.com/surveys"
        : "http://localhost:3001/surveys";
    console.log("fetchURL: ", fetchURL);

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ formData }),
    });

    console.log(response.status);

    if (!response.ok) {
      throw new Error("status not 200. Failed to create survey.");
    }
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error creating a survey: ", error);
  }
}
export async function submitSurveyAnswers(
  survey_id: string,
  formData: MyFormData
) {
  try {
    const fetchURL =
      process.env.NODE_ENV === "production"
        ? "https://survey-response-service-ecbe20fab83d.herokuapp.com/survey_answers"
        : "http://localhost:3002/survey_answers";
    console.log("fetchURL: ", fetchURL);

    const response = await fetch(fetchURL, {
      //const response = await fetch("http://localhost:3002/survey_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        survey_id,
        formData,
      }),
    });
    console.log("resposne status submitSurveyAnswers: ", response.status);
    if (!response.ok) {
      throw new Error("Failed to submit survey answers");
    }

    const result = await response.json(); //return null.
    console.log("Submitted survey answers: ", result);
    return result;
  } catch (error) {
    console.error("Error submit suvery answers: ", error);
  }
}

export async function fetchSurveyAnswersBySurveyId(survey_id: string) {
  const fetchURL =
    process.env.NODE_ENV === "production"
      ? "https://survey-response-service-ecbe20fab83d.herokuapp.com/survey_answers"
      : "http://localhost:3002/survey_answers";
  console.log("fetchURL: ", fetchURL);

  const response = await fetch(`${fetchURL}/${survey_id}`, {
    method: "GET",
    headers: { "Content-type": "application/json" },
  });

  console.log(response.status);
  if (!response.ok) {
    throw new Error("failed to get survey answers for a survey id");
  }

  const result = await response.json();
  console.log(result);
  return result;
}

export async function generateDBEntriesForLessons(parsedAIContent: AIContent){

  const stages = parsedAIContent.stages;
  const fetchUrl =
  process.env.NODE_ENV === "production"
    ? `http://localhost:3003/generate_lesson_content/`
    : `http://localhost:3003/generate_lesson_content/`;

  stages.forEach(async (stage, index) => {
    
    const topics = stage.topics;
    if (topics) {
      topics.map((topic, Idx) => {
        const prompt = `Generate a detailed lesson on the topic ${topic}`
        const lessContent = fetch(fetchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        })
      })
    }
  })

}

/*
export async function fetchLearningPath(survey_id: str) {
  // Promisify fs methods for easier use
  const readFileAsync = promisify(readFile);
  const appendFileAsync = promisify(appendFile);
  const openAsync = promisify(open);
  const closeAsync = promisify(close);

  const CACHE_FILE = "AI_api_cache.json"; //Cache file to store responses

  try {
    let cache = {};
    try {
      const cacheContent = await readFileAsync(CACHE_FILE, "utf8");
      cache = JSON.parse(cacheContent || {});
    } catch (error) {
      console.log("Cache file not found or empty, initializing a new one.");
    }

    if (cache[survey_id]) {
      console.log(`Cache hit for survey id: ${survey_id}`);
      return cache[survey_id];
    }

    const fetchUrl =
      process.env.NODE_ENV === "production"
        ? `http://localhost:3003/generate_personalized_learning_path/${survey_id}`
        : `http://localhost:3003/generate_personalized_learning_path/${survey_id}`;

    console.log("fetchUrl: ", fetchUrl);

    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });

    console.log(response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch learning path from AI service");
    }

    const result = await response.json();
    cache[survey_id] = result;

    await appendFileAsync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8"); //Pretty-print JSON for readability

    console.log(`Cache updated for survey_id ${survey_id}`);
    return result;
  } catch (err) {
    console.error("Error fetching or caching learing path: ", err);
    throw err;
  }
}

*/