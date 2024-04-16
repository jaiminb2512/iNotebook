const express = require('express');
const { connectToMongoDB } = require('./db');
const authRoutes = require('./routes/auth'); 
const notesRoutes = require('./routes/notes'); 
var cors = require('cors')


connectToMongoDB();
const app = express();
const port = 5000;

app.use(cors())
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`);
});
