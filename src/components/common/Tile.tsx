// Common Tile component for reuse
export default function Tile({ children }: { children: React.ReactNode }) {
  return <div className="tile">{children}</div>;
}
