interface AdAreaProps {
  variant?: "default" | "banner";
  className?: string;
}

export default function AdArea({
  variant = "default",
  className = "",
}: AdAreaProps) {
  if (variant === "banner") {
    return (
      <div
        className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center ${className}`}
      >
        <p className="text-gray-400 font-semibold text-lg mb-2">
          Banner AD Area
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl border-2 border-dashed border-gray-300 p-24 text-center ${className}`}
    >
      <p className="text-gray-400 font-semibold text-lg mb-2">Video AD Area</p>
    </div>
  );
}
