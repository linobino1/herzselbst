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
            return <Tag key={index}>{serializedChildren}</Tag>;
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
                return <YoutubeEmbed key={index} url={node?.fields.url} />;

              case "publications":
                return (
                  <div key={index} className="mb-12 mt-6 space-y-8">
                    {node.fields.items.map(
                      (item: Publication, subIndex: number) => (
                        <div key={subIndex} className="flex gap-6">
                          <Image
                            media={item.image}
                            className="w-24 object-contain"
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
                    <summary className="text-key-500 font-altsans mb-4 cursor-pointer pl-4 text-xl underline">
                      {node.fields.title}
                    </summary>
                    <Serialize nodes={node.fields.content.root.children} />
                  </details>
                );

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
