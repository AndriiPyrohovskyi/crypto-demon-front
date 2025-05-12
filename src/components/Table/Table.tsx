import React, { useState, useEffect } from 'react';
import './Table.css';

interface TableColumn {
  key: string;
  header: string;
}

type ActionColumn<T = any> = {
  header: string;
  width?: string;
  render: (row: T) => React.ReactNode;
};

type PaginationProps = {
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
};

export type TableRow = {
  [key: string]: string | number | React.ReactNode | null;
};

type TableProps<T extends TableRow = TableRow> = {
  columns: TableColumn[];
  data: T[];
  columnWidths?: { [key: string]: string };
  actionColumn?: ActionColumn<T>;
  pagination?: PaginationProps;
};

const Table = <T extends TableRow>({
  columns,
  data,
  columnWidths,
  actionColumn,
  pagination
}: TableProps<T>) => {
  const options = pagination?.rowsPerPageOptions ?? [5, 10, 20, 50];
  const defaultRPP = pagination?.defaultRowsPerPage ?? options[1];
  const [rowsPerPage, setRowsPerPage] = useState(defaultRPP);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [data, rowsPerPage]);

  const paginatedData = pagination
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;

  return (
    <div className="table-container">
      <table className="table">
        <colgroup>
          {columns.map((col, i) => (
            <col key={i} style={{ width: columnWidths?.[col.key] || 'auto' }} />
          ))}
          {actionColumn && <col style={{ width: actionColumn.width || 'auto' }} />}
        </colgroup>
        <thead>
          <tr>
            {columns.map((col, i) => <th key={i}>{col.header}</th>)}
            {actionColumn && <th>{actionColumn.header}</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? paginatedData.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'even' : 'odd'}>
              {columns.map((col, ci) => {
                const value = (row as any)[col.key];
                let cellStyle = {};

                // Динамічне забарвлення для Дельти
                if (col.key === 'Дельта') {
                  cellStyle = { color: value > 0 ? 'green' : 'red' };
                }

                // Динамічне забарвлення для теперішньої ціни
                if (col.key === 'Теперішня_ціна') {
                  cellStyle = { color: row.priceColor || 'inherit' };
                }

                return (
                  <td key={ci} style={cellStyle}>
                    {value}
                  </td>
                );
              })}
              {actionColumn && <td>{actionColumn.render(row)}</td>}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length + (actionColumn ? 1 : 0)}>
                Немає даних
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="pagination-panel">
          <div className="rows-per-page">
            <label>Записів на сторінці:</label>
            <select
              value={rowsPerPage}
              onChange={e => setRowsPerPage(Number(e.target.value))}
            >
              {options.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="page-nav">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={p === currentPage ? 'active' : ''}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >→</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
