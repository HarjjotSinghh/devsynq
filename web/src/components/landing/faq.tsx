'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
    {
        question: 'Is DevSynq really free?',
        answer:
            'Yes! DevSynq is open source and free forever. The first 500 signups get Pro features (cloud backup, team sharing) for life. No credit card required.',
    },
    {
        question: 'Which IDEs do you support?',
        answer:
            'We currently support Cursor, Windsurf, VS Code, Trae, Antigravity, Kiro, and Qoder. More IDEs like Zed, WebStorm, and Replit are coming soon. Request your favorite IDE on GitHub!',
    },
    {
        question: 'Will you steal my API keys?',
        answer:
            'Never. All keys are stored locally on your machine in encrypted storage. We never see them, and they never leave your device. DevSynq is open source—audit the code yourself on GitHub.',
    },
    {
        question: 'Does this work on Mac/Windows/Linux?',
        answer:
            'Yes! DevSynq works on all three operating systems. Download the appropriate version for your OS on the download page.',
    },
    {
        question: "What's MCP?",
        answer:
            'Model Context Protocol (MCP) is a standard that lets AI assistants access tools like your file system, git, databases, and more. It powers features in Cursor, Claude Desktop, and other AI tools. Learn more at modelcontextprotocol.io',
    },
    {
        question: 'Can I sync settings across computers?',
        answer:
            'Not yet, but cloud sync is coming soon as a Pro feature! For now, you can export and import your config manually. Waitlist members will get this feature for free.',
    },
];

export function Faq() {
    return (
        <section className="py-32 px-6" id="faq">
            <div className="max-w-3xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-[#00d9ff] font-semibold text-sm mb-4 uppercase tracking-wider">
                        FAQ
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Frequently Asked
                        <span className="block text-gradient">Questions</span>
                    </h2>
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="bg-[#141414] border border-white/10 rounded-xl px-6 data-[state=open]:border-[#00d9ff]/30"
                        >
                            <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[#888] text-base pb-6 leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* More questions */}
                <div className="mt-12 text-center">
                    <p className="text-[#888]">
                        Have more questions?{' '}
                        <a
                            href="https://github.com/HarjjotSinghh/devsynq/discussions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00d9ff] hover:underline"
                        >
                            Ask on GitHub Discussions →
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
