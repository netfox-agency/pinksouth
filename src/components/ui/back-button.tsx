import { useNavigate } from "react-router-dom";

export const BackButton = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 rounded-lg border border-border/60 bg-card/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm fluid-transition hover:bg-muted ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      Retour
    </button>
  );
};
