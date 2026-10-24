import { fmt } from "@/lib/availability";

type Props = {
  label: string;
  value: number; // minutes after midnight
  onChange: (min: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  help?: string;
};

// Generates options for every minute from 0 to 1440 inclusive (1441 options).
const STEPS = Array.from({ length: 1441 }, (_, i) => i);

export function TimeSelect({ label, value, onChange, disabled, help }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
      >
        {STEPS.map((m) => (
          <option key={m} value={m}>
            {fmt(m)}
          </option>
        ))}
      </select>
      {help && <span className="text-xs text-slate-500">{help}</span>}
    </div>
  );
}
