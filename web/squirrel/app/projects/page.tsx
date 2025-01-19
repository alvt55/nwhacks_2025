'use client';
import { useState, useEffect } from 'react';

interface Project {
  id: number;
  name: string;
  keys: string[];
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        if (!token) {
          console.error('GitHub token is not available');
          return;
        }
        const res = await fetch('https://api.github.com/user/repos?per_page=100&page=1', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const repos = await res.json();
        const formattedRepos = repos.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          keys: [],
        }));
        setProjects(formattedRepos);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchRepos();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Projects</h2>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="p-3 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-center">
                <span className="text-gray-700">{project.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-8">
        {selectedProject ? (
          <div>
            <h1>{selectedProject.name}</h1>
          </div>
        ) : (
          <div>Select a project</div>
        )}
      </div>
    </div>
  );
}