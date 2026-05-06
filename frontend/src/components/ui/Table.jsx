export default function Table({ columns, rows, rowKey }) {
  return (
    <div className="w-full overflow-x-auto rounded-card border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface2 text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left font-medium px-3 py-2 whitespace-nowrap">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-6 text-muted" colSpan={columns.length}>
                No records yet
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={rowKey(r)} className={idx % 2 === 0 ? "bg-surface" : "bg-surface2/30"}>
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 whitespace-nowrap">
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

