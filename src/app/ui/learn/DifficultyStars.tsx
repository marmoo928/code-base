// Assuming Task type is imported or defined here if this is a standalone file,
// but since the prop is just a number, we can keep it simple.

interface DifficultyStarsProps {
  difficulty: number; // The number of filled stars (1 to 5)
}

export const DifficultyStars = ({ difficulty }: DifficultyStarsProps) => {
  const filled = difficulty;
  const total = 5; // Total possible stars

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`text-2xl ${
            i < filled ? "text-yellow-400" : "text-neutral-600"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};