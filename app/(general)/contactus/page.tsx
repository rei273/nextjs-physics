import ContactForm from "@/app/ui/contact-form";
//import PhysTLogo from "@/app/ui/phys-logo";
import Image from "next/image";
import lightImage from "@/app/assets/illustration/illustration_physics_light.png";
import Breadcrumbs from "@/app/ui/tutorials/breadcrumbs";
import { Suspense } from "react";
export default function Page() {
  return (
    <main className="flex min-h-screen justify-center mx-auto px-2 md:pt-28">
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us", href: "/contactus", active: true },
        ]}
      /> */}
      <div className="items-center justify-center max-w-7xl">
        <div className="relative mx-auto flex flex-col space-y-2.5 p-2">
          <div className="flex items-center justify-center">
          <Image
            className="rounded-md w-96 h-auto"
            src={lightImage}
            alt="Light Bulb Image"
            width={961}
            height={871}
          />
        </div>
          <div>
            <Suspense fallback={<div>Loading....</div>}>
              {" "}
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
