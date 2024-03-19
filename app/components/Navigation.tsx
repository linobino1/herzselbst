import React from "react";
import type { Navigations, Page } from "payload/generated-types";
import { Link, NavLink, useLocation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

type Props = {
  items: Navigations["main" | "footer"];
  nested?: boolean;
  className?: string;
};

const NavigationItem: React.FC<{
  item: NonNullable<Navigations["main"]>[0];
  nested: boolean;
}> = ({ item }) => {
  const { pathname } = useLocation();
  if (item.type === "subnavigation") {
    const isActive = item.subnavigation?.some((subitem) => {
      return pathname.includes((subitem.doc?.value as Page).slug || "");
    });
    return (
      <div className="flex flex-col gap-2">
        <div className={twMerge(isActive && "text-key-500")}>{item.label}</div>
        <Navigation
          items={item.subnavigation}
          nested={true}
          className={"flex-col pl-6 text-sm font-medium"}
        />
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
    return (
      <NavLink
        to={(item.doc?.value as any).url}
        className={({ isActive }) => twMerge(isActive && "text-key-500")}
      >
        {(item.doc?.value as any).title}
      </NavLink>
    );
  }

  return <div className="flex items-center">{item.label}</div>;
};

export const Navigation: React.FC<Props> = ({
  items,
  nested = false,
  className,
}) => {
  // each item renders as either an internal link, an external link with an icon or text, or another navigation
  return items ? (
    <nav className={twMerge("flex gap-4", className)}>
      {items?.map((item) => (
        <NavigationItem item={item} key={item.id} nested={nested} />
      ))}
    </nav>
  ) : (
    <></>
  );
};

export default Navigation;
