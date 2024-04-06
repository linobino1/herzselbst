import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import type { Media } from "payload/generated-types";
import Image from "./components/Image";
import Navigation from "./components/Navigation";
import Intro from "./components/Intro";
import Cookies, { CookieConsentProvider } from "./providers/Cookies";
import { Cross as Hamburger } from "hamburger-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import getOptimizedImageUrl from "./util/getOptimizedImageUrl";
import { intro } from "~/cookies";
import stylesheet from "~/global.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=League+Spartan:wght@400..700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Spartan:wght@400..700&display=swap",
  },
];

export async function loader({
  request,
  context: { payload },
}: LoaderFunctionArgs) {
  const [site, navigations] = await Promise.all([
    payload.findGlobal({
      slug: "site",
    }),
    payload.findGlobal({
      slug: "navigations",
      depth: 1,
    }),
  ]);

  const cookieHeader = request.headers.get("Cookie");
  // if there is a cookie called "intro" with a truthy value, we assume the user has seen the intro
  const sawIntro = Boolean(await intro.parse(cookieHeader));
  return json(
    {
      ENV: {
        PAYLOAD_PUBLIC_SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
        CDN_CGI_IMAGE_URL: process.env.CDN_CGI_IMAGE_URL,
        USE_CLOUDFLARE_IMAGE_TRANSFORMATIONS:
          process.env.USE_CLOUDFLARE_IMAGE_TRANSFORMATIONS,
      },
      sawIntro,
      site,
      navigations,
    },
    {
      // set intro cookie on every request with a max age of 24 hours
      headers: {
        "Set-Cookie": await intro.serialize(true, {
          path: "/",
          maxAge: 60 * 60 * 24,
        }),
      },
    },
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.site.meta?.title },
];

export default function App() {
  const { ENV, site, navigations, sawIntro } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (isMenuOpen) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  }, [pathname]);

  return (
    <html lang="de" className="font-sans text-gray-800">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {site.meta?.image && (
          <meta
            property="og:image"
            content={getOptimizedImageUrl(
              (site.meta.image as Media).url as string,
              {
                width: 1200,
              },
            )}
          />
        )}
        {(site.meta?.additionalMetaTags || []).map((tag) => (
          <meta key={tag.key} name={tag.key} content={tag.value} />
        ))}
        {/* <style>
          @import
          url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400,500,700&display=swap')
        </style> */}
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
      </head>
      <CookieConsentProvider>
        <body>
          {pathname === "/" && <Intro initiallyHidden={sawIntro} />}
          <div className="mx-auto w-full max-w-[1320px] lg:flex">
            <aside className="border-b-1 top-0 flex shrink-0 flex-col border-key-500 px-4 pb-4 pt-4 md:overflow-auto md:overscroll-contain lg:sticky lg:h-[100vh] lg:border-none lg:pb-0 lg:pl-8 lg:pr-12 xl:pt-12">
              <NavLink
                to="/"
                prefetch="intent"
                className="self-center pb-4 lg:pb-0"
              >
                {site.logo && (
                  <Image
                    media={site.logo as Media}
                    className="max-w-[300px]"
                    sizes="300px"
                    srcSet={[
                      {
                        options: { width: 300 },
                        size: "300w",
                      },
                      {
                        options: { width: 600 },
                        size: "600w",
                      },
                    ]}
                  />
                )}
              </NavLink>
              <div className="fixed right-0 top-0 z-50 bg-white p-4 lg:hidden">
                <Hamburger
                  onToggle={toggleMenu}
                  toggled={isMenuOpen}
                  color="#DEB754"
                  distance={"sm"}
                />
              </div>
              <div
                className={twMerge(
                  "z-49 fixed right-0 top-0 h-[100vh] h-full translate-x-0 bg-white px-8 pt-12 shadow-lg transition-transform max-lg:overflow-y-auto max-sm:w-full lg:contents lg:text-start",
                  !isMenuOpen && "translate-x-full shadow-none",
                )}
              >
                <div className="mt-8 w-full flex-1 sm:pl-6 lg:pl-12 xl:mt-12">
                  <Navigation
                    items={navigations.main}
                    className="flex-col gap-y-1 text-end text-gray-500 lg:text-start xl:gap-y-2"
                  />
                </div>
                <div className="lg:text-md w-full space-y-2 py-4 font-altsans text-lg text-key-500 sm:pl-6 lg:pl-12 xl:py-8">
                  <div className="flex items-center justify-end gap-2 lg:justify-start">
                    <div className="icon-[ion--ios-call] text-xl"></div>
                    <a href={`tel:${site.contact?.phone}`}>
                      {site.contact?.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-end gap-2 lg:justify-start">
                    <div className="icon-[ion--md-mail] text-xl"></div>
                    <a href={`mailto:${site.contact?.email}`}>
                      {site.contact?.email}
                    </a>
                  </div>
                </div>
              </div>
            </aside>
            <div className="lg:border-l-1 flex min-h-[100vh] w-full flex-col border-key-200">
              <div className="flex-1 px-4 pt-12 lg:px-12 lg:px-16 lg:pt-36">
                <Outlet />
              </div>
              <footer className="text-md mt-16 flex flex-col items-center bg-key-500 p-4 font-altsans text-white lg:text-sm">
                <Navigation
                  items={navigations.footer}
                  className="flex flex-wrap justify-center gap-x-4 gap-y-0 pb-4 lg:pb-0"
                  itemClassName="hover:underline hover:text-white"
                  activeItemClassName="underline"
                />
                <p className="text-center leading-snug">
                  Copyright ©{new Date().getFullYear()} Praxis und Schule für
                  transpersonale Psychologie. Alle Rechte vorbehalten.
                </p>
              </footer>
            </div>
          </div>
          <ScrollRestoration />
          <Scripts />
          <Cookies />
        </body>
      </CookieConsentProvider>
    </html>
  );
}
