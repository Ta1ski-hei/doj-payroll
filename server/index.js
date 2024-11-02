require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { initializeWorkTypes } = require('./services/workTypeService');
const { fetchWorkLogs } = require('./services/discordService');

const app = express();

// Debug výpis pro kontrolu proměnných prostředí
console.log('Načtené proměnné prostředí:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? '***' : 'chybí');
console.log('DISCORD_CHANNEL_ID:', process.env.DISCORD_CHANNEL_ID || 'chybí');

app.use(cors());
app.use(express.json());

// Middleware pro logování všech požadavků
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Kontrola proměnných prostředí
if (!process.env.MONGODB_URI) {
  console.error('Chybí MONGODB_URI v .env souboru');
  process.exit(1);
}

// Připojení k MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Připojeno k MongoDB');
    initializeWorkTypes()
      .then(() => console.log('Typy práce inicializovány'))
      .catch(err => console.error('Chyba při inicializaci typů práce:', err));
  })
  .catch(err => console.error('Chyba připojení k MongoDB:', err));

// Základní route pro test
app.get('/', (req, res) => {
  res.json({ message: 'API běží' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API funguje!' });
});

// Endpoint pro work-logs
app.get('/api/work-logs', async (req, res) => {
  console.log('Přijat požadavek na /api/work-logs');
  try {
    const logs = await fetchWorkLogs(process.env.DISCORD_CHANNEL_ID);
    console.log(`Nalezeno ${logs.length} záznamů`);
    res.json(logs);
  } catch (error) {
    console.error('Chyba při načítání zpráv:', error);
    res.status(500).json({ 
      error: 'Chyba při načítání zpráv',
      details: error.message 
    });
  }
});

// Zachytávání 404 chyb
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Endpoint nenalezen' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});