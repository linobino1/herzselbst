import type { HTMLConverter } from "@payloadcms/richtext-lexical";
import type { SerializedParagraphNode } from "lexical";

/**
 * This converter is used to add tailwind classes for alignment to the richtext output.
 */
export const HTMLConverterWithAlign: HTMLConverter<SerializedParagraphNode> = {
  async converter({ childIndex, converters, node, parent }) {
    const targetConverter = converters.find(
      (converter) =>
        converter.nodeTypes !== HTMLConverterWithAlign.nodeTypes &&
        converter.nodeTypes.includes(node.type)
    );
    if (!targetConverter) {
      return "";
    }
    const text = await targetConverter.converter({
      childIndex,
      converters,
      node,
      parent,
    });
    if (!["left", "center", "right"].includes(node.format)) {
      return text;
    }
    const firstTag = text.slice(0, text.indexOf(">") + 1);
    if (firstTag.includes("class")) {
      return text.replace('class="', `class="${"text-" + node.format}`);
    }
    return text.replace(">", ` class="${"text-" + node.format}">`);
  },
  nodeTypes: ["paragraph", "heading"],
};
