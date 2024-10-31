import React, { useState } from 'react'
import type { Navigations, Category } from '@/payload-types'
import { Link, NavLink, useLocation } from '@remix-run/react'
import { twMerge } from 'tailwind-merge'

type ItemProps = {
  item: NonNullable<Navigations['main']>[0]
  itemClassName?: string
  activeItemClassName?: string
}

type Props = {
  items: Navigations['main' | 'footer']
  className?: string
  itemClassName?: string
  activeItemClassName?: string
}

const NavigationItem: React.FC<ItemProps> = ({
  item,
  itemClassName,
  activeItemClassName = 'text-key-500',
}) => {
  const { pathname } = useLocation()
  const [isToggled, setIsToggled] = useState<Record<string, boolean>>({})

  if (item.type === 'subnavigation') {
    const isActive = pathname !== '/' && pathname.includes(item.relativeUrl ?? '')
    return (
      <div className="flex flex-col gap-0">
        <div className="flex items-start justify-between gap-8 lg:contents">
          <button
            onClick={() =>
              setIsToggled((prev) => ({
                ...prev,
                [item.id || '']: !prev[item.id || ''],
              }))
            }
            className="flex items-center"
          >
            <div
              className={twMerge(
                'mt-0.5 text-xl text-gray-300 lg:hidden',
                isActive || isToggled[item.id || ''] ? 'i-ion:minus' : 'i-ion:plus',
              )}
            />
          </button>
          <NavLink
            to={item.relativeUrl ?? ''}
            className={twMerge(
              'hover:text-key-400 mb-2',
              itemClassName,
              isActive && activeItemClassName,
              // isActive && 'text-red',
            )}
            prefetch="intent"
          >
            {item.label}
          </NavLink>
        </div>
        <Navigation
          items={item.subnavigation}
          className={twMerge(
            'transition-max-height max-h-[20em] flex-col gap-2 overflow-hidden pl-6 text-sm font-medium duration-500 ease-in-out',
            !isActive && !isToggled[item.id || ''] && 'max-h-0',
          )}
        />
      </div>
    )
  }

  const classes = twMerge(
    'hover:text-key-400 mb-2 transition-colors duration-200 ease-in-out',
    itemClassName,
  )

  if (item.type === 'external') {
    return (
      <Link
        to={item.url || ''}
        target={item.newTab ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className={classes}
      >
        {item.label}
      </Link>
    )
  }

  if (item.type === 'internal') {
    return (
      <NavLink
        to={item.relativeUrl ?? ''}
        className={({ isActive, isPending }) =>
          twMerge(classes, (isActive || isPending) && activeItemClassName)
        }
        prefetch="intent"
      >
        {item.label}
      </NavLink>
    )
  }

  return <div className="flex items-center">{item.label}</div>
}

export const Navigation: React.FC<Props> = ({
  items,
  itemClassName,
  activeItemClassName,
  className,
}) => {
  // each item renders as either an internal link, an external link with an icon or text, or another navigation
  return items ? (
    <nav className={twMerge('flex gap-4', className)}>
      {items?.map((item) => (
        <NavigationItem
          item={item}
          key={item.id}
          itemClassName={itemClassName}
          activeItemClassName={activeItemClassName}
        />
      ))}
    </nav>
  ) : (
    <></>
  )
}

export default Navigation
