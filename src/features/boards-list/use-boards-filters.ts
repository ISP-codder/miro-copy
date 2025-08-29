import React, { useState } from "react";

export type BoardsSortOption =
  | "createdAt"
  | "updatedAt"
  | "lastOpenedAt"
  | "name";

export type BoardsFilter = {
  search: string;
  sort: BoardsSortOption;
  showFavorites: boolean | null;
};

export function useBoardsFilters() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<BoardsSortOption>("lastOpenedAt");

  return {
    search,
    sort,
    setSearch,
    setSort,
  };
}
