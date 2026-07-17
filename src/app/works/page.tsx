'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProjectCard } from '@/components/works/ProjectCard';
import { FilterBar } from '@/components/works/FilterBar';
import { ProjectModal } from '@/components/works/ProjectModal';
import { projects, allTags, categoryLabels, Project } from '@/data/projects';

function WorksContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter');
  const initialCat = searchParams.get('cat');

  const [activeMedium, setActiveMedium] = useState<string | null>(
    initialFilter === 'interactive' ? 'web' : null
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCat && initialCat in categoryLabels ? initialCat : null
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (project.easterEgg) return false; // 이스터에그용 — 일반 목록엔 노출 안 함
      if (activeCategory && project.category !== activeCategory) return false;
      if (activeMedium && project.medium !== activeMedium) return false;
      if (activeTag && !project.tags.includes(activeTag)) return false;
      return true;
    });
  }, [activeCategory, activeMedium, activeTag]);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12 pt-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-200 mb-4">
            Selected Works
          </h2>
          <p className="text-stone-500 font-medium max-w-xl">
            Projects across interactive experiences, video, and writing.
            Each explores themes of recursion, memory, and structural pathology.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar
            activeCategory={activeCategory}
            activeMedium={activeMedium}
            activeTag={activeTag}
            allTags={allTags}
            onCategoryChange={setActiveCategory}
            onMediumChange={setActiveMedium}
            onTagChange={setActiveTag}
          />
        </div>

        {/* Project grid */}
        <div className="grid gap-6 md:grid-cols-2 pb-24">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}

          {filteredProjects.length === 0 && (
            <p className="text-stone-600 text-sm col-span-2 text-center py-12">
              No projects match the current filters.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

export default function WorksPage() {
  return (
    <PageLayout title="Works">
      <Suspense fallback={
        <div className="flex items-center justify-center py-24">
          <div className="w-2 h-2 bg-stone-600 rounded-full animate-pulse" />
        </div>
      }>
        <WorksContent />
      </Suspense>
    </PageLayout>
  );
}
