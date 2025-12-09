/**
 * Skeleton Table Component
 * Loading placeholder for table rows
 * @param {object} props - Component props
 * @param {number} props.rows - Number of skeleton rows to display (default: 5)
 * @param {number} props.columns - Number of columns (default: 6)
 */
const SkeletonTable = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index}>
                <div className="h-4 bg-base-300 rounded w-20 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div className="h-4 bg-base-300 rounded w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
