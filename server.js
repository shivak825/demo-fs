import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'portfolio_db';

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
    description: 'Personal website with modern sections and social links.',
    link: '',
  },
  {
    title: 'SQL Content Backend',
    description: 'Stores portfolio content and serves it via API endpoints.',
    link: '',
  },
];

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

const pool = mysql.createPool({
  ...dbConfig,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const ensureDatabaseExists = async () => {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.end();
};

// Initialize database
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Create portfolio table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        bio TEXT,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute('ALTER TABLE portfolio ADD COLUMN email VARCHAR(255) NULL').catch((error) => {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    });

    // Create skills table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        skill_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS social_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        href VARCHAR(255) NOT NULL,
        detail VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [portfolioRows] = await connection.execute('SELECT id FROM portfolio LIMIT 1');
    if (portfolioRows.length === 0) {
      await connection.execute(
        'INSERT INTO portfolio (name, subtitle, bio, email) VALUES (?, ?, ?, ?)',
        [defaultPortfolio.name, defaultPortfolio.subtitle, defaultPortfolio.bio, defaultPortfolio.email]
      );
    } else {
      await connection.execute('UPDATE portfolio SET email = COALESCE(email, ?) WHERE id = ?', [
        defaultPortfolio.email,
        portfolioRows[0].id,
      ]);
    }

    const [skillsRows] = await connection.execute('SELECT id FROM skills LIMIT 1');
    if (skillsRows.length === 0) {
      for (const skill of defaultSkills) {
        await connection.execute('INSERT INTO skills (skill_name) VALUES (?)', [skill]);
      }
    }

    const [projectsRows] = await connection.execute('SELECT id FROM projects LIMIT 1');
    if (projectsRows.length === 0) {
      for (const project of defaultProjects) {
        await connection.execute('INSERT INTO projects (title, description, link) VALUES (?, ?, ?)', [
          project.title,
          project.description,
          project.link,
        ]);
      }
    }

    const [socialRows] = await connection.execute('SELECT id FROM social_links LIMIT 1');
    if (socialRows.length === 0) {
      for (const item of defaultSocialLinks) {
        await connection.execute('INSERT INTO social_links (label, href, detail) VALUES (?, ?, ?)', [
          item.label,
          item.href,
          item.detail,
        ]);
      }
    } else {
      await connection.execute(
        'UPDATE social_links SET href = ? WHERE label = ?',
        ['https://github.com/shivak825', 'GitHub']
      );
    }

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Get portfolio info
app.get('/api/portfolio', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM portfolio LIMIT 1');
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update portfolio info
app.post('/api/portfolio', async (req, res) => {
  const { name, subtitle, bio, email } = req.body;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM portfolio LIMIT 1');

    if (rows.length === 0) {
      await connection.execute(
        'INSERT INTO portfolio (name, subtitle, bio, email) VALUES (?, ?, ?, ?)',
        [name, subtitle, bio, email]
      );
    } else {
      await connection.execute(
        'UPDATE portfolio SET name = ?, subtitle = ?, bio = ?, email = ? WHERE id = ?',
        [name, subtitle, bio, email, rows[0].id]
      );
    }

    connection.release();
    res.json({ message: 'Portfolio updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all skills
app.get('/api/skills', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM skills');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add skill
app.post('/api/skills', async (req, res) => {
  const { skill_name } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.execute('INSERT INTO skills (skill_name) VALUES (?)', [skill_name]);
    connection.release();
    res.json({ message: 'Skill added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM projects ORDER BY id ASC');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all social links
app.get('/api/social-links', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM social_links ORDER BY id ASC');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add project
app.post('/api/projects', async (req, res) => {
  const { title, description, link } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO projects (title, description, link) VALUES (?, ?, ?)',
      [title, description, link]
    );
    connection.release();
    res.json({ message: 'Project added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

ensureDatabaseExists().then(initDatabase).catch((error) => {
  console.error('Database setup error:', error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
