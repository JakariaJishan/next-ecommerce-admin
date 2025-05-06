import { useState } from 'react';

export const usePagination = (initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const handlePageClick = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const updateTotalPages = (total) => {
    setTotalPages(total.total_pages);
    setTotalItems(total.total_items)
  };

  return { currentPage, totalPages, handlePageClick, updateTotalPages, setCurrentPage, totalItems };
};
