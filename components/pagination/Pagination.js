import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, handlePageClick, currentPage, totalItems }) => {
  return (
    <div className={"flex justify-between items-center"}>
      <p className={"text-info-gray text-sm "}>showing {currentPage} to {totalItems} items</p>
      <ReactPaginate
        className={"flex items-center justify-end"}
        breakLabel={<span className='mr-2 text-gray-900'>...</span>}
        nextLabel={
          <span className='w-10 h-10 flex items-center justify-center bg-transparent text-muted-foreground rounded-md ml-2'>
            <BsChevronRight />
          </span>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={Number.isInteger(pageCount) ? pageCount : 0}
        previousLabel={
          <span className='w-10 h-10 flex items-center justify-center bg-transparent text-muted-foreground rounded-md mr-4'>
            <BsChevronLeft />
          </span>
        }
        containerClassName='pagination flex items-center justify-center mt-8 mb-4'
        pageClassName='block border border-solid text-muted-foreground border-cyan-600 w-10 h-10 flex items-center justify-center rounded-lg mr-2'
        activeClassName='bg-[#009EF7] text-white'
        forcePage={currentPage - 1}
      />
    </div>
  );
};

export default Pagination;
