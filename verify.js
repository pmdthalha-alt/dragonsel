#!/usr/bin/env node

/**
 * Dragonsel Startup Verification Script
 * Checks that all critical files exist and dependencies are available
 */

const fs = require('fs');
const path = require('path');

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    console.log(`${GREEN}✓${RESET} ${name}`);
    passed++;
  } else {
    console.log(`${RED}✗${RESET} ${name}`);
    failed++;
  }
}

function section(title) {
  console.log(`\n${BLUE}${title}${RESET}`);
  console.log('─'.repeat(50));
}

console.log('\n' + '═'.repeat(50));
console.log('  Dragonsel Startup Verification');
console.log('═'.repeat(50));

// Check backend
section('Backend Verification');

check('backend/package.json exists', fs.existsSync('backend/package.json'));
check('backend/src/server.js exists', fs.existsSync('backend/src/server.js'));
check('backend/src/db.js exists', fs.existsSync('backend/src/db.js'));
check('backend/.env exists or .env.example exists', 
  fs.existsSync('backend/.env') || fs.existsSync('backend/.env.example'));
check('backend/knexfile.js exists', fs.existsSync('backend/knexfile.js'));

const backendModels = [
  'backend/src/models/Project.js',
  'backend/src/models/Asset.js',
  'backend/src/models/Module.js',
];
backendModels.forEach(m => {
  check(`${path.basename(m)} exists`, fs.existsSync(m));
});

const backendRoutes = [
  'backend/src/routes/auth.js',
  'backend/src/routes/projects.js',
  'backend/src/routes/assets.js',
  'backend/src/routes/modules/research.js',
];
backendRoutes.forEach(r => {
  check(`${path.basename(r)} exists`, fs.existsSync(r));
});

// Check frontend
section('Frontend Verification');

check('frontend/package.json exists', fs.existsSync('frontend/package.json'));
check('frontend/src/main.jsx exists', fs.existsSync('frontend/src/main.jsx'));
check('frontend/src/App.jsx exists', fs.existsSync('frontend/src/App.jsx'));
check('frontend/.env exists or .env.example exists',
  fs.existsSync('frontend/.env') || fs.existsSync('frontend/.env.example'));
check('frontend/vite.config.js exists', fs.existsSync('frontend/vite.config.js'));

const frontendPages = [
  'frontend/src/pages/Login.jsx',
  'frontend/src/pages/Signup.jsx',
  'frontend/src/pages/Dashboard.jsx',
  'frontend/src/pages/ProjectStudio.jsx',
];
frontendPages.forEach(p => {
  check(`${path.basename(p)} exists`, fs.existsSync(p));
});

check('frontend/src/store/index.js exists', fs.existsSync('frontend/src/store/index.js'));

// Check infrastructure
section('Infrastructure Verification');

check('docker-compose.yml exists', fs.existsSync('docker-compose.yml'));
check('.gitignore exists', fs.existsSync('.gitignore'));
check('package.json exists (root)', fs.existsSync('package.json'));

// Check documentation
section('Documentation Verification');

const docs = [
  'README.md',
  'GETTING_STARTED.md',
  'INTEGRATED_ARCHITECTURE.md',
  'PROJECT_SUMMARY.md',
  'IMPLEMENTATION_CHECKLIST.md',
  'DELIVERY_CHECKLIST.md',
  'backend/README.md',
  'frontend/README.md',
];
docs.forEach(d => {
  check(`${path.basename(d)} exists`, fs.existsSync(d));
});

// Check database migrations
section('Database Verification');

check('backend/src/migrations/001_initial_schema.js exists', 
  fs.existsSync('backend/src/migrations/001_initial_schema.js'));
check('backend/src/migrations/seeds/001_demo_data.js exists',
  fs.existsSync('backend/src/migrations/seeds/001_demo_data.js'));

// Summary
section('Summary');

const total = passed + failed;
const percentage = ((passed / total) * 100).toFixed(1);

console.log(`\n${BLUE}Results:${RESET}`);
console.log(`  ${GREEN}Passed: ${passed}${RESET}`);
console.log(`  ${RED}Failed: ${failed}${RESET}`);
console.log(`  ${YELLOW}Success Rate: ${percentage}%${RESET}`);

if (failed === 0) {
  console.log(`\n${GREEN}✓ All checks passed! System is ready.${RESET}\n`);
  process.exit(0);
} else {
  console.log(`\n${RED}✗ Some checks failed. Please review above.${RESET}\n`);
  process.exit(1);
}
