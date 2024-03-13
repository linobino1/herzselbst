import type { Site } from "payload/generated-types";

export default function generateTitle(site: Site, doc: any) {
  return [doc?.title, site?.meta?.title].filter(Boolean).join(" · ");
}
