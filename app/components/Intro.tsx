import { useEffect, useState } from "react";
import Image from "./Image";
import type { Media, Site } from "payload/generated-types";
import type { loader as rootLoader } from "~/root";
import { useRouteLoaderData } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

const Intro = () => {
  const { site } = useRouteLoaderData<typeof rootLoader>("root") as {
    site: Site;
  };
  const [hide, setHide] = useState(true);

  useEffect(() => {
    setHide(sessionStorage.getItem("hide_intro") === "true");
    sessionStorage.setItem("hide_intro", "true");

    // hide intro after x seconds
    setTimeout(() => {
      setHide(true);
    }, 5000);
  }, []);

  useEffect(() => {
    if (hide) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [hide]);

  return (
    <div
      className={twMerge(
        "z-25 fixed left-0 top-0 flex h-full w-full flex-col items-center justify-center bg-white",
        hide &&
          "pointer-events-none opacity-0 transition-opacity duration-200 ease-in-out",
      )}
      onClick={() => setHide(true)}
    >
      {site.logo && (
        <Image media={site.logo as Media} className="max-w-80vw w-[544px]" />
      )}
      <button className="bg-key-500 hover:bg-key-600 focus:ring-key-500 mt-12 rounded-lg px-4 py-2 text-white transition-colors duration-200 ease-in-out">
        Zur Haupseite
      </button>
    </div>
  );
};
export default Intro;
