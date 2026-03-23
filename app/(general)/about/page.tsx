import Image from "next/image";
//import logo from "@/app/ui/logo.png";
// import PhysTLogo from "@/app/ui/phys-logo";
// import Link from "next/link";
// import { lusitana, montserrat } from "@/app/ui/fonts";
//import styles from '@/app/ui/home.module.css';
//import { ArrowRightIcon } from "@heroicons/react/24/outline";
//import futuristicPlanet from "@/app/assets/illustration/front_page_cover_engineer.jpg";
import conceptImage from "@/app/assets/illustration/front_page_cover_engineer.jpg";
import adaptiveImage from "@/app/assets/illustration/illustratiion_balance.jpg";
import featuresImage from "@/app/assets/illustration/illustration_features_selection.jpg";


export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 mx-auto max-w-8xl">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-8">
        {/* <Image
          className="rounded-full w-80 h-80 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src={logo}
          alt="logo"
          width={400}
          height={400}
          priority
        /> */}
        {/* <div className="w-44 w-44">
        <PhysTLogo />
        </div> */}
        <h1 className="text-4xl font-bold">
          Grok Vectors AI
        </h1>
        <h2 className="text-2xl">Tutorials in Introductory Math and Physics</h2>
        <p className="text-xl max-w-3xl text-wrap text-pretty text-justify">
          <strong>Introductory Math and Physics Tutorials</strong> is a
          comprehensive sequence of questions and answers designed to supplement
          classroom instruction and official textbooks in introductory math and
          physics. Explore topics like{" "}
          <strong>Algebra, Geometry, Pre-Calculus, and Calculus</strong> for math, and{" "}
          <strong>Mechanics, Electromagnetism, Heat, and Waves</strong> for
          physics.
        </p>
      </div>

      {/* Section 1: Core Concepts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-28 bg-[#C4D7FF] max-w-7xl mt-16 p-8">
        <div>
          <Image
            src={conceptImage}
            alt="Core Concepts"
            width={400}
            height={400}
          />
        </div>
        <div className="flex flex-col justify-center space-y-4 text-pretty">
          <h2 className="text-3xl font-semibold">
            Core Concepts and Reasoning Skills
          </h2>
          <p>
            Our tutorials focus on the development of essential concepts and the
            fostering of scientific reasoning skills. Through interactive
            experiments and guided hints, students actively engage with the
            material.
          </p>
          <p>
            Move beyond rote memorization to fully grasp the core principles of
            math and physics in real-world contexts.
          </p>
        </div>
      </section>

      {/* Section 2: Adaptive Tutorials */}
      <section className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-4 py-16 bg-stone-200 text-pretty w-3/4 p-8">
        <div className="flex flex-col justify-center px-8 space-y-4">
          <h2 className="text-3xl font-semibold">
            Adaptive and Interactive Learning
          </h2>
          <p>
            Each tutorial includes demonstrations, worksheets, and assignments
            that students can work on independently. With adaptive hints guiding
            progress, students develop deeper reasoning skills and apply their
            knowledge to solve problems.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src={adaptiveImage}
            alt="Adaptive Learning"
            width={400}
            height={400}
          />
        </div>
      </section>

      {/* Section 3: AI-Assisted Platform Features */}
      <section className="py-16 bg-gray-100 w-full mt-8 text-pretty">
        <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-semibold text-center pb-8">
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ul className="space-y-4 text-lg px-12">
            <li>
              <strong>Accessibility:</strong> Voice-activated tutorials and
              hints through text-to-speech and translation functionalities.
            </li>
            <li>
              <strong>Adaptive Help:</strong> Contextual, progressive hints
              tailored to each student’s learning process.
            </li>
            <li>
              <strong>Personalized Content Recommendations:</strong> Suggested
              study materials and homework problems based on student
              performance.
            </li>
            <li>
              <strong>Error Analysis and Feedback:</strong> Identifies patterns
              in mistakes and offers immediate feedback to improve
              understanding.
            </li>
            <li>
              <strong>Engagement and Motivation:</strong> Tracks student
              progress and offers encouragement through a reward system.
            </li>
          </ul>
          <div className="flex justify-center">
            <Image
              src={featuresImage}
              alt="Platform Features"
              width={400}
              height={400}
            />
          </div>
        </div>
        </div>
      </section>
      {/* CTA Section */}
      {/* <div className="py-16 text-center">
        <Link
          href="/tutorials"
          className="inline-flex items-center justify-center rounded-lg bg-[#27374D] px-8 py-4 text-xl font-medium text-white transition-colors hover:bg-[#526D82]"
        >
          <span>Enter</span>
          <span className="ml-2">
            <ArrowRightIcon className="w-6" />
          </span>
        </Link>
      </div> */}
    </main>
  );
}
