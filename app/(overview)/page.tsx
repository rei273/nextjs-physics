import Image from "next/image";
//import logo from "@/app/ui/logo.png";
import PhysTLogo from "@/app/ui/phys-logo";
import Link from "next/link";
import { lusitana, montserrat } from "../ui/fonts";
//import styles from '@/app/ui/home.module.css';
import {
  ArrowRightIcon,
  CheckIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import futuristicPlanet from "@/app/ui/front_page_cover_futuristic_planet.jpg";
import benefitsImage from "@/app/assets/illustration/illustration_pencil.png";
import adaptiveImage from "@/app/ui/illustratiion_balance.jpg";
import featuresImage from "@/app/ui/illustration_features_selection.jpg";
import heroImageDesktop from "@/app/assets/illustration/hero_illustration_road_map_desktop.png";
import heroImageMobile from "@/app/assets/illustration/hero_illustration_road_map_mobile.png";
import compassImage from "@/app/assets/illustration/illustration_compass.png";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-8 lg:pt-38 pb-24 max-w-8xl">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:mx-20 mx-5 lg:gap-4 mt-12 bg-[#DBE2EF]">
        {/* <div className="w-44 w-44">
        <PhysTLogo />
        </div> */}
        <div className="flex flex-col justify-center lg:p-20 pt-2 lg:p-8">
          <h1 className="text-2xl font-bold text-pretty">
            Ready to Elevate Your Learning? Start with a Quiz to Personalize
            Your Journey!
          </h1>
          <h2 className="text-2xl italic py-8">
            Answer a few questions, and we’ll tailor your learning path with
            interactive lessons, quizzes, and personalized recommendations.
          </h2>
          <div className="lg:py-16 text-center items-center">
            <Link
              href="/welcome"
              className="inline-flex items-center justify-center rounded-lg bg-[#FF6500] px-8 py-4 text-xl font-medium text-white transition-colors hover:bg-[#FFAD60]"
            >
              <span>Take the Quiz</span>
              <span className="ml-2">
                <ArrowRightIcon className="w-6" />
              </span>
            </Link>
          </div>
        </div>
        <div className="flex lg:mt-8 lg:pt-2 lg:pb-4 justify-center lg:mx-4 lg:px-4 lg:mx-20 lg:px-20 text-wrap text-pretty space-y-8">
          <Image
            className="rounded-md hidden md:block dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src={heroImageDesktop}
            alt="road map image"
            width={962}
            height={850}
            priority
          />
            <Image
            src={heroImageMobile}
            width={600}
            height={530}
            className="block md:hidden dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
            alt="Road map image showing mobile version"
            priority
          />
        </div>
      </div>

      {/* Section 1: Benefits*/}
      <section className="grid grid-cols-1 md:grid-cols-2 py-8 px-8 mt-8 bg-[#B7E0FF]">
        <div className="flex justify-center">
          <Image
            className="w-96 h-auto"
            src={benefitsImage}
            alt="Benefits Pencil images"
            width={3000}
            height={3000}
          />
        </div>
        <div className="flex flex-col justify-center space-y-4 text-pretty">
          <div className="sm:py-4">
            <h2 className="text-3xl font-semibold">Benefits</h2>
          </div>
          <h3 className="text-2xl">Step 1: Take a short quiz</h3>
          <div className="flex items-center">
            <i className="">
              <CheckIcon className="w-6" />{" "}
            </i>
            <span className="ml-2 text-lg text-gray-700">
              Answer a few questions to understand your strength and areas for
              growth
            </span>
          </div>

          <h3 className="text-2xl">Step 2: Get personalized learning</h3>
          <div className="flex items-center">
            <i className="">
              <BookOpenIcon className="w-6" />{" "}
            </i>
            <span className="ml-2 text-lg text-gray-700">
              We’ll tailor lessons and quizzes based on your knowledge and
              goals.
            </span>
          </div>

          <h1 className="text-2xl">Step 3: Master Each Topic</h1>
          <div className="flex items-center">
            <i className="">
              <AcademicCapIcon className="w-6" />{" "}
            </i>
            <span className="ml-2 text-lg text-gray-700">
              We’ll tailor lessons and quizzes based on your knowledge and
              goals.
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Quiz Overview Section */}
      <section className="w-3/4 flex flex-col lg:p-8 bg-stone-200 mt-8 text-pretty bg-[#CBD2A4]">
        <div className="max-w-7xl mx-auto p-8">
          {/* <h2 className="text-3xl font-semibold">
            Adaptive and Interactive Learning
          </h2> */}
          <p className="text-2xl text-center text-gray-700">
            The Quiz covers fundamentals topic to gauge where you are in
            subjects like physics, calculus, and more. Don&apos;t worry,
            it&apos;s quick and fun!
          </p>

          <div className="flex justify-center pt-8">
            {" "}
            {/* <Image
              className="w-96 h-auto"
              src={physicsLightImage}
              alt="Progress Bar Gif from 0 to 100%"
              width={2145}
              height={1430}
            /> */}
            <Image
              className="w-96 h-auto"
              src={compassImage}
              alt="Progress Bar Gif from 0 to 100%"
              width={520}
              height={520}
            />
            {/* <Image
              src={mathDiceImage}
              alt="Progress Bar Gif from 0 to 100%"
              width={400}
              height={400}
            /> */}
      
          </div>
          <p className="text-2xl text-center text-gray-700">Takes less than 5 minutes to complete.</p>
        </div>
      </section>
    </main>
  );
}
