import {
  Header,
  Hero,
  SocialProof,
  Problem,
  Features,
  SupportedIDEs,
  Screenshots,
  WaitlistCta,
  Faq,
  Footer,
} from '@/components/landing';

async function getWaitlistStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/waitlist`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    return { spotsClaimed: 219, spotsRemaining: 133 };
  }
}

export default async function Home() {
  const stats = await getWaitlistStats();

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      <Hero spotsClaimed={stats.spotsClaimed} />
      <SocialProof spotsClaimed={stats.spotsClaimed} />
      <Problem />
      <Features />
      <Screenshots />
      <SupportedIDEs />
      <WaitlistCta spotsClaimed={stats.spotsClaimed} />
      <Faq />
      <Footer />
    </main>
  );
}
