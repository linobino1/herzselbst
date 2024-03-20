import { link } from "../fields/link";
import type { Block } from "payload/types";

export const Button: Block = {
  slug: "button",
  fields: [link({}), { name: "label", label: "Beschriftung", type: "text" }],
};

export default Button;
