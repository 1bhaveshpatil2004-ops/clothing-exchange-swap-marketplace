const fs = require('fs');

let dbCode = fs.readFileSync('db.js', 'utf8');
let backendCode = fs.readFileSync('backend.js', 'utf8');

// Clean up dbCode
dbCode = dbCode.replace("require('dotenv').config();", "");
dbCode = dbCode.replace("module.exports = { initDB, store };", "");

// Clean up backendCode
backendCode = backendCode.replace("const { initDB, store } = require('./db.js');", "");
backendCode = backendCode.replace("require('dotenv').config();", "");

// Combine
const combinedCode = `require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Bypass local ISP DNS blocking for MongoDB SRV records
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');

${dbCode}

${backendCode}`;

fs.writeFileSync('backend.js', combinedCode);
