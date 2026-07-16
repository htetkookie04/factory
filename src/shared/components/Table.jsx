// Lightweight declarative table used by the Admin dashboard.
// columns: [{ key, header, render?, className?, sortable? }]
export default function Table({ columns, rows, onRowClick, sort, onSort, empty = 'No records' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-4 py-3 font-semibold ${col.sortable ? 'cursor-pointer select-none' : ''} ${col.className || ''}`}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sort?.key === col.key && (
                    <span className="text-primary">{sort.dir === 'asc' ? '▲' : '▼'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-ink-soft">
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className="border-b border-line/70 transition-colors hover:bg-surface/70 cursor-pointer"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 align-middle ${col.cellClassName || ''}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
