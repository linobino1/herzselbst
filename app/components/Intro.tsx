import { useEffect, useState } from "react";
import Image from "./Image";
import type { Media, Site } from "payload/generated-types";
import type { loader as rootLoader } from "~/root";
import { useRouteLoaderData } from "@remix-run/react";

const Intro = () => {
  const { site } = useRouteLoaderData<typeof rootLoader>("root") as {
    site: Site;
  };
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    console.log("sess", sessionStorage.getItem("seen_intro"));
    setShowIntro(sessionStorage.getItem("seen_intro") !== "true");
    sessionStorage.setItem("seen_intro", "true");

    // hide intro after x seconds
    setTimeout(() => {
      setShowIntro(false);
    }, 3000);
  }, []);

  return (
    showIntro && (
      <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-white">
        {site.logo && <Image media={site.logo as Media} />}
        <button
          onClick={() => {
            setShowIntro(false);
          }}
          className="bg-key-500 hover:bg-key-600 focus:ring-key-500 mt-12 rounded-lg px-4 py-2 text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white"
        >
          Zur Haupseite
        </button>
      </div>
    )
  );
};
export default Intro;
