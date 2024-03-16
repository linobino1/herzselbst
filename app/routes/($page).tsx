import { type LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import {
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { Media, Page } from "payload/generated-types";
import Image from "~/components/Image";
import Intro from "~/components/Intro";
import Blocks from "~/components/blocks/Blocks";
import generateTitle from "~/util/generateTitle";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  const rootLoaderData = matches.find((match) => match.id === "root")
    ?.data as any;
  return [
    {
      title: generateTitle(rootLoaderData?.site, data?.page),
    },
    // TODO meta description
  ];
};

export const loader = async ({
  params: { page },
  context: { payload },
}: LoaderFunctionArgs) => {
  const pageDocs = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: page ?? "home",
      },
    },
  });

  if (!pageDocs.totalDocs) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return { page: pageDocs.docs[0] };
};

export default function Page() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <>
      {page?.slug === "home" && <Intro />}
      <h1 className="mb-12">{page?.title}</h1>
      <div className="grid grid-cols-[auto_auto] gap-16">
        <Blocks blocks={page?.layout} />
        {page?.images && (
          <div className="space-y-16 pr-4 pt-6">
            {page.images.map((image) => (
              <Image
                media={image.image as Media}
                key={image.id}
                className="w-38 h-38 mb-4 rounded-full object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
