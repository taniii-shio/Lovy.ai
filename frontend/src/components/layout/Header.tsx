import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="bg-white shadow-sm px-6 py-5 flex items-center gap-4">
      <img
        src="/logo.svg"
        alt="Lovy.ai Logo"
        className="w-8 h-8 cursor-pointer"
        onClick={handleLogoClick}
      />
      <img
        src="/typo.svg"
        alt="Lovy.ai"
        className="h-7 cursor-pointer"
        onClick={handleLogoClick}
      />
    </div>
  );
}
