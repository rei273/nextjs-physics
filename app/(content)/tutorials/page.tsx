//import { lusitana } from "@/app/ui/fonts";
import Breadcrumbs from "@/app/ui/tutorials/breadcrumbs";
import TutorialsList from "@/app/ui/tutorials/tutorials-list/tutorials-list";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorials",
};

export const dynamic = "force-dynamic";

export default async function Page() {

    
  return (
    <main className="mx-auto h-min-screen lg:mt-8 lg:pt-38 lg:pb-24 max-w-8xl justify-between items-center">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Lessons", href: "/tutorials", active: true },
        ]}
      />

      {/* <h1 className={`${lusitana.className} mb-4 text-2xl md:text 2xl`}> */}
      <h1 className="font-bold lg:mb-4 text-2xl md:text 2xl">
        {/* {" "} */}
        Lessons{" "}
      </h1>

      <div>
          <TutorialsList />

      </div>
    </main>
  );
}
