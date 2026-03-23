import Image from "next/image";
// import logo from "@/app/ui/logo.png";
// import futuristicPlanet from "@/app/ui/assets/front_page_cover_futuristic_planet.jpg";
// import conceptImage from "@/app/ui/front_page_cover_engineer.jpg";
// import adaptiveImage from "@/app/ui/illustratiion_balance.jpg";
import claraImage from "@/app/assets/clara/clara_agent.png";
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-16 pb-28 max-w-8xl">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-8">
        {/* <Image
          className="rounded-med w-80 h-80 dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src={logo}
          alt="logo"
          width={400}
          height={400}
          priority
        /> */}

        <section className="mt-8 pt-2 pb-4 mx-4 px-4 lg:mx-48 lg:px-52 text-wrap text-pretty space-y-8">
          <h1 className="text-4xl font-bold pb-8">About Us</h1>

          <p className="text-lg text-justify">
            <strong>At Grok Vectors</strong>, our mission is to transform
            education by making learning engaging, accessible, and dynamic. We
            believe that true understanding comes from asking the right
            questions, exploring beyond textbooks, and connecting knowledge to
            real-world applications. Our platform focuses on fostering
            mathematical and scientific inquiry, empowering students to move
            beyond rote memorization and deeply engage with core principles.
          </p>

          <p className="text-lg text-justify ">
            {" "}
            By integrating cutting-edge AI, we create interactive, personalized
            tutorials that guide students through their learning journey,
            encouraging curiosity and critical thinking. Whether you&apos;re a
            beginner or advancing your skills, GV is designed to adapt to your
            unique needs, providing tailored support that makes complex concepts
            clear and achievable.
          </p>

          <p className="text-lg text-justify ">
            We are a passionate and diverse team of developers, educators,
            designers, strategists, and scientists united by a shared vision: to
            inspire students to take control of their learning, ask meaningful
            questions, and make a lasting impact in their fields. No matter
            where you are, GV is here to ensure you have the tools and support
            to to solve complex problems.{" "}
          </p>

          <p className="text-lg text-justify">
            Our focus is your learning—accessible to anyone, anywhere.
          </p>
        </section>
      </div>

      {/* Section 3: AI-Assisted Platform Features */}
      <section className="mt-4 pt-8 pb-8 mx-2 px-2 lg:mx-48 lg:px-52 bg-[#F5EFFF] text-wrap text-pretty w-full">
        <div className="max-w-7xl mx-auto p-8">
          <h2 className="text-3xl font-semibold text-center pb-11">
            Meet Clara - Your AI teaching assistant
          </h2>
          <p></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-2">
            <ul className="space-y-4 text-md px-2">
              <li>
                <strong>Bright and Famous:</strong> Clara radiates enthusiasm
                and positivity. She&apos; friendly and encouraging, always
                providing constructive feedback.
              </li>
              <li>
                <strong>Smart and intelligent:</strong> Clara could handle
                complex questions, providing in-depth explanations, analogies,
                and real-world applications to make tough concept easier to
                grasp
              </li>
              <li>
                <strong>Loyal:</strong> Clara could track individual
                users&apos;progress over time, offering personalized tips,
                reminders, and motivation. She could also remember the
                user&apos;s preferred style of learning.
              </li>

              <li>
                <strong>Multi-Subject Expertise:</strong> Clara could guide
                students through algebra, geometry, calculus, and statistics
                with detailed breakdowns and eplain classical mechanics,
                electromagnetism, quantum physics, and more, providing
                real-world examples and interactive problems.
              </li>
            </ul>
            <div className="flex justify-center">
              <Image
                className="w-96 h-96"
                src={claraImage}
                alt="Clara AI agent"
                width={1024}
                height={1024}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
