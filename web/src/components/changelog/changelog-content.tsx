'use client';

import { Header, Footer } from '@/components/landing';
import { useSequentialReveal } from '@/hooks/use-gsap-reveal';

type Release = {
  version: string;
  date: string;
  title: string;
  added: string[];
  fixed: string[];
  changed: string[];
};

interface ChangelogContentProps {
  changelog: Release[];
}

export function ChangelogContent({ changelog }: ChangelogContentProps) {
  const pageRef = useSequentialReveal({ y: 26, itemDuration: 0.5, gap: 0.08 });
  const listRef = useSequentialReveal({ y: 14, itemDuration: 0.45, gap: 0.08, sequenceSelector: '[data-changelog-item]' });

  return (
    <main
      ref={pageRef}
      className="relative isolate min-h-screen overflow-hidden bg-linear-to-b from-[#03040a] via-[#04060c] to-[#010206]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(90,230,187,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(34,197,235,0.12),transparent_40%)]" />
      <div className="absolute inset-x-16 top-16 h-24 rounded-[32px] border border-white/5 bg-white/5 blur-3xl" />

      <div className="relative z-10">
        <Header />
        <section className="py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <div data-animate data-animate-order="1" className="text-center mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                Changelog
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-2">
                <span className="text-gradient">Release notes</span>
              </h1>
              <p className="text-xl text-muted-foreground">See what&apos;s new in DevSynq</p>
            </div>

            <div ref={listRef as React.RefObject<HTMLDivElement>} className="space-y-12">
              {changelog.map((release, index) => (
                <article
                  key={release.version}
                  data-changelog-item
                  data-animate
                  data-animate-order={index + 2}
                  className="relative pl-8 border-l-2 border-white/10"
                >
                  <div
                    className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-[#00d9ff] ring-4 ring-[#00d9ff]/20' : 'bg-[#333]'
                    }`}
                  />

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-2xl font-bold">v{release.version}</span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] text-xs rounded font-semibold">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-[#888]">{release.date}</p>
                    <h2 className="text-xl font-semibold mt-2">{release.title}</h2>
                  </div>

                  {release.added.length > 0 && (
                    <div className="mb-6">
                      <h3 className="flex items-center gap-2 text-[#00ff88] font-semibold mb-3">
                        <span>✨</span> Added
                      </h3>
                      <ul className="space-y-2">
                        {release.added.map((item, i) => (
                          <li key={i} className="text-[#ccc] flex items-start gap-2">
                            <span className="text-[#00ff88] mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {release.fixed.length > 0 && (
                    <div className="mb-6">
                      <h3 className="flex items-center gap-2 text-[#00d9ff] font-semibold mb-3">
                        <span>🐛</span> Fixed
                      </h3>
                      <ul className="space-y-2">
                        {release.fixed.map((item, i) => (
                          <li key={i} className="text-[#ccc] flex items-start gap-2">
                            <span className="text-[#00d9ff] mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {release.changed.length > 0 && (
                    <div className="mb-6">
                      <h3 className="flex items-center gap-2 text-[#ffd93d] font-semibold mb-3">
                        <span>🔄</span> Changed
                      </h3>
                      <ul className="space-y-2">
                        {release.changed.map((item, i) => (
                          <li key={i} className="text-[#ccc] flex items-start gap-2">
                            <span className="text-[#ffd93d] mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-16 text-center">
              <a
                href="https://github.com/HarjjotSinghh/devsynq/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00d9ff] hover:underline"
              >
                View full release history on GitHub →
              </a>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}

