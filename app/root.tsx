import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
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
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import "./global.css";
import type { Media } from "payload/generated-types";
import Image from "./components/Image";
import Navigation from "./components/Navigation";
import Intro from "./components/Intro";
import Cookies, { CookieConsentProvider } from "./providers/Cookies";

export async function loader({ context: { payload } }: LoaderFunctionArgs) {
  const [site, navigations] = await Promise.all([
    await payload.findGlobal({
      slug: "site",
    }),
    await payload.findGlobal({
      slug: "navigations",
      depth: 1,
    }),
  ]);
  return json({
    ENV: {
      PAYLOAD_PUBLIC_SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
    },
    site,
    navigations,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.site.meta?.title },
];

export default function App() {
  const { ENV, site, navigations } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  return (
    <html lang="de" className="font-sans text-gray-800">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          {pathname === "/" && <Intro />}
          <div className="mx-auto flex w-full max-w-[1320px]">
            <aside className="sticky top-0 flex h-[100vh] flex-col px-4 pt-12 lg:px-8">
              <NavLink to="/" prefetch="intent" className="self-center">
                {site.logo && <Image media={site.logo as Media} />}
              </NavLink>
              <div className="mt-12 w-full flex-1 overflow-y-auto sm:pl-6 lg:pl-12">
                <Navigation
                  items={navigations.main}
                  className="flex-col text-lg text-gray-500"
                />
              </div>
              <div className="text-key-500 font-altsans w-full space-y-2 py-8 sm:pl-6 lg:pl-12">
                <div className="flex items-center gap-2">
                  <div className="i-ion:ios-call text-xl" />
                  <a href={`tel:${site.contact?.phone}`}>
                    {site.contact?.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="i-ion:md-mail text-xl" />
                  <a href={`mailto:${site.contact?.email}`}>
                    {site.contact?.email}
                  </a>
                </div>
              </div>
            </aside>
            <div className="border-l-1 border-key-200 flex min-h-[100vh] w-full flex-col">
              <div className="flex-1 px-8 pt-32 lg:px-16">
                <Outlet />
              </div>
              <footer className="bg-key-500 font-altsans mt-16 flex flex-col items-center p-4 text-sm text-white">
                <Navigation
                  items={navigations.footer}
                  className="flex gap-4"
                  activeClassName="underline"
                />
                <p>
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
