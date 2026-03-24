import { Suspense } from "react";
import SurveyForm from "@/app/ui/survey/survey-form";


export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-8 lg:pt-38 pb-24 max-w-8xl">
      <div className="lg:p-16 lg:mt-44 mt-28 flex-col bg-[#DBE2EF] flex items-center max-w-5xl">
        <h1 className="text-3xl font-bold pb-8"> Welcome!</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <SurveyForm />
        </Suspense>
      </div>
    </main>
  );
}
