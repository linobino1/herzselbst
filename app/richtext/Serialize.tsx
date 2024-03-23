import { Fragment } from "react";

import escapeHTML from "escape-html";

import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  IS_CODE,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
} from "./RichTextNodeFormat";

import type { SerializedLexicalNode } from "./types";
import { twMerge } from "tailwind-merge";
import { Link } from "@remix-run/react";
import { YoutubeEmbed } from "~/components/YoutubeEmbed";
import Image from "~/components/Image";
import type { Publication } from "../../cms/blocks/Publications";
import Newsletter from "~/components/Newsletter";
import Gallery from "~/components/Gallery";
import GoogleMapsEmbed from "~/components/GoogleMapsEmbed";

interface Props {
  nodes: SerializedLexicalNode[];
}

export function Serialize({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node.type === "text") {
          let text = (
            <span
              key={index}
              dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }}
            />
          );
          if (
            typeof node.format === "number" ||
            typeof node.format === "bigint"
          ) {
            if (node.format & IS_BOLD) {
              text = <strong key={index}>{text}</strong>;
            }
            if (node.format & IS_ITALIC) {
              text = <em key={index}>{text}</em>;
            }
            if (node.format & IS_STRIKETHROUGH) {
              text = (
                <span key={index} className="line-through">
                  {text}
                </span>
              );
            }
            if (node.format & IS_UNDERLINE) {
              text = (
                <span key={index} className="underline">
                  {text}
                </span>
              );
            }
            if (node.format & IS_CODE) {
              text = <code key={index}>{text}</code>;
            }
            if (node.format & IS_SUBSCRIPT) {
              text = <sub key={index}>{text}</sub>;
            }
            if (node.format & IS_SUPERSCRIPT) {
              text = <sup key={index}>{text}</sup>;
            }
          }

          return text;
        }

        if (node == null) {
          return null;
        }

        // alignment
        let className = "";
        if (node.format === "center") {
          className = twMerge(className, "text-center");
        }
        if (node.format === "right") {
          className = twMerge(className, "text-right");
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (
          node: SerializedLexicalNode,
        ): JSX.Element | null => {
          if (node.children == null) {
            return null;
          } else {
            if (node?.type === "list" && node?.listType === "check") {
              for (const item of node.children) {
                if (!item?.checked) {
                  item.checked = false;
                }
              }
              return Serialize({ nodes: node.children });
            } else {
              return Serialize({ nodes: node.children });
            }
          }
        };

        const serializedChildren = serializedChildrenFn(node);

        switch (node.type) {
          case "linebreak": {
            return <br key={index} />;
          }
          case "paragraph": {
            return (
              <p className={className} key={index}>
                {serializedChildren}
              </p>
            );
          }
          case "heading": {
            type Heading = Extract<
              keyof JSX.IntrinsicElements,
              "h1" | "h2" | "h3" | "h4" | "h5"
            >;
            const Tag = node?.tag as Heading;
            return (
              <Tag key={index} className={className}>
                {serializedChildren}
              </Tag>
            );
          }
          case "list": {
            type List = Extract<keyof JSX.IntrinsicElements, "ul" | "ol">;
            const Tag = node?.tag as List;
            return (
              <Tag key={index} className={node?.listType}>
                {serializedChildren}
              </Tag>
            );
          }
          case "listitem": {
            if (node?.checked != null) {
              return (
                <li
                  key={index}
                  className={`component--list-item-checkbox ${
                    node.checked
                      ? "component--list-item-checkbox-checked"
                      : "component--list-item-checked-unchecked"
                  }`}
                  value={node?.value}
                  role="checkbox"
                  aria-checked={node.checked ? "true" : "false"}
                  tabIndex={-1}
                >
                  {serializedChildren}
                </li>
              );
            } else {
              return (
                <li key={index} value={node?.value}>
                  {serializedChildren}
                </li>
              );
            }
          }
          case "quote": {
            return (
              <blockquote className={className} key={index}>
                {serializedChildren}
              </blockquote>
            );
          }
          case "link": {
            const fields: {
              doc?: any;
              linkType?: "custom" | "internal";
              newTab?: boolean;
              url?: string;
            } = node.fields;

            if (fields.linkType === "custom") {
              const rel = "noopener noreferrer nofollow";
              return (
                <a
                  key={index}
                  href={fields.url}
                  target={fields.newTab ? 'target="_blank"' : undefined}
                  rel={rel}
                  className="text-key-500 underline"
                >
                  {serializedChildren}
                </a>
              );
            } else if (fields.linkType === "internal") {
              return (
                <Link
                  key={index}
                  to={fields.doc.value.url}
                  target={fields.newTab ? "_blank" : undefined}
                  className="text-key-500 underline"
                  prefetch="intent"
                >
                  {serializedChildren}
                </Link>
              );
            }
          }
          case "inline-image": {
            // TODO: inline-images based on InlineImagePlugin
            return (
              <span key={index} style={{ fontStyle: "italic" }}>
                {" "}
                (An inline image will appear here! Honest!){" "}
              </span>
            );
          }

          case "block":
            switch (node.fields.blockType) {
              case "video":
                return (
                  <YoutubeEmbed
                    key={index}
                    url={node.fields.url}
                    pagePrivacy={node.fields.pagePrivacy}
                  />
                );

              case "publications":
                return (
                  <div key={index} className="mb-12 mt-6 space-y-8">
                    {node.fields.items.map(
                      (item: Publication, subIndex: number) => (
                        <div key={subIndex} className="flex gap-6">
                          <Image
                            media={item.image}
                            className="w-24 self-start object-contain"
                          />
                          <div>
                            <div className="font-bold leading-snug">
                              {item.title}
                            </div>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: escapeHTML(item.description).replace(
                                  /\n/g,
                                  "<br>",
                                ),
                              }}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                );

              case "foldable":
                return (
                  <details key={index}>
                    <summary className="text-key-500 font-altsans mb-4 cursor-pointer text-xl underline">
                      {node.fields.title}
                    </summary>
                    <div className="pb-4">
                      <Serialize nodes={node.fields.content.root.children} />
                    </div>
                  </details>
                );

              case "button":
                return (
                  <Link
                    key={index}
                    to={node.fields.link.url || node.fields.link.doc.value.url}
                    prefetch={node.fields.link.doc ? "intent" : undefined}
                    rel={
                      node.fields.link.url
                        ? "noopener noreferrer nofollow"
                        : undefined
                    }
                    target={node.fields.link.newTab ? "_blank" : undefined}
                    className="bg-key-500 font-altsans hover:bg-key-600 my-4 flex w-fit max-w-full cursor-pointer rounded-sm px-4 py-2 text-center text-white underline transition-colors"
                  >
                    {node.fields.label}
                  </Link>
                );

              case "review":
                return (
                  <div key={index} className="mb-8 mt-4 flex flex-col gap-4">
                    <div
                      className="text-sm italic leading-loose text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: `„${escapeHTML(node.fields.content).replace(
                          /\n/g,
                          "<br>",
                        )}“`,
                      }}
                    />
                    <div className="flex items-center gap-4">
                      <Image
                        media={node.fields.author.image}
                        className="aspect-1/1 w-[60px] rounded-full object-cover"
                        srcSet={[
                          {
                            options: { width: 60, height: 60, fit: "crop" },
                            size: "60w",
                          },
                          {
                            options: { width: 120, height: 120, fit: "crop" },
                            size: "120w",
                          },
                        ]}
                        sizes="60px"
                      />
                      <div className="flex flex-col">
                        <div className="text-key-500 text-sm leading-snug">
                          {node.fields.author.name}
                        </div>
                        {node.fields.author.about && (
                          <div
                            className="text-xs leading-relaxed text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: escapeHTML(
                                node.fields.author.about,
                              ).replace(/\n/g, "<br>"),
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );

              case "ctaColumns":
                return (
                  <div
                    key={index}
                    className={twMerge(
                      `lg:my-x-16 my-8 grid w-full grid-cols-1 md:auto-cols-fr md:grid-flow-col md:gap-x-8`,
                    )}
                  >
                    {node.fields.items.map((item: any, subIndex: number) => (
                      <div key={subIndex} className="flex flex-col gap-4">
                        <div
                          className={twMerge(
                            "border-key-500 w-full md:hidden",
                            subIndex > 0 && "border-t-1 mb-2 pb-2",
                          )}
                        />
                        <Image
                          media={item.image}
                          className="aspect-1/1 w-[135px] rounded-full object-cover"
                          srcSet={[
                            {
                              options: { width: 135, height: 135, fit: "crop" },
                              size: "135w",
                            },
                            {
                              options: { width: 270, height: 270, fit: "crop" },
                              size: "270w",
                            },
                          ]}
                          sizes="135px"
                        />
                        <div className="font-altsans">
                          <div className="font-bold leading-snug">
                            {item.title}
                          </div>
                          <Serialize nodes={item.content.root.children} />
                        </div>
                      </div>
                    ))}
                  </div>
                );

              case "newsletter":
                return <Newsletter key={index} {...node.fields} />;

              case "gallery":
                return <Gallery key={index} images={node.fields.items} />;

              case "googleMaps":
                return <GoogleMapsEmbed key={index} {...node.fields} />;

              default:
                return (
                  <p key={index}>
                    unimplemented block type {node.fields.blockType}
                  </p>
                );
            }

          default:
            return <p key={index}>unimplemented node type {node.type}</p>;
        }
      })}
    </Fragment>
  );
}
