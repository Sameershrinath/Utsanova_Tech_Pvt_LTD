const fs = require('fs');
const index = fs.readFileSync('index.html', 'utf8');
const headerMatch = index.match(/<header class="ic-navbar[\s\S]*?<\/header>/);
const dashboardOld = fs.readFileSync('dashboard.html', 'utf8');
const newDashboard = dashboardOld.replace(/<nav class="dash-nav">[\s\S]*?<\/nav>/, headerMatch[0]);
fs.writeFileSync('dashboard.html', newDashboard);
console.log("Done");
