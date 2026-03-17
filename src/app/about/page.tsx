'use client';

import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { Mail, Github, Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageLayout title="About">
      <div className="max-w-2xl mx-auto px-6">
        {/* Bio section */}
        <motion.div
          className="pt-8 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar placeholder */}
          <div className="w-24 h-24 rounded-full border-2 border-stone-600 bg-stone-900 mx-auto mb-8 flex items-center justify-center">
            <span className="text-stone-500 text-2xl font-medium">◯</span>
          </div>

          <h2 className="text-2xl font-semibold text-stone-200 text-center mb-6">
            Dohhan Park / 박도한
          </h2>

          <div className="space-y-4 text-stone-400 text-sm leading-relaxed text-center">
            <p>
              Designer, developer, and filmmaker working at the intersection of
              narrative and interaction.
            </p>
            <p>
              My work explores recursive structures, memory systems, and the
              pathology of choice—how we return to what hurts us, and why.
            </p>
            <p>
              Each project is an attempt to make the structure itself carry
              meaning, not just the content within it.
            </p>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="border-t-2 border-stone-700 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500 text-center mb-8">
            Contact
          </h3>

          <div className="flex justify-center gap-8">
            <a
              href="mailto:dohhan92947@gmail.com"
              className="flex items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
            <a
              href="https://github.com/dohhan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://instagram.com/dohhan_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-stone-500 hover:text-stone-300 transition-colors text-sm"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </motion.div>

        {/* Tools/Tech */}
        <motion.div
          className="border-t-2 border-stone-700 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500 text-center mb-8">
            Tools & Methods
          </h3>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              'TypeScript',
              'React',
              'Next.js',
              'Three.js',
              'Framer Motion',
              'Premiere Pro',
              'After Effects',
              'Figma',
            ].map((tool) => (
              <span
                key={tool}
                className="text-[10px] font-medium tracking-wider uppercase px-3 py-1.5 border-2 border-stone-600 text-stone-500"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Colophon */}
        <motion.div
          className="border-t-2 border-stone-700 py-12 pb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500 text-center mb-8">
            Colophon
          </h3>

          <p className="text-stone-600 text-xs text-center leading-relaxed max-w-md mx-auto">
            This site is built with Next.js, TypeScript, and Tailwind CSS.
            The 2D map navigation is rendered with DOM elements and Framer Motion.
            Typography is system fonts. No tracking, no cookies.
            <br /><br />
            The loop count persists across sessions. Each return leaves a scar.
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
}
