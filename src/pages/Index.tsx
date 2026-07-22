import { useNavigate } from "react-router-dom";
import { ClubCard } from "@/components/ui/club-card";
import { PalmDecor } from "@/components/ui/palm-decor";
import { HelpButton } from "@/components/ui/help-button";
import { CartButton } from "@/components/ui/cart-button";
import { SiteHeader } from "@/components/ui/site-header";
import { SiteFooter } from "@/components/ui/site-footer";
import { clubs } from "@/data/clubs";

const Index = () => {
  const navigate = useNavigate();

  const handleClubSelect = (clubId: string) => {
    navigate(`/club/${clubId}`);
  };

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <PalmDecor />

      <div id="clubs" className="container mx-auto px-4 pb-16 pt-8 md:px-6 md:pt-12">
        <div className="mb-12 text-center md:mb-16">
          <h1 className="animate-scale-in">
            <span className="paper-label font-display px-6 py-3 text-2xl md:px-8 md:py-4 md:text-4xl">
              Choisissez votre boîte de nuit
            </span>
          </h1>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 xl:grid-cols-4">
          {clubs.map((club, index) => (
            <div
              key={club.id}
              className={`${
                index % 2 === 0 ? "animate-slide-in-left" : "animate-slide-in-right"
              } fluid-transition`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <ClubCard
                id={club.id}
                name={club.name}
                description={club.description}
                image={club.image}
                onSelect={handleClubSelect}
              />
            </div>
          ))}
        </div>
      </div>

      <HelpButton />
      <CartButton />

      <SiteFooter />
    </div>
  );
};

export default Index;
