import { Box } from '@chakra-ui/react'
import React from 'react'
import { IconType } from 'react-icons'
import ReactPaginate from 'react-paginate'

interface PaginationProps {
  itemsPerPage: number
  pages: number
  handlePaginate?: (skip) => void
}
const Paginate: React.FC<PaginationProps> = ({
  itemsPerPage,
  pages,
  handlePaginate
}) => {
  return (
    <Box className="paginate-container">
      <ReactPaginate
        onPageChange={handlePaginate}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        pageCount={pages}
        className="page"
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        renderOnZeroPageCount={null}
        // initialPage={0}
        containerClassName="pagination"
      />
    </Box>
  )
}

export default Paginate
