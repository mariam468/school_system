export default function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-ink/70 mb-1">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring text-sm ${props.className || ""}`}
    />
  );
}

export function SelectInput({ children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring text-sm bg-white ${props.className || ""}`}
    >
      {children}
    </select>
  );
}
