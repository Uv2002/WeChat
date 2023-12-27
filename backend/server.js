const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Create a connection to CouchDB
// Middleware to parse JSON requests
app.use(bodyParser.json());

// Import route files for different data tables
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const fileRoute = require("./routes/fileRoutes");
const channelRoutes = require('./routes/channelRoutes');
const authRoutes = require('./routes/authRoutes');

// Use the route files in the Express app
// app.use((req,res,next)=>{
//   console.log(req.baseUrl);
//   next();
// });

app.use('/api/static',express.static("./static"));
app.use('/api/files',fileRoute)
app.use('/api/users',userRoutes); // Example base path for user routes
app.use('/api/posts', postRoutes); // Example base path for post routes
app.use('/api/channels', channelRoutes); // Example base path for channel routes
app.use('/api/auth', authRoutes);
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
