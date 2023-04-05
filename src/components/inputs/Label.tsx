export type LabelProps = { label: string; id: string };

export const Label = ({ label, id }: LabelProps) => (
  <label className="text-lg" htmlFor={id}>
    <p className="">{label}</p>
  </label>
);
