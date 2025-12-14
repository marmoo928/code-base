
interface DifficultyStarsProps {
  difficulty: number; 
}

export const DifficultyStars = ({ difficulty }: DifficultyStarsProps) => {
  const filled = difficulty;
  const total = 5; 

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