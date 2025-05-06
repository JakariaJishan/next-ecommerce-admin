import { useState, useEffect } from "react";

const useFilter = () => {

  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (status) {
      params.append("status", status);
    }
    if (startDate) {
      params.append("start_date", startDate);
    }
    if (endDate) {
      params.append("end_date", endDate);
    }
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    return params.toString();
  };

  return {
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchQuery,
    setSearchQuery,
    buildQueryParams,
  };
};

export default useFilter;
