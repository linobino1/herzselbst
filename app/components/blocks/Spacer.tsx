import type { Page } from "payload/generated-types";

type BlockProps = Extract<
  NonNullable<Page["layout"]>[0],
  { blockType: "spacer" }
>;

interface Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "content">,
    Omit<BlockProps, "content"> {}

const sizesMap = {
  small: "h-2",
  medium: "h-12",
  large: "h-32",
};

export const Content: React.FC<Props> = ({
  size,
  className,
  blockType,
  blockName,
  ...props
}) => {
  return (
    <div className={sizesMap[size]} {...props} id={props.id || undefined} />
  );
};
export default Content;
