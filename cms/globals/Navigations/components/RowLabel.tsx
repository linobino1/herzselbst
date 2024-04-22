"use client";
import { useEffect, useState } from "react";

export const RowLabel = ({
  data,
  index = 0,
}: {
  data: any;
  index?: number;
}) => {
  const [label, setLabel] = useState(`Item ${String(index).padStart(2, "0")}`);

  useEffect(() => {
    if (data.type === "external") {
      setLabel(data.label || data.url);
    } else if (data.doc?.value) {
      fetch(`/api/pages/${data.doc.value}`).then(async (res) => {
        setLabel(((await res.json()) as any).title);
      });
    } else if (data.category?.value) {
      fetch(`/api/categories/${data.category.value}`).then(async (res) => {
        setLabel(((await res.json()) as any).title);
      });
    }
  }, [data]);

  return label;
};
