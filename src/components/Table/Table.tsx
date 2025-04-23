import './Table.css';

interface TableColumn {
  key: string;
  header: string;
}

type TableProps = {
  columns: TableColumn[];
  data: any[];
  columnWidths?: { [key: string]: string };
};

const Table = ({ columns, data, columnWidths }: TableProps) => {
  return (
    <div className="table-container">
      <table className="table">
        <colgroup>
          {columns.map((col, index) => (
            <col
              key={index}
              style={{ width: columnWidths?.[col.key] || 'auto' }}
            />
          ))}
        </colgroup>
        <thead className="table-header">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="table-header-cell">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'table-row even' : 'table-row odd'}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{row[col.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>Немає даних</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
