import { Navigate, useParams } from "react-router-dom";
import { BackButton } from "@/components/ui/back-button";
import { BurgerCard } from "@/components/ui/burger-card";
import { HelpButton } from "@/components/ui/help-button";
import { CartButton } from "@/components/ui/cart-button";
import { SiteFooter } from "@/components/ui/site-footer";
import { burgers, getClub } from "@/data/clubs";

const ClubMenu = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const club = getClub(clubId);

  if (!club) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen">
      <section className="relative h-[300px] overflow-hidden md:h-[420px]">
        <img
          src={club.image}
          alt={club.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
        <div className="absolute left-4 top-4 md:left-8 md:top-6">
          <BackButton />
        </div>
        <div className="absolute bottom-6 left-4 right-4 md:bottom-10 md:left-10">
          <h1 className="animate-scale-in font-display text-4xl text-foreground md:text-6xl">
            {club.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/85 md:text-lg">
            {club.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 pt-10 md:px-6 md:pt-14">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="animate-scale-in">
            <span className="paper-label paper-label--flip font-display px-6 py-3 text-2xl md:px-8 md:py-3.5 md:text-3xl">
              Choisissez votre burger
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            Des burgers artisanaux préparés avec des ingrédients premium,
            parfaits pour accompagner votre soirée en boîte.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {burgers.map((burger, index) => (
            <div
              key={burger.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BurgerCard burger={burger} clubId={club.id} />
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

export default ClubMenu;
