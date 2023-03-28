import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  Box,
  chakra,
  Flex,
  Icon,
  OmitCommonProps,
  Spinner,
  Table,
  TableCellProps,
  TableColumnHeaderProps,
  TableRowProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import {
  Column,
  useExpanded,
  usePagination,
  useSortBy,
  useTable
} from 'react-table'

interface TableServerProps {
  data: object[]
  columns: Column<object>[]
  renderRowSubComponent?: (row: object) => React.ReactNode
  url?: string
  bgColor?: string
  isLoading?: boolean
}

const TableServer: React.FC<TableServerProps> = ({
  data,
  columns,
  url,
  isLoading,
  bgColor,
  renderRowSubComponent
}) => {
  const router = useRouter()
  const { order, pageNumber, ...restQuery } = router.query

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { sortBy, pageIndex },
    setSortBy
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      autoResetExpanded: false,
      initialState: {
        pageIndex: +pageNumber || 1
      }
    },
    useSortBy,
    useExpanded,
    usePagination
  )

  useEffect(() => {
    if (router.isReady) {
      !!order && setSortBy([{ id: order.toString(), desc: false }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, router.isReady])

  useEffect(() => {
    if (router.isReady) {
      const qs = Object.keys(restQuery)
        .map(key => `${key}=${restQuery[key]}`)
        .join('&')

      if (url && sortBy.length > 0) {
        router.push(
          `${url}?pageNumber=${pageIndex}&order=${sortBy[0]?.id}&${qs}`
        )
      } else if (url) {
        router.push(`${url}?pageNumber=${pageIndex}&${qs}`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, pageIndex, router.isReady])

  return (
    <Table
      variant="unstyled"
      {...getTableProps()}
      fontSize="sm"
      color={'gray.600'}
    >
      <Thead>
        {headerGroups.map(
          (headerGroup: {
            id: React.Key | null | undefined
            getHeaderGroupProps: () => JSX.IntrinsicAttributes &
              OmitCommonProps<
                React.DetailedHTMLProps<
                  React.HTMLAttributes<HTMLTableRowElement>,
                  HTMLTableRowElement
                >,
                keyof TableRowProps
              > &
              TableRowProps & { as?: 'tr' | undefined }
            headers: any[]
          }) => (
            <Tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(
                (column: {
                  id: React.Key | null | undefined
                  getHeaderProps: (
                    arg0: any
                  ) => JSX.IntrinsicAttributes &
                    OmitCommonProps<
                      React.DetailedHTMLProps<
                        React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
                        HTMLTableHeaderCellElement
                      >,
                      keyof TableColumnHeaderProps
                    > &
                    TableColumnHeaderProps & { as?: 'th' | undefined }
                  getSortByToggleProps: () => any
                  width: number | string
                  minWidth: number | string
                  maxWidth: number | string
                  render: (
                    arg0: string
                  ) =>
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | React.ReactFragment
                    | React.ReactPortal
                    | null
                    | undefined
                  isSorted: any
                  isSortedDesc: any
                }) => (
                  <Th
                    key={column.id}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    width={column.width}
                    minWidth={column.minWidth}
                    maxWidth={column.maxWidth}
                    p={3}
                    backgroundColor="#e4e7ecb3"
                  >
                    {column.render('Header')}
                    <chakra.span pl={4}>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon
                            as={TriangleUpIcon}
                            aria-label="sorted descending"
                          />
                        ) : (
                          <Icon
                            as={TriangleDownIcon}
                            aria-label="sorted ascending"
                          />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                )
              )}
            </Tr>
          )
        )}
      </Thead>
      <Box h={0} />
      <Tbody {...getTableBodyProps()}>
        {page.map(
          (row: {
            id: React.Key | null | undefined
            getRowProps: () => JSX.IntrinsicAttributes &
              OmitCommonProps<
                React.DetailedHTMLProps<
                  React.HTMLAttributes<HTMLTableRowElement>,
                  HTMLTableRowElement
                >,
                keyof TableRowProps
              > &
              TableRowProps & { as?: 'tr' | undefined }
            cells: any[]
            original: { [x: string]: any }
            isExpanded: any
          }) => {
            prepareRow(row)
            return (
              <React.Fragment key={row.id}>
                <Tr
                  // eslint-disable-next-line dot-notation
                  bg={'white'}
                  {...row.getRowProps()}
                >
                  {row.cells.map(
                    (cell: {
                      row: { id: any }
                      column: { id: any }
                      getCellProps: () => JSX.IntrinsicAttributes &
                        OmitCommonProps<
                          React.DetailedHTMLProps<
                            React.TdHTMLAttributes<HTMLTableDataCellElement>,
                            HTMLTableDataCellElement
                          >,
                          keyof TableCellProps
                        > &
                        TableCellProps & { as?: 'td' | undefined }
                      render: (
                        arg0: string
                      ) =>
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | React.ReactFragment
                        | React.ReactPortal
                        | null
                        | undefined
                    }) => (
                      <Td
                        key={cell.row.id + cell.column.id}
                        {...cell.getCellProps()}
                        p={3}
                        // eslint-disable-next-line dot-notation
                        borderTopWidth={row.original['subRows'] ? 0 : 1}
                        borderBottomWidth={row.isExpanded ? 0 : 1}
                      >
                        {cell.render('Cell')}
                      </Td>
                    )
                  )}
                </Tr>
                {row.isExpanded ? (
                  <>
                    <Tr>
                      <Td colSpan={100} p={0}>
                        {renderRowSubComponent &&
                          renderRowSubComponent({ row })}
                      </Td>
                    </Tr>
                  </>
                ) : null}
              </React.Fragment>
            )
          }
        )}
        {isLoading && (
          <Tr>
            <Td colSpan={100}>
              <Flex h="200px" align="center" justify="center">
                <Spinner />
              </Flex>
            </Td>
          </Tr>
        )}
      </Tbody>
      {!isLoading && !data?.length && (
        <Tbody {...getTableBodyProps()}>
          <Tr backgroundColor={'white'}>
            <Td colSpan={columns.length}>
              <Text fontSize="sm">Nenhum registro encontrado</Text>
            </Td>
          </Tr>
        </Tbody>
      )}
    </Table>
  )
}

export default TableServer
