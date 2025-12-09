'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SectionRevealOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  staggerSelector?: string;
  once?: boolean;
};

type SequentialOptions = SectionRevealOptions & {
  sequenceSelector?: string;
  orderAttribute?: string;
  itemY?: number;
  itemDuration?: number;
  gap?: number;
};

function registerScrollTrigger() {
  if (typeof window === 'undefined') return;
  const isRegistered = Boolean((gsap as unknown as { plugins?: Record<string, unknown> }).plugins?.ScrollTrigger);
  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
  }
}

export function useSectionReveal(options?: SectionRevealOptions) {
  const ref = useRef<HTMLElement | null>(null);
  const {
    y = 24,
    duration = 0.65,
    delay = 0,
    ease = 'power2.out',
    stagger,
    staggerSelector,
    once = true,
  } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerScrollTrigger();

    const ctx = gsap.context(() => {
      const targets =
        staggerSelector && el
          ? gsap.utils.toArray<HTMLElement>(staggerSelector, el)
          : el;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          duration: Math.min(duration, 1),
          ease,
          stagger: staggerSelector ? stagger ?? 0.08 : undefined,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, duration, delay, ease, stagger, staggerSelector, once]);

  return ref;
}

export function useSequentialReveal(options?: SequentialOptions) {
  const ref = useRef<HTMLElement | null>(null);
  const {
    y = 24,
    duration = 0.6,
    delay = 0,
    ease = 'power2.out',
    stagger,
    staggerSelector,
    once = true,
    sequenceSelector = '[data-animate]',
    orderAttribute = 'animateOrder',
    itemY = 18,
    itemDuration = 0.45,
    gap = 0.08,
  } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerScrollTrigger();

    const ctx = gsap.context(() => {
      const rawTargets = staggerSelector
        ? gsap.utils.toArray<HTMLElement>(staggerSelector, el)
        : gsap.utils.toArray<HTMLElement>(sequenceSelector, el);

      const targets = rawTargets
        .sort((a, b) => {
          const aOrder = Number((a.dataset as Record<string, string | undefined>)[orderAttribute] ?? Number.MAX_SAFE_INTEGER);
          const bOrder = Number((b.dataset as Record<string, string | undefined>)[orderAttribute] ?? Number.MAX_SAFE_INTEGER);
          return aOrder - bOrder;
        });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once,
        },
        delay,
      });

      tl.from(el, {
        autoAlpha: 0,
        y,
        duration: Math.min(duration, 1),
        ease,
      });

      if (targets.length) {
        tl.from(
          targets,
          {
            autoAlpha: 0,
            y: itemY,
            duration: Math.min(itemDuration, 1),
            ease,
            stagger: gap,
          },
          '-=40%'
        );
      }
    }, el);

    return () => ctx.revert();
  }, [y, duration, delay, ease, staggerSelector, once, sequenceSelector, orderAttribute, itemY, itemDuration, gap]);

  return ref;
}

