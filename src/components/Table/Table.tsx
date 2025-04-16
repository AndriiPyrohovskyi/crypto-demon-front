import './Table.css';

const Table = ({ columns, data }: { columns: string[]; data: any[] }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col]}</td>
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
  );
};

export default Table;