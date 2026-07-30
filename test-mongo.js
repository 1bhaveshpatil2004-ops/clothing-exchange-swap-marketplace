const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google DNS

const mongoose = require('mongoose');
const uri = 'mongodb+srv://immortal:immortal@cluster07.vytwybx.mongodb.net/archive_fashion?appName=Cluster07&retryWrites=true&w=majority';

console.log('Testing connection with custom DNS...');
mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS! Connected to MongoDB Atlas.');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILED:', err.message);
    process.exit(1);
  });
