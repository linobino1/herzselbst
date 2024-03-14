import type { Page } from "payload/generated-types";

type BlockProps = Extract<
  NonNullable<Page["layout"]>[0],
  { blockType: "image" }
>;

interface Props
  extends Omit<React.HTMLAttributes<HTMLImageElement>, "id" | "content">,
    Omit<BlockProps, "content"> {}

export const ImageBlock: React.FC<Props> = ({
  image,
  caption_html,
  className,
  blockType,
  blockName,
  ...props
}) => {
  if (typeof image === "string") {
    return null;
  }
  return (
    <img
      id={props.id || undefined}
      {...props}
      src={image.url || ""}
      alt={image.alt || "alt"}
      width={image.width || 1}
      height={image.height || 1}
    />
  );
};
export default ImageBlock;
