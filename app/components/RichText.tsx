import type { Page } from "payload/generated-types";
import { twMerge } from "tailwind-merge";
import { Serialize } from "~/richtext/Serialize";
import type { SerializedLexicalNode } from "~/richtext/types";

export interface Props
  extends Omit<React.HTMLAttributes<HTMLElement>, "content"> {
  content: Page["content"];
  as?: React.ElementType<React.HTMLAttributes<HTMLElement>>;
}

export const RichText: React.FC<Props> = ({
  content,
  as: Component = "div",
  className,
  ...props
}) => {
  return (
    <Component className={twMerge("lexical", className)} {...props}>
      <Serialize nodes={content?.root.children as SerializedLexicalNode[]} />
    </Component>
  );
};

export default RichText;
