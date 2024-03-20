import React from "react";
import type { Navigations, Category } from "payload/generated-types";
import { Link, NavLink, useLocation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

type ItemProps = {
  item: NonNullable<Navigations["main"]>[0];
  activeClassName?: string;
};

type Props = {
  items: Navigations["main" | "footer"];
  className?: string;
  activeClassName?: string;
};

const NavigationItem: React.FC<ItemProps> = ({
  item,
  activeClassName = "text-key-500",
}) => {
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
            isActive && activeClassName,
          )}
          prefetch="intent"
        >
          {category.title}
        </NavLink>
        <Navigation
          items={item.subnavigation}
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
        target={item.newTab ? "_blank" : "_self"}
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
          twMerge(classes, (isActive || isPending) && activeClassName)
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
  activeClassName,
  className,
}) => {
  // each item renders as either an internal link, an external link with an icon or text, or another navigation
  return items ? (
    <nav className={twMerge("flex gap-4", className)}>
      {items?.map((item) => (
        <NavigationItem
          item={item}
          key={item.id}
          activeClassName={activeClassName}
        />
      ))}
    </nav>
  ) : (
    <></>
  );
};

export default Navigation;
