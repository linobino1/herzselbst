import type { Field } from "payload/types";

export const linkAppendix: Field = {
  name: "appendix",
  label: "Appendix",
  type: "text",
  admin: {
    description:
      "Hier kann ein query-Parameter oder Anchor für den Link angegeben werden, z.B. ?utm_source=... oder #mein-anchor",
  },
};
