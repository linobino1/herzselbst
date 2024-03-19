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
      <div className="transition-500 flex flex-col gap-2 transition-colors ease-in-out ">
        <NavLink
          to={category.url || ""}
          className={twMerge(
            "hover:text-key-400",
            isActive && "text-key-500 peer",
          )}
          prefetch="intent"
        >
          {category.title}
        </NavLink>
        <Navigation
          items={item.subnavigation}
          nested={true}
          className={twMerge(
            "transition-max-height max-h-[20em] flex-col overflow-hidden pl-6 text-sm font-medium duration-200 ease-in-out",
            !isActive && "max-h-0",
          )}
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
        className={({ isActive }) =>
          twMerge("hover:text-key-400", isActive && "text-key-500")
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
