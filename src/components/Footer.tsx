import { siteConfig, socials } from "@/data/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="fixed inset-x-0 bottom-0 z-50 border-t px-3 py-2 backdrop-blur-md sm:px-0"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "color-mix(in oklab, var(--background) 50%, transparent)",
      }}
    >
      <div className="section">
        <div className="flex min-h-9 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-xs text-(--muted) sm:text-sm">
            <span className="shrink-0 text-sm font-bold text-(--foreground) sm:text-base">
              <span className="gradient-text">RD</span>
            </span>
            <span className="shrink-0">•</span>
            <span className="truncate">
              © {year} {siteConfig.name}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--muted) transition-colors duration-200 hover:scale-110 hover:text-(--accent)"
                aria-label={social.name}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
