const express = require('express');
const { Sequelize } = require('sequelize');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Express 5.x inclut le parsing JSON nativement
app.use(express.json());

db.sequelize.sync().then(() => {
    console.log('✅ Database synchronized');
});

//define routes here
const patientRoutes = require('./routes/patient');
const practitionerRoutes = require('./routes/practitioner');
const appointmentRoutes = require('./routes/appointment');
const billRoutes = require('./routes/bill');

// Patient routes (exactement comme dans le YAML)
app.use('/api/patients', patientRoutes);  // GET /api/patients, PUT /api/patients/:id
app.use('/api/patient', patientRoutes);   // GET /api/patient/:id, DELETE /api/patient/:id

// Practitioner routes
app.use('/api/praticiens', practitionerRoutes);  // GET /api/praticiens, POST /api/praticiens
app.use('/api/praticien', practitionerRoutes);   // PUT /api/praticien/:id, DELETE /api/praticien/:id

// Appointment routes
app.use('/api/appointments', appointmentRoutes);

// Bill routes
app.use('/api/bills', billRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'DocteurLibre API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/patients');
    console.log('   GET  /api/praticiens');
    console.log('   GET  /api/appointments');
    console.log('   GET  /api/bills');
});