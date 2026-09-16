export default function StatCard({ label, value, accent = "brand" }) {
  const accents = {
    brand: "bg-brand-50 text-brand-700",
    clay: "bg-orange-50 text-clay",
    gold: "bg-yellow-50 text-gold",
  };

  return (
    <div className="bg-white rounded-card shadow-soft p-5 flex-1 min-w-[180px]">
      <p className="text-sm text-ink/60 mb-2">{label}</p>
      <p className={`inline-flex px-2 py-0.5 rounded-md text-3xl font-bold font-display ${accents[accent] || accents.brand}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}
