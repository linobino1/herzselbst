import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "./Image";
import type { Media, Page } from "payload/generated-types";
import { Link } from "@remix-run/react";
import { useCookieConsent } from "~/providers/Cookies";

export type Props = {
  embedUrl: string;
  placeholderImage: Media;
  pagePrivacy: Page;
};

export const GoogleMapsEmbed: React.FC<Props> = ({
  embedUrl,
  placeholderImage,
  pagePrivacy,
}) => {
  const [oneTimeConsent, setOneTimeConsent] = useState(false);
  const { consent } = useCookieConsent();
  return (
    <div className="mb-16 mt-4">
      {" "}
      {consent || oneTimeConsent ? (
        <iframe
          src={embedUrl}
          // width="600"
          title="Google Maps"
          // height="450"
          loading="lazy"
          allowFullScreen={false}
          referrerPolicy="no-referrer-when-downgrade"
          className="min-h-96 w-full"
        />
      ) : (
        <div className="aspect-3/2 relative flex flex-col items-center justify-center justify-center p-4">
          <Image
            media={placeholderImage}
            className="absolute -z-20 h-full w-full object-cover opacity-50"
          />
          <p className="text-center text-sm">
            Diese Karte wird nicht angezeigt, da Sie der Nutzung von
            Tracking-Cookies nicht zugestimmt haben. Sie können hier einmalig
            ihre Zustimmung geben. Lesen Sie hierzu unsere{" "}
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
            Zustimmen & Karte anzeigen
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsEmbed;
