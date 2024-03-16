import React from "react";
import type { Navigations } from "payload/generated-types";
import { Link, NavLink } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

type Props = {
  items: Navigations["main" | "footer"];
  className?: string;
};

const NavigationItem: React.FC<{
  item: NonNullable<Navigations["main"]>[0];
}> = ({ item }) => {
  if (item.type === "subnavigation") {
    return (
      <div>
        <div>{item.label}</div>
        <Navigation items={item.subnavigation} />
      </div>
    );
  }

  if (item.type === "external") {
    return (
      <Link to={item.url || ""} target="_blank" rel="noopener noreferrer">
        {item.label}
      </Link>
    );
  }

  if (item.type === "internal") {
    return <NavLink to={(item.doc?.value as any).url}>{item.label}</NavLink>;
  }

  return <div className="flex items-center">{item.label}</div>;
};

export const Navigation: React.FC<Props> = ({ items, className }) => {
  // each item renders as either an internal link, an external link with an icon or text, or another navigation
  return items ? (
    <nav className={twMerge("", className)}>
      {items?.map((item) => <NavigationItem item={item} key={item.id} />)}
    </nav>
  ) : (
    <></>
  );
};

export default Navigation;
