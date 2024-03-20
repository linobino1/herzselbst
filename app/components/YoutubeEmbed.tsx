import { useEffect, useState } from "react";
import { type YouTubePlayerProps } from "react-player/youtube";
import ReactPlayer from "react-player/youtube";
import { Link } from "@remix-run/react";
import type { Page } from "payload/generated-types";
import { useCookieConsent } from "~/providers/Cookies";

export interface Props extends YouTubePlayerProps {
  pagePrivacy: Page;
}

export const YoutubeEmbed: React.FC<Props> = ({ pagePrivacy, ...props }) => {
  const [oneTimeConsent, setOneTimeConsent] = useState(false);
  const { consent } = useCookieConsent();

  // loading and error state
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // prevent hydration error
  // https://github.com/cookpete/react-player/issues/1428#issuecomment-1976948237
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    consent || oneTimeConsent ? (
      <div className="mb-16">
        {isLoading && <p className="-z-1 absolute">Lade Video...</p>}
        <ReactPlayer
          {...props}
          controls={true}
          onReady={() => setIsLoading(false)}
          onError={() => setIsError(true)}
        />
        {isError && (
          <p className="">
            {"Video konnte nicht geladen werden."}
            <br />
            {typeof props.url === "string" ? props.url : ""}
          </p>
        )}
      </div>
    ) : (
      <div className="font-italic flex min-h-32 flex-col items-center justify-center bg-gray-100 p-[10%] text-center text-sm">
        <p>
          Dieses Video wird nicht angezeigt, da Sie der Nutzung von
          Tracking-Cookies nicht zugestimmt haben. Sie können hier einmalig ihre
          Zustimmung geben. Lesen Sie hierzu unsere{" "}
          <Link
            to={pagePrivacy.url}
            prefetch="intent"
            target="_blank"
            className="underline"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => setOneTimeConsent(true)}
        >
          Zustimmen & Video anzeigen
        </button>
      </div>
    )
  ) : null;
};
