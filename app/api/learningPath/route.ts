import { NextResponse } from "next/server";
import { open, close, readFile, appendFile, access, writeFile } from "fs";
import { promisify } from "util";
import { constants } from "fs";
import { MongoClient } from "mongodb";

const CACHE_FILE = "AI_api_cache.json"; //Cache file to store responses

async function updateCacheFile(cache: any) {
  const closeAsync = promisify(close);
  const writeFileAsync = promisify(writeFile);
  try {
    await writeFileAsync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8"); // Pretty-print JSON for readability
    console.log("Cache updated successfully.");
    //await closeAsync(CACHE_FILE);
  } catch (error) {
    console.error("Failed to update cache file:", error);
    //await closeAsync(CACHE_FILE);
  }
}

function validateCache(cache: any) {
  if (typeof cache !== "object" || cache === null) return false;

  for (const [key, value] of Object.entries(cache)) {
    if (typeof value === "object" && value !== null && !(value as any).generated_learning_path) {
      console.error(`Invalid entry for survey id ${key}.`);
      return false;
    }
  }

  return true;
}

async function fetchLearningPath(survey_id: string) {
  // Promisify fs methods for easier use
  const readFileAsync = promisify(readFile);
  const appendFileAsync = promisify(appendFile);
  const openAsync = promisify(open);
  const closeAsync = promisify(close);
  const writeFileAsync = promisify(writeFile);
  const accessAsync = promisify(access);

  const currDate = new Date();
  const month = currDate.getMonth() + 1;
  const day = currDate.getDate();
  const year = currDate.getFullYear();

  
  let cache: Record<string, any> = {};

  // Ensure the cache file exists
  try {
    await accessAsync(CACHE_FILE, constants.F_OK); // Check if the file exists
  } catch {
    console.log("Cache file does not exist. Creating a new one.");
    await writeFileAsync(CACHE_FILE, "{}", "utf8"); // Create an empty JSON file
  }

  try {
    const cacheContent = await readFileAsync(CACHE_FILE, "utf8");
    cache = JSON.parse(cacheContent || "{}");
    console.log("cache loaded successfully: ");
  } catch (error) {
    console.log("Failed to read or parse cache file, initializing a new one.");
    cache = {};
  }

  let client;
  let collection: any;
  try {
    client = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    console.log("MongoDB Client connected.")
    const db = client.db("nextjs-physics");
    collection = db.collection("learning_paths");
  } catch (error) {
    console.log("Error connecting to MongoDB or initializing collection: ", error);
  } 

  const cachedLearningPath = collection ? await collection.findOne({ survey_id }) : null;
  
  if (cachedLearningPath) {
    console.log("Cache hit from Mongo for survey_id: ", survey_id);
    console.log("cache from Mongo DB: ", cachedLearningPath.learning_path);

    if (!cache[survey_id]) {

      cache[survey_id] = cachedLearningPath.learning_path;
      console.log("cache updated with mongoDB data: ", cache[survey_id])
      if (cache[survey_id]) { //could use validateCache() to validate cache structure before saving
        await updateCacheFile(cache);
      } else {
        console.error("Cache validation failed. Not saving.");
      }

    } ;
 
    return cachedLearningPath.learning_path;
  } else {
    // Return cached data if it exists
    if (cache[survey_id]) {
      console.log(`Cache hit for survey id: ${survey_id}`);
      console.log("cache data for survey_id: ", cache[survey_id]);
      console.log(
        "cache generated_learning_path_response: ",
        cache[survey_id]["generated_learning_path_response"]
      );
      return cache[survey_id]["generated_learning_path_response"]["content"];
      //return res.status(200).json(cache[survey_id]);
    } else {
      console.log(`Cache miss for survey_id: ${survey_id}`);
      //fetch from the AI service
      const fetchUrl =
        process.env.NODE_ENV === "production"
          ? `http://localhost:3003/generate_personalized_learning_path/${survey_id}`
          : `http://localhost:3003/generate_personalized_learning_path/${survey_id}`;

      console.log("fetchUrl: ", fetchUrl);

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });

      //console.log(response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch learning path from AI service");
      }

      const generatedLearningPath = await response.json();
      cache[survey_id] = generatedLearningPath;
      
      if (validateCache(cache)) {
        await updateCacheFile(cache);
      } else {
        console.error("Cache validation failed. Not saving.");
      }

      if (collection) {
        await collection.insertOne({
          survey_id: survey_id,
          learning_path: generatedLearningPath["generated_learning_path"]["content"],
          createdAt: new Date()
        })
      }

      return generatedLearningPath["generated_learning_path"]["content"];
    }
  }
}

export async function GET(request: Request) {
  //console.log(request);
  const { searchParams } = new URL(request.url);
  console.log("searchparam: ", searchParams);
  const survey_id = searchParams.get("survey_id");
  console.log("survey id: ", survey_id);

  if (!survey_id) {
    return NextResponse.json(
      { message: "survey_id is missing" },
      { status: 400 }
    );
  }

  try {
    const learningPath = await fetchLearningPath(survey_id);
    return NextResponse.json(learningPath, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : null;
    return NextResponse.json({message: errorMessage, details: errorStack}, { status: 500 });
  }
}
