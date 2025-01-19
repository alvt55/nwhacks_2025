'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Project {
  id: number;
  name: string;
  keys: string[];
}

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        if (!token) {
          throw new Error('GitHub token is not available');
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
          keys: [], // Initialize with empty keys array
        }));
        setProjects(formattedRepos);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
    {/* Logo in top right */}
    <div className="absolute top right-4">
      <Image
        src="/images/nwlogo.png"
        alt="Logo"
        width={100}  // Adjust size as needed
        height={100} // Adjust size as needed
        className="object-contain"
      />
    </div>

      {/* Left Sidebar - Project List */}
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
                <svg className="w-5 h-5 mr-2" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                </svg>
                <span className="text-gray-700">{project.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Content Area - Key Management */}
      <div className="flex-1 p-8">
        {selectedProject ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-700">{selectedProject.name}</h1>
            
            {/* Keys Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Secret Keys</h2>
              <div className="space-y-4">
                {selectedProject.keys.map((key, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="flex-1 p-2 border rounded"
                    />
                    <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                ))}
                <button className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                  Add New Key
                </button>
              </div>
            </div>

            {/* Collaborators Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Collaborators</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-gray-700">
                  <input
                    type="email"
                    placeholder="Add collaborator email"
                    className="flex-1 p-2 border rounded"
                  />
                  <button className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                    Add
                  </button>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between p-2 bg-gray-50 rounded ">
                    <span>collaborator@example.com</span>
                    <button className="px-3 py-1 text-sm text-red-500 hover:text-red-600">
                      Remove
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a project to view details
          </div>
        )}
      </div>
    </div>
  );
}