import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  ShoppingCart, 
  UtensilsCrossed, 
  Building2, 
  Scissors, 
  Heart, 
  Wrench, 
  Briefcase,
  Sparkles,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const businessCategories = [
  {
    id: "school",
    title: "Schools & Education",
    description: "Kindergartens, Primary & Secondary Schools",
    icon: GraduationCap,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "retail",
    title: "Retail & Shops",
    description: "Supermarkets, Boutiques, Hardware & More",
    icon: ShoppingCart,
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "restaurant",
    title: "Restaurants & Bars",
    description: "Restaurants, Cafes, Bars & Food Service",
    icon: UtensilsCrossed,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "hotel",
    title: "Hotels & Lodges",
    description: "Hotels, Lodges & Guest Houses",
    icon: Building2,
    gradient: "from-purple-500 to-violet-600",
  },
  {
    id: "salon",
    title: "Salons & Spas",
    description: "Beauty Salons, Spas & Barber Shops",
    icon: Scissors,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Pharmacies, Clinics & Hospitals",
    icon: Heart,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "repair",
    title: "Repair Services",
    description: "Garages, Phone Repair & Workshops",
    icon: Wrench,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "other",
    title: "Other Business",
    description: "Any other business type",
    icon: Briefcase,
    gradient: "from-slate-500 to-gray-600",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="font-bold text-lg">TennaHub</h1>
              <p className="text-xs text-muted-foreground">Powered by Kabejja Systems</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Made for Uganda
          </div>
        </div>

        {/* Hero Text */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight mb-2">
            Run Your Business
          </h2>
          <h2 className="text-4xl font-bold tracking-tight text-primary mb-4">
            Like a Pro
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select your business category to get started with powerful management tools
          </p>
        </div>

        {/* Business Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {businessCategories.map((category) => (
            <Link
              key={category.id}
              to={`/signup?type=${category.id}`}
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${category.gradient} p-6 text-white transition-all hover:scale-[1.02] hover:shadow-xl`}
            >
              <category.icon className="h-8 w-8 mb-4 opacity-90" />
              <h3 className="font-semibold text-lg mb-1">{category.title}</h3>
              <p className="text-sm text-white/80">{category.description}</p>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
