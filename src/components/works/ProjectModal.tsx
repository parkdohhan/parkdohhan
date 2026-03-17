'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Project, mediumLabels } from '@/data/projects';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-stone-950/95"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-900 border-2 border-stone-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="mb-8">
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-stone-500">
                  {mediumLabels[project.medium]} · {project.year}
                </span>
                <h2 className="text-2xl md:text-3xl font-semibold text-stone-100 mt-2">
                  {project.title}
                </h2>
              </div>

              {/* Media */}
              {(() => {
                const pdfLink = project.links.find((l) => l.url.toLowerCase().endsWith('.pdf'));
                if (pdfLink) {
                  return (
                    <div className="mb-8 overflow-hidden relative bg-stone-800" style={{ aspectRatio: '210/297' }}>
                      <iframe
                        src={pdfLink.url}
                        title={project.title}
                        className="absolute inset-0 w-full h-full border-0"
                        style={{ pointerEvents: 'auto' }}
                      />
                    </div>
                  );
                }
                if (project.media) {
                  return (
                    <div className="aspect-video bg-stone-800 mb-8 overflow-hidden relative">
                      <Image
                        src={project.media}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 672px) 100vw, 672px"
                      />
                    </div>
                  );
                }
                return (
                  <div className="aspect-video bg-stone-800 mb-8 overflow-hidden relative">
                    <span className="absolute inset-0 flex items-center justify-center text-stone-600 text-sm">
                      [media placeholder]
                    </span>
                  </div>
                );
              })()}

              {/* Description */}
              <p className="text-stone-400 font-medium leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 border-2 border-stone-600 text-stone-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              {project.links.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-stone-700">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-stone-400 hover:text-stone-200 transition-colors px-4 py-2 border-2 border-stone-600 hover:border-stone-500"
                    >
                      {link.label}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
