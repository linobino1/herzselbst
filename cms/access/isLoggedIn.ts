import type { AccessArgs } from "payload/config";

import type { User } from "../payload-types";

export const isLoggedIn = ({
  req: { user },
}: AccessArgs<unknown, User>): boolean => {
  return !!user;
};
