import { useEffect, useState } from "react";
import { type YouTubePlayerProps } from "react-player/youtube";
import ReactPlayer from "react-player/youtube";
import { twMerge } from "tailwind-merge";

export interface Props extends YouTubePlayerProps {}

export const YoutubeEmbed: React.FC<Props> = (props) => {
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
    <div className={twMerge("min-h-20 bg-black text-white")}>
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
  ) : null;
};
