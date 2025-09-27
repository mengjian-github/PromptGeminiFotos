import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

interface UsePaginationOptions {
  itemsPerPage?: number;
}

export interface PaginationState<T> {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  paginatedItems: T[];
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
}

export function usePagination<T>(
  items: T[],
  { itemsPerPage = 12 }: UsePaginationOptions = {}
): PaginationState<T> {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [items, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  const startIndex = items.length === 0 ? 0 : (page - 1) * itemsPerPage;
  const endIndex = startIndex + paginatedItems.length;

  return {
    page,
    setPage,
    totalPages,
    paginatedItems,
    startIndex,
    endIndex,
    itemsPerPage
  };
}
