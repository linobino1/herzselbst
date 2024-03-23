import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import {
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import isEmpty from "cms/lexical/isEmpty";
import type { Media, Page } from "payload/generated-types";
import Image from "~/components/Image";
import RichText from "~/components/RichText";
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
  params: { page, category },
  context: { payload },
}: LoaderFunctionArgs) => {
  // find out which page to load
  let pageSlug: string = "home";

  // no params given -> load home page
  if (typeof category === "undefined" && typeof page === "undefined") {
    pageSlug = "home";
  } else if (typeof category !== "undefined" && typeof page !== "undefined") {
    // both params given -> load page
    pageSlug = page;
  } else if (typeof category !== "undefined" && typeof page === "undefined") {
    // only one param given -> could be a page or category slug
    const [pageDocs, categoryDocs] = await Promise.all([
      payload.find({
        collection: "pages",
        where: {
          slug: {
            equals: category,
          },
        },
        depth: 1,
      }),
      payload.find({
        collection: "categories",
        where: {
          slug: {
            equals: category,
          },
        },
        depth: 0,
      }),
    ]);

    if (pageDocs.totalDocs) {
      pageSlug = category;
    } else if (categoryDocs.totalDocs) {
      pageSlug = (
        await payload.findByID({
          collection: "pages",
          id: categoryDocs.docs[0]?.defaultPage as string,
        })
      ).slug as string;
      throw redirect(`/${category}/${pageSlug}`);
    } else {
      throw new Response(null, {
        status: 404,
        statusText: "Not Found",
      });
    }
  }

  const pageDocs = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: pageSlug,
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
      <h1 className="mb-4 lg:mb-12">{page?.h1}</h1>
      <div className="flex gap-16">
        <RichText content={page?.content} className="w-full" />
        {page?.images?.length ||
        (page?.sidebar?.content && !isEmpty(page?.sidebar?.content)) ? (
          <div className="hidden shrink-0 flex-col items-center gap-16 px-2 pt-8 lg:flex">
            {(page.images || []).map((image) => (
              <Image
                media={image.image as Media}
                key={image.id}
                className="aspect-1/1 w-[142px] rounded-full object-cover"
                srcSet={[
                  {
                    options: { width: 142, height: 142, fit: "crop" },
                    size: "142w",
                  },
                  {
                    options: { width: 284, height: 284, fit: "crop" },
                    size: "284w",
                  },
                ]}
                sizes="142px"
              />
            ))}
            {page.sidebar?.content && (
              <RichText content={page.sidebar.content} className="w-40" />
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
