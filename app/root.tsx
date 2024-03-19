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
      <body>
        {pathname === "/" && <Intro />}
        <div className="mx-auto grid h-[100vh] w-full max-w-[1320px] grid-cols-[380px_calc(100%_-_380px)] overflow-hidden">
          <aside className="border-r-1 border-key-200 flex h-[100vh] flex-col overflow-y-visible px-8 pt-12">
            <NavLink to="/" prefetch="intent">
              {site.logo && <Image media={site.logo as Media} />}
            </NavLink>
            <div className="mt-12 w-full flex-1 pl-12">
              <Navigation
                items={navigations.main}
                className="flex-col text-lg text-gray-500"
              />
            </div>
            <div className="text-key-500 font-altsans space-y-2 py-8 pl-12">
              <div className="flex items-center gap-2">
                <div className="i-ion:ios-call text-xl" />
                <a href={`tel:${site.contact?.phone}`}>{site.contact?.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <div className="i-ion:md-mail text-xl" />
                <a href={`mailto:${site.contact?.email}`}>
                  {site.contact?.email}
                </a>
              </div>
            </div>
          </aside>
          <div className="flex min-h-[100vh] flex-col overflow-y-auto">
            <div className="flex-1 px-16 pt-32">
              <Outlet />
            </div>
            <footer className="bg-key-500 font-altsans mt-16 flex w-full flex-col items-center gap-1 p-4 text-sm text-white">
              <Navigation items={navigations.footer} className="flex gap-4" />
              <p>
                Copyright ©{new Date().getFullYear()} Praxis und Schule für
                transpersonale Psychologie. Alle Rechte vorbehalten.
              </p>
            </footer>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
