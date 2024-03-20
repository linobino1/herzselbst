import React from "react";
import type { Navigations, Category } from "payload/generated-types";
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
    const category = item.category?.value as Category;
    const isActive = pathname.includes(category.slug || "");
    return (
      <div className="flex flex-col gap-0 ">
        <NavLink
          to={category.url || ""}
          className={twMerge(
            "hover:text-key-400 mb-2",
            isActive && "text-key-500",
          )}
          prefetch="intent"
        >
          {category.title}
        </NavLink>
        <Navigation
          items={item.subnavigation}
          nested={true}
          className={twMerge(
            "transition-max-height max-h-[20em] flex-col gap-2 overflow-hidden pl-6 text-sm font-medium duration-500 ease-in-out",
            !isActive && "max-h-0",
          )}
        />
      </div>
    );
  }

  const classes =
    "hover:text-key-400 mb-2 transition-colors duration-200 ease-in-out";

  if (item.type === "external") {
    return (
      <Link
        to={item.url || ""}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {item.label}
      </Link>
    );
  }

  if (item.type === "internal") {
    return (
      <NavLink
        to={(item.doc?.value as any).url}
        className={({ isActive, isPending }) =>
          twMerge(classes, (isActive || isPending) && "text-key-500")
        }
        prefetch="intent"
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
