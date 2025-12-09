import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    email: string;
    spotsRemaining?: number;
}

export const WelcomeEmail = ({
    email,
    spotsRemaining = 133,
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to DevSynq - You&apos;re in! 🎉</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Heading style={logo}>DevSynq</Heading>
                    </Section>

                    {/* Hero */}
                    <Section style={heroSection}>
                        <Heading style={heroHeading}>
                            You&apos;re on the list! 🎉
                        </Heading>
                        <Text style={heroSubtext}>
                            Welcome to the DevSynq waitlist. You&apos;re one of the first developers
                            to claim lifetime free access.
                        </Text>
                    </Section>

                    {/* Stats */}
                    <Section style={statsSection}>
                        <Text style={statsNumber}>{500 - spotsRemaining}/500</Text>
                        <Text style={statsLabel}>Lifetime spots claimed</Text>
                    </Section>

                    <Hr style={divider} />

                    {/* What's Next */}
                    <Section style={contentSection}>
                        <Heading style={sectionHeading}>What happens next?</Heading>
                        <Text style={paragraph}>
                            <strong style={accentText}>1. We&apos;re building fast</strong> — DevSynq v1.0
                            is launching soon with full MCP config sync across all your AI IDEs.
                        </Text>
                        <Text style={paragraph}>
                            <strong style={accentText}>2. You&apos;ll get early access</strong> — As a
                            waitlist member, you&apos;ll be the first to try new features before anyone else.
                        </Text>
                        <Text style={paragraph}>
                            <strong style={accentText}>3. Lifetime Pro is yours</strong> — Since you
                            signed up early, you&apos;ll get DevSynq Pro features forever. No catch.
                        </Text>
                    </Section>

                    <Hr style={divider} />

                    {/* Features Preview */}
                    <Section style={contentSection}>
                        <Heading style={sectionHeading}>What you&apos;ll get:</Heading>
                        <Text style={featureItem}>✓ One-click MCP sync to all IDEs</Text>
                        <Text style={featureItem}>✓ Secure API key management</Text>
                        <Text style={featureItem}>✓ Global command palette (launch anything instantly)</Text>
                        <Text style={featureItem}>✓ Process monitoring & management</Text>
                        <Text style={featureItem}>✓ Cloud backup & sync (Pro)</Text>
                        <Text style={featureItem}>✓ Lifetime updates</Text>
                    </Section>

                    {/* CTA */}
                    <Section style={ctaSection}>
                        <Link href="https://github.com/HarjjotSinghh/devsynq" style={ctaButton}>
                            ⭐ Star on GitHub
                        </Link>
                        <Text style={ctaSubtext}>
                            Help us reach more developers!
                        </Text>
                    </Section>

                    <Hr style={divider} />

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            You&apos;re receiving this because you signed up at{' '}
                            <Link href="https://devsynq.com" style={footerLink}>
                                devsynq.com
                            </Link>
                        </Text>
                        <Text style={footerText}>
                            Built with ❤️ for AI developers
                        </Text>
                        <Text style={footerLinks}>
                            <Link href="https://github.com/HarjjotSinghh/devsynq" style={footerLink}>
                                GitHub
                            </Link>
                            {' • '}
                            <Link href="https://twitter.com/devsynq" style={footerLink}>
                                Twitter
                            </Link>
                            {' • '}
                            <Link href="https://devsynq.com" style={footerLink}>
                                Website
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default WelcomeEmail;

// Styles
const main = {
    backgroundColor: '#0a0a0a',
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
    backgroundColor: '#0a0a0a',
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '600px',
};

const header = {
    padding: '20px 0',
    textAlign: 'center' as const,
};

const logo = {
    color: '#00d9ff',
    fontSize: '32px',
    fontWeight: '900',
    margin: '0',
    letterSpacing: '-0.5px',
};

const heroSection = {
    padding: '40px 0',
    textAlign: 'center' as const,
};

const heroHeading = {
    color: '#ffffff',
    fontSize: '36px',
    fontWeight: '900',
    lineHeight: '1.2',
    margin: '0 0 16px 0',
};

const heroSubtext = {
    color: '#888888',
    fontSize: '18px',
    lineHeight: '1.6',
    margin: '0',
};

const statsSection = {
    backgroundColor: '#141414',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center' as const,
    border: '1px solid rgba(255, 255, 255, 0.1)',
};

const statsNumber = {
    background: 'linear-gradient(135deg, #00d9ff, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '48px',
    fontWeight: '900',
    margin: '0 0 8px 0',
    color: '#00d9ff', // Fallback
};

const statsLabel = {
    color: '#888888',
    fontSize: '14px',
    margin: '0',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
};

const divider = {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    margin: '32px 0',
};

const contentSection = {
    padding: '0',
};

const sectionHeading = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 16px 0',
};

const paragraph = {
    color: '#cccccc',
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
};

const accentText = {
    color: '#00d9ff',
};

const featureItem = {
    color: '#cccccc',
    fontSize: '16px',
    lineHeight: '2',
    margin: '0',
};

const ctaSection = {
    textAlign: 'center' as const,
    padding: '24px 0',
};

const ctaButton = {
    backgroundColor: '#00d9ff',
    borderRadius: '8px',
    color: '#0a0a0a',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    padding: '14px 32px',
    textDecoration: 'none',
};

const ctaSubtext = {
    color: '#888888',
    fontSize: '14px',
    marginTop: '16px',
};

const footer = {
    textAlign: 'center' as const,
    padding: '24px 0',
};

const footerText = {
    color: '#666666',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0 0 8px 0',
};

const footerLinks = {
    color: '#666666',
    fontSize: '13px',
    margin: '16px 0 0 0',
};

const footerLink = {
    color: '#00d9ff',
    textDecoration: 'none',
};
