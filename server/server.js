const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    }
}

// Routes
app.get('/', (req, res) => {
  res.send('Scientific Experiment Manager API');
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// User Management (Admin Only)
app.get('/api/users', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true }
    });
    res.json(users);
});

app.post('/api/users', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name, role }
        });
        res.json(newUser);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete('/api/users/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: "User deleted" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.get('/api/stats', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
    const count = await prisma.experiment.count();
    res.json({ totalExperiments: count });
});

// Experiment Routes (Researcher Only)
// Get my experiments
app.get('/api/experiments', authenticateToken, authorizeRole('RESEARCHER'), async (req, res) => {
    const experiments = await prisma.experiment.findMany({
        where: { authorId: req.user.id },
        orderBy: { createdAt: 'desc' }
    });
    res.json(experiments);
});

// Get single experiment (ensure ownership)
app.get('/api/experiments/:id', authenticateToken, authorizeRole('RESEARCHER'), async (req, res) => {
    const { id } = req.params;
    const experiment = await prisma.experiment.findUnique({
        where: { id: parseInt(id) }
    });
    if (!experiment || experiment.authorId !== req.user.id) {
        return res.status(404).json({ message: "Experiment not found" });
    }
    res.json(experiment);
});

app.post('/api/experiments', authenticateToken, authorizeRole('RESEARCHER'), async (req, res) => {
    const { title, description, category } = req.body;
    try {
        const experiment = await prisma.experiment.create({
            data: {
                title,
                description,
                category,
                authorId: req.user.id
            }
        });
        res.json(experiment);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.put('/api/experiments/:id', authenticateToken, authorizeRole('RESEARCHER'), async (req, res) => {
    const { id } = req.params;
    const { title, description, category } = req.body;
    
    // Check ownership
    const existing = await prisma.experiment.findUnique({ where: { id: parseInt(id) }});
    if (!existing || existing.authorId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const updated = await prisma.experiment.update({
            where: { id: parseInt(id) },
            data: { title, description, category }
        });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete('/api/experiments/:id', authenticateToken, authorizeRole('RESEARCHER'), async (req, res) => {
    const { id } = req.params;
     // Check ownership
     const existing = await prisma.experiment.findUnique({ where: { id: parseInt(id) }});
     if (!existing || existing.authorId !== req.user.id) {
         return res.status(403).json({ message: "Forbidden" });
     }

    try {
        await prisma.experiment.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Experiment deleted" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
