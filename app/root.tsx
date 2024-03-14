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
} from "@remix-run/react";
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import "./global.css";
import type { Media } from "payload/generated-types";
import Image from "./components/Image";
import Navigation from "./components/Navigation";

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
        <div className="mx-auto grid min-h-[100vh] w-full max-w-[1320px] grid-cols-[380px_calc(100%_-_380px)]">
          <aside className="border-r-1 border-key-200 px-8 pt-12">
            <NavLink to="/" prefetch="intent">
              {site.logo && <Image media={site.logo as Media} />}
            </NavLink>
            <div className="mt-12 w-full px-12">
              <Navigation
                items={navigations.main}
                className="flex flex-col gap-2 text-lg text-gray-500"
              />
            </div>
          </aside>
          <div className="px-16 pt-32">
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
