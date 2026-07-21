import { useNavigate } from "react-router-dom";
import { ClubCard } from "@/components/ui/club-card";
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
    <div className="min-h-screen">
      <SiteHeader />

      <div id="clubs" className="container mx-auto px-4 pb-16 pt-6 md:px-6 md:pt-8">
        <div className="mb-12 text-center md:mb-16">
          <h1 className="mb-6 animate-scale-in text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Choisissez votre boîte de nuit
          </h1>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
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
