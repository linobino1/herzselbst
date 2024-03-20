import React from "react";
import type { Media } from "payload/generated-types";
import Image from "~/components/Image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export type Type = {
  images?:
    | {
        image: Media | string;
        id?: string | null;
        caption?: string;
      }[]
    | null;
};

export const Gallery: React.FC<Type> = ({ images }) => {
  return images ? (
    <div className="mb-16 mt-4">
      <Carousel showArrows={true} showThumbs={false} showStatus={false}>
        {images.map((item) => (
          <figure key={item.id} className="relative">
            <Image className="" media={item.image as Media} />
            <figcaption className="z-1 absolute bottom-1 left-1 bg-black bg-opacity-20 px-2 text-sm text-gray-100">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </Carousel>
    </div>
  ) : null;
};

export default Gallery;
