import { useEffect, useState } from 'react';

const defaultSocialLinks = [
  {
    label: 'CodeChef',
    href: 'https://www.codechef.com/users/shiva_kasoju_8',
    detail: 'Competitive programming profile',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/login',
    detail: 'Professional profile',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/shivak825',
    detail: 'Code and projects',
  },
];

const defaultPortfolio = {
  name: 'Shiva K',
  subtitle: 'Competitive Programmer & Developer',
  bio: 'Welcome to my portfolio. Connect with me on CodeChef, LinkedIn, and GitHub.',
  email: 'shivakasoju60@gmail.com',
};

const defaultSkills = ['React', 'JavaScript', 'MySQL', 'Python'];

const defaultProjects = [
  {
    title: 'Portfolio Website',
    description: 'Personal website with smooth scrolling sections and social links.',
  },
  {
    title: 'MySQL Content Backend',
    description: 'Stores profile details and serves portfolio content through APIs.',
  },
];

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [portfolio, setPortfolio] = useState(defaultPortfolio);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [skills, setSkills] = useState(defaultSkills);
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/portfolio`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setPortfolio({
          name: data.name || defaultPortfolio.name,
          subtitle: data.subtitle || defaultPortfolio.subtitle,
          bio: data.bio || defaultPortfolio.bio,
          email: data.email || defaultPortfolio.email,
        });
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
      }
    };

    loadPortfolio();
  }, []);

  useEffect(() => {
    const loadSkillsAndProjects = async () => {
      try {
        const [skillsResponse, projectsResponse, socialLinksResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/api/skills`),
          fetch(`${apiBaseUrl}/api/projects`),
          fetch(`${apiBaseUrl}/api/social-links`),
        ]);

        if (skillsResponse.ok) {
          const skillRows = await skillsResponse.json();
          if (Array.isArray(skillRows) && skillRows.length > 0) {
            const normalizedSkills = skillRows
              .map((item) => item.skill_name)
              .filter(Boolean)
              .filter((skill) => skill.toLowerCase() !== 'node.js' && skill.toLowerCase() !== 'nodejs');

            if (!normalizedSkills.some((skill) => skill.toLowerCase() === 'python')) {
              normalizedSkills.push('Python');
            }

            setSkills(normalizedSkills);
          }
        }

        if (projectsResponse.ok) {
          const projectRows = await projectsResponse.json();
          if (Array.isArray(projectRows) && projectRows.length > 0) {
            setProjects(
              projectRows.map((item) => ({
                title: item.title,
                description: item.description || 'Project details coming soon.',
              }))
            );
          }
        }

        if (socialLinksResponse.ok) {
          const socialRows = await socialLinksResponse.json();
          if (Array.isArray(socialRows) && socialRows.length > 0) {
            setSocialLinks(
              socialRows.map((item) => ({
                label: item.label,
                href: item.href,
                detail: item.detail || '',
              }))
            );
          }
        }
      } catch (error) {
        console.error('Failed to load skills/projects:', error);
      }
    };

    loadSkillsAndProjects();
  }, []);

  return (
    <main className="app-container">
      <section className="home-section" id="home">
        <div className="hero-card">
          <h1>Hey, this is Shiva</h1>
          <p className="subtitle">{portfolio.subtitle}</p>
          <p className="bio">{portfolio.bio}</p>
        </div>
      </section>

      <section className="skills-section" id="skills">
        <h2>Skills</h2>
        <div className="skills-list">
          {skills.map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="projects-section" id="projects">
        <h2>Projects</h2>
        <div className="project-list">
          {projects.map((project) => (
            <article key={project.title} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="links-section" id="links">
        <h2>Find Me</h2>
        <div className="links-container">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="link-card">
              <span className="link-title">{link.label}</span>
              <span className="link-desc">{link.detail}</span>
            </a>
          ))}
        </div>
        <a className="email-link" href={`mailto:${portfolio.email}`}>
          {portfolio.email}
        </a>
      </section>
    </main>
  );
}

export default App;
