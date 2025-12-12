// ui/learn/TaskListHeader.tsx
export const TaskListHeader = () => {
  return (
    <div
      className="bg-neutral-950 border border-neutral-800 rounded-2xl py-3 px-4 sm:px-8 mb-4"
    >
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:grid w-full items-center gap-6 text-neutral-400 font-semibold"
           style={{ gridTemplateColumns: '40px 280px 1fr 140px 140px 80px 120px' }}>
        <div>ID</div>
        <div>Name</div>
        <div>Categories</div>
        <div className="text-center">Status</div>
        <div className="text-center">Difficulty</div>
        <div className="text-center">XP</div>
        <div></div> {/* Empty column for Solve button */}
      </div>

      {/* Mobile Header - Hidden on desktop */}
      <div className="flex md:hidden items-center gap-4 text-neutral-400 font-semibold">
        <div className="flex-1">Task</div>
      </div>
    </div>
  );
};