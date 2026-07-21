import { Link, useNavigate } from "react-router-dom";

interface SiteHeaderProps {
  showBack?: boolean;
}

export const SiteHeader = ({ showBack = false }: SiteHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/30 bg-gradient-surface/60 backdrop-blur-sm">
      <div className="container relative mx-auto flex items-center justify-center px-4 py-2.5">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Retour"
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground fluid-transition hover:bg-muted"
          >
            <svg
              width="18"
              height="18"
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
          </button>
        )}
        <Link to="/" aria-label="Pink South — accueil">
          <img
            src="/images/logo.png"
            alt="Pink South Burger - logo officiel"
            className="h-14 w-auto md:h-16"
            loading="lazy"
          />
        </Link>
      </div>
    </header>
  );
};
