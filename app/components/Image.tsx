import type { Media } from "payload/generated-types";
import React from "react";

export interface Props extends React.HTMLAttributes<HTMLImageElement> {
  media?: Media;
}

const Image: React.FC<Props> = ({ media, ...props }) => {
  media = media ? (media as Media) : undefined;
  return media ? (
    <img {...props} src={media.url as string} alt={media.alt || ""} />
  ) : null;
};

export default Image;
