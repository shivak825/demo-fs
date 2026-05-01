import { useEffect, useState } from 'react';

const defaultSocialLinks = [
  import { useState } from 'react';

  const socialLinks = [
    { label: 'CodeChef', href: 'https://www.codechef.com/users/shiva_kasoju_8', detail: 'Competitive programming profile' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/login', detail: 'Professional profile' },
    { label: 'GitHub', href: 'https://github.com/shivak825', detail: 'Code and projects' },
  ];

  const portfolio = {
    name: 'Hey, this is Shiva',
    subtitle: 'Competitive Programmer & Developer',
    bio: 'Welcome to my portfolio. Connect with me on CodeChef, LinkedIn, and GitHub.',
    email: 'shivakasoju60@gmail.com',
  };

  const skills = ['React', 'JavaScript', 'MySQL', 'Python'];

  const projects = [
    { title: 'Portfolio Website', description: 'Personal website with smooth scrolling sections and social links.' },
    { title: 'Frontend Demo', description: 'A small project showcasing responsive UI patterns.' },
  ];

  function App() {
    const [state] = useState({});
    return (
      <main className="app-container">
        <section className="home-section" id="home">
          <div className="hero-card">
            <h1>{portfolio.name}</h1>
            <p className="subtitle">{portfolio.subtitle}</p>
            <p className="bio">{portfolio.bio}</p>
          </div>
        </section>

        <section className="skills-section" id="skills">
          <h2>Skills</h2>
          <div className="skills-list">
            {skills.map((skill) => (
              <span key={skill} className="skill-chip">{skill}</span>
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
          <a className="email-link" href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
        </section>
      </main>
    );
  }

  export default App;
          fetch(`${apiBaseUrl}/api/skills`),
