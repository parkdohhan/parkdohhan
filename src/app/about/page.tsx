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
              Fiction writer and interactive media artist, based in Seoul.
            </p>
            <p>
              I began as a fiction writer and have written stories since 2021.
              Writing them left me with questions about narrative itself: what a
              scene is, what its order does, and how a story changes once other
              people retell it.
            </p>
            <p>
              In late 2025 I moved those questions into research: an interactive
              system in which a memory changes as visitors walk through it, a
              theory of narrative variants, and experiments on real play records
              that borrow tools from topology. From that research I have begun
              to build devices for other people — a way for anyone to leave a
              memory in the work, and a writing tool for people learning fiction.
            </p>
            <p>
              I earn my living making films, photographs, multilingual websites
              and brand strategy for manufacturers.
            </p>
            <p>
              How I work: writing fiction, shooting, editing and creative
              decisions are done by hand. Software is built with AI coding
              agents — I write the concept, the specification and the acceptance
              criteria, review the result on screen, and take responsibility for
              what ships.
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
              href="https://github.com/parkdohhan"
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
              'Short fiction',
              'Screenplay',
              'Sony FX3 / α7 V',
              'Premiere Pro',
              'Lightroom',
              'Photoshop',
              'Figma',
              'Claude Code',
              'Next.js',
              'Astro',
              'Three.js / R3F',
              'Supabase',
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
            The home is a 3D room made with three.js and React Three Fiber:
            three standing pictures that answer in their own voices, and a
            fourth figure behind you. The older 2D map lives on at /map.
            No tracking, no cookies.
            <br /><br />
            The loop count on the map persists across sessions. Each return leaves a scar.
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
}
