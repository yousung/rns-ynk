export default function MiniBlocks({ blocks }) {
  return (
    <div className="mini-blocks">
      {blocks.map((cls, i) => (
        <div key={i} className={`mini-block ${cls}`} />
      ))}
    </div>
  );
}
