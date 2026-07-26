"use client";

import type { WheelEvent } from "react";

export default function StoryboardRail({
  children,
}: {
  children: React.ReactNode;
}) {
  const moveSideways = (event: WheelEvent<HTMLDivElement>) => {
    const rail = event.currentTarget;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const maximum = rail.scrollWidth - rail.clientWidth;
    const movingForward = event.deltaY > 0;
    const canMove =
      (movingForward && rail.scrollLeft < maximum - 2) ||
      (!movingForward && rail.scrollLeft > 2);

    if (!canMove) return;
    event.preventDefault();
    rail.scrollLeft += event.deltaY * 1.15;
  };

  return (
    <div className="storyboardRail" onWheel={moveSideways}>
      {children}
    </div>
  );
}
