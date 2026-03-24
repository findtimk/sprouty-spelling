interface NavBarProps {
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

export default function NavBar({ onNavigate, currentScreen }: NavBarProps) {
  const items = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'shop', label: 'Shop', icon: '🛍️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-emerald-100 z-40">
      <div className="max-w-[500px] mx-auto flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(item => (
          <button
            key={item.id}
            onPointerDown={(e) => { e.preventDefault(); onNavigate(item.id); }}
            className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-xl transition-colors
              ${currentScreen === item.id
                ? 'text-emerald-600'
                : 'text-gray-400 active:text-emerald-500'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-bold font-display">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
