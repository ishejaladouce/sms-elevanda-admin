// Themed data table. Subtle dividers, no aggressive borders, hover affordance per row.
export default function Table({ columns, rows, rowKey }) {
  return (
    <div className="w-full overflow-x-auto rounded-card bg-surface ring-1 ring-border shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th
                key={c.key}
                className="text-left font-medium px-4 py-3 whitespace-nowrap text-[11px] uppercase tracking-wider text-muted"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                className="px-4 py-8 text-muted text-center"
                colSpan={columns.length}
              >
                No records yet
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr
                key={rowKey(r)}
                className="border-b border-border last:border-0 transition-colors duration-200 ease-smooth hover:bg-surface2"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className="px-4 py-3 whitespace-nowrap text-text"
                  >
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
