import { useEffect, useState } from "react";
import Image from "./Image";
import type { Media, Site } from "payload/generated-types";
import type { loader as rootLoader } from "~/root";
import { useRouteLoaderData } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

export interface IntroProps {
  initiallyHidden?: boolean;
}

const Intro: React.FC<IntroProps> = ({ initiallyHidden }) => {
  const { site } = useRouteLoaderData<typeof rootLoader>("root") as {
    site: Site;
  };
  const [hidden, setHidden] = useState(!!initiallyHidden);

  useEffect(() => {
    // hide intro after x seconds
    setTimeout(() => {
      setHidden(true);
    }, 5000);
  }, []);

  useEffect(() => {
    document.body.style.overflow = hidden ? "auto" : "hidden";
  }, [hidden]);

  return (
    <div
      className={twMerge(
        "fixed left-0 top-0 z-30 flex h-full w-full flex-col items-center justify-center bg-white",
        hidden &&
          "pointer-events-none opacity-0 transition-opacity duration-200 ease-in-out",
      )}
      onClick={() => setHidden(true)}
    >
      {site.logo && (
        <Image
          media={site.logo as Media}
          className="max-w-80vw w-[544px]"
          sizes="544px"
          srcSet={[
            {
              options: { width: 544 },
              size: "544w",
            },
            {
              options: { width: 1088 },
              size: "1088w",
            },
          ]}
        />
      )}
      <button className="mt-12 rounded-lg bg-key-500 px-4 py-2 text-white transition-colors duration-200 ease-in-out hover:bg-key-600 focus:ring-key-500">
        Zur Haupseite
      </button>
    </div>
  );
};
export default Intro;
