import type { Page } from "payload/generated-types";
import Gutter from "../Gutter";
import RichText from "../RichText";

type BlockProps = Extract<
  NonNullable<Page["layout"]>[0],
  { blockType: "content" }
>;

interface Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "content">,
    Omit<BlockProps, "content"> {
  content?: any;
  as?: string;
}

export const Content: React.FC<Props> = ({
  content,
  content_html,
  className,
  blockType,
  blockName,
  as = "div",
  ...props
}) => {
  return (
    <RichText
      {...props}
      id={props.id || undefined}
      content={content_html || ""}
    />
  );
};
export default Content;
