import { Link, useLocation } from "react-router";
import { HomeIcon, UsersIcon, BellIcon, UserIcon } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/friends", icon: UsersIcon, label: "Friends" },
    { to: "/notifications", icon: BellIcon, label: "Alerts" },
    { to: "/profile", icon: UserIcon, label: "Profile" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 flex items-center justify-around h-16 z-30">
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = currentPath === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
              isActive ? "text-primary" : "text-base-content opacity-60"
            }`}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;