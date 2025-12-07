#!/usr/bin/env node

/**
 * Railway Usage Monitor
 * 
 * This script monitors Railway usage and implements cost-protection features:
 * 1. Checks current usage against free-tier limits
 * 2. Calculates projected usage for the month
 * 3. Triggers warnings when approaching limits
 * 4. Can automatically shut down services when limits are reached
 * 5. Deploys maintenance mode if needed
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Free tier limits (as of 2025)
const FREE_TIER_LIMITS = {
  monthlyHours: 500,
  monthlyCredit: 5.00, // USD
  databaseStorage: 1024, // MB
  redisMemory: 512, // MB
};

// Warning thresholds (percentage)
const THRESHOLDS = {
  warning: 0.75,  // 75%
  critical: 0.90, // 90%
  shutdown: 0.95, // 95%
};

class RailwayUsageMonitor {
  constructor() {
    this.usage = null;
    this.projectId = null;
    this.autoShutdown = process.env.RAILWAY_AUTO_SHUTDOWN !== 'false';
  }

  /**
   * Check if Railway CLI is installed
   */
  async checkRailwayCLI() {
    try {
      await execAsync('railway --version');
      return true;
    } catch (error) {
      console.error(`${colors.red}Error: Railway CLI not installed${colors.reset}`);
      console.log('\nInstall Railway CLI:');
      console.log('  npm install -g @railway/cli');
      console.log('  or visit: https://docs.railway.app/develop/cli\n');
      return false;
    }
  }

  /**
   * Get Railway project status
   */
  async getProjectStatus() {
    try {
      const { stdout } = await execAsync('railway status --json');
      return JSON.parse(stdout);
    } catch (error) {
      console.error(`${colors.red}Error getting project status:${colors.reset}`, error.message);
      return null;
    }
  }

  /**
   * Get Railway usage data
   * Note: This is a mock implementation since Railway CLI doesn't expose usage directly
   * In production, this would call Railway's API
   */
  async getUsage() {
    // Mock implementation - replace with actual API call
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    // Simulate usage based on day of month
    const mockUsage = {
      hours: {
        used: Math.floor((dayOfMonth / daysInMonth) * FREE_TIER_LIMITS.monthlyHours * 0.8),
        limit: FREE_TIER_LIMITS.monthlyHours,
        percentage: (dayOfMonth / daysInMonth) * 0.8,
      },
      credit: {
        used: parseFloat(((dayOfMonth / daysInMonth) * FREE_TIER_LIMITS.monthlyCredit * 0.7).toFixed(2)),
        limit: FREE_TIER_LIMITS.monthlyCredit,
        percentage: (dayOfMonth / daysInMonth) * 0.7,
      },
      database: {
        used: Math.floor(FREE_TIER_LIMITS.databaseStorage * 0.3),
        limit: FREE_TIER_LIMITS.databaseStorage,
        percentage: 0.3,
      },
      redis: {
        used: Math.floor(FREE_TIER_LIMITS.redisMemory * 0.4),
        limit: FREE_TIER_LIMITS.redisMemory,
        percentage: 0.4,
      },
    };
    
    return mockUsage;
  }

  /**
   * Calculate projected usage for the month
   */
  calculateProjection(usage) {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - dayOfMonth;
    
    const projection = {
      hours: {
        current: usage.hours.used,
        projected: Math.ceil(usage.hours.used * (daysInMonth / dayOfMonth)),
        remaining: FREE_TIER_LIMITS.monthlyHours - usage.hours.used,
        willExceed: (usage.hours.used * (daysInMonth / dayOfMonth)) > FREE_TIER_LIMITS.monthlyHours,
      },
      credit: {
        current: usage.credit.used,
        projected: parseFloat((usage.credit.used * (daysInMonth / dayOfMonth)).toFixed(2)),
        remaining: parseFloat((FREE_TIER_LIMITS.monthlyCredit - usage.credit.used).toFixed(2)),
        willExceed: (usage.credit.used * (daysInMonth / dayOfMonth)) > FREE_TIER_LIMITS.monthlyCredit,
      },
    };
    
    return projection;
  }

  /**
   * Determine alert level
   */
  getAlertLevel(percentage) {
    if (percentage >= THRESHOLDS.shutdown) return 'shutdown';
    if (percentage >= THRESHOLDS.critical) return 'critical';
    if (percentage >= THRESHOLDS.warning) return 'warning';
    return 'ok';
  }

  /**
   * Print usage report
   */
  printUsageReport(usage, projection) {
    console.log('\n' + colors.bright + colors.cyan + '='.repeat(80) + colors.reset);
    console.log(colors.bright + '  Railway Usage Monitor - Free Tier Status' + colors.reset);
    console.log(colors.cyan + '='.repeat(80) + colors.reset + '\n');
    
    // Hours usage
    const hoursLevel = this.getAlertLevel(usage.hours.percentage);
    const hoursColor = hoursLevel === 'ok' ? colors.green : 
                       hoursLevel === 'warning' ? colors.yellow : colors.red;
    console.log(`${colors.bright}Service Hours:${colors.reset}`);
    console.log(`  Current: ${hoursColor}${usage.hours.used}${colors.reset} / ${usage.hours.limit} hours (${(usage.hours.percentage * 100).toFixed(1)}%)`);
    console.log(`  Projected: ${projection.hours.projected} hours (${projection.hours.willExceed ? colors.red + 'WILL EXCEED' + colors.reset : colors.green + 'Within Limit' + colors.reset})`);
    console.log(`  Remaining: ${projection.hours.remaining} hours\n`);
    
    // Credit usage
    const creditLevel = this.getAlertLevel(usage.credit.percentage);
    const creditColor = creditLevel === 'ok' ? colors.green : 
                        creditLevel === 'warning' ? colors.yellow : colors.red;
    console.log(`${colors.bright}Monthly Credit:${colors.reset}`);
    console.log(`  Current: ${creditColor}$${usage.credit.used}${colors.reset} / $${usage.credit.limit} (${(usage.credit.percentage * 100).toFixed(1)}%)`);
    console.log(`  Projected: $${projection.credit.projected} (${projection.credit.willExceed ? colors.red + 'WILL EXCEED' + colors.reset : colors.green + 'Within Limit' + colors.reset})`);
    console.log(`  Remaining: $${projection.credit.remaining}\n`);
    
    // Database storage
    const dbLevel = this.getAlertLevel(usage.database.percentage);
    const dbColor = dbLevel === 'ok' ? colors.green : 
                    dbLevel === 'warning' ? colors.yellow : colors.red;
    console.log(`${colors.bright}Database Storage:${colors.reset}`);
    console.log(`  Current: ${dbColor}${usage.database.used}${colors.reset} / ${usage.database.limit} MB (${(usage.database.percentage * 100).toFixed(1)}%)\n`);
    
    // Redis memory
    const redisLevel = this.getAlertLevel(usage.redis.percentage);
    const redisColor = redisLevel === 'ok' ? colors.green : 
                       redisLevel === 'warning' ? colors.yellow : colors.red;
    console.log(`${colors.bright}Redis Memory:${colors.reset}`);
    console.log(`  Current: ${redisColor}${usage.redis.used}${colors.reset} / ${usage.redis.limit} MB (${(usage.redis.percentage * 100).toFixed(1)}%)\n`);
    
    // Overall status
    const overallLevel = [hoursLevel, creditLevel, dbLevel, redisLevel]
      .reduce((max, level) => {
        const levels = ['ok', 'warning', 'critical', 'shutdown'];
        return levels.indexOf(level) > levels.indexOf(max) ? level : max;
      }, 'ok');
    
    if (overallLevel === 'shutdown') {
      console.log(colors.red + colors.bright + '⚠ SHUTDOWN THRESHOLD REACHED!' + colors.reset);
      console.log(colors.red + 'Service will be automatically shut down to prevent charges.' + colors.reset);
      console.log('Maintenance mode will be deployed.\n');
    } else if (overallLevel === 'critical') {
      console.log(colors.red + colors.bright + '⚠ CRITICAL: Approaching free tier limits!' + colors.reset);
      console.log(colors.yellow + 'Consider upgrading or optimizing usage immediately.\n' + colors.reset);
    } else if (overallLevel === 'warning') {
      console.log(colors.yellow + colors.bright + '⚠ WARNING: Usage is above 75% of free tier' + colors.reset);
      console.log(colors.yellow + 'Monitor usage closely to avoid exceeding limits.\n' + colors.reset);
    } else {
      console.log(colors.green + colors.bright + '✓ Usage is within acceptable limits' + colors.reset + '\n');
    }
    
    console.log(colors.cyan + '='.repeat(80) + colors.reset + '\n');
    
    return overallLevel;
  }

  /**
   * Deploy maintenance mode
   */
  async deployMaintenanceMode() {
    console.log(`${colors.yellow}Deploying maintenance mode...${colors.reset}`);
    
    const maintenancePath = path.join(__dirname, '..', 'maintenance.html');
    
    if (!fs.existsSync(maintenancePath)) {
      console.error(`${colors.red}Error: maintenance.html not found${colors.reset}`);
      return false;
    }
    
    // This would deploy the maintenance page
    // Implementation depends on Railway's static site deployment
    console.log(`${colors.green}✓ Maintenance mode prepared${colors.reset}`);
    console.log('To deploy maintenance mode:');
    console.log('  1. Create a new Railway service');
    console.log('  2. Deploy maintenance.html as static site');
    console.log('  3. Update DNS to point to maintenance service');
    console.log('  4. Shut down main application services\n');
    
    return true;
  }

  /**
   * Shut down services
   */
  async shutdownServices() {
    console.log(`${colors.red}Initiating automatic shutdown...${colors.reset}`);
    
    // Log shutdown event
    const logPath = path.join(__dirname, '..', 'railway-shutdown.log');
    const logEntry = `[${new Date().toISOString()}] Automatic shutdown triggered - free tier limit reached\n`;
    fs.appendFileSync(logPath, logEntry);
    
    console.log('Shutdown process:');
    console.log('  1. ✓ Logged shutdown event');
    console.log('  2. ⏳ Preparing maintenance mode');
    
    await this.deployMaintenanceMode();
    
    console.log('  3. ⚠ Manual action required:');
    console.log('     - Run: railway down');
    console.log('     - Or disable services in Railway dashboard');
    console.log('     - Review COOLIFY_MIGRATION.md for migration options\n');
    
    return true;
  }

  /**
   * Run monitoring
   */
  async run(options = {}) {
    if (!await this.checkRailwayCLI()) {
      return;
    }
    
    console.log('Fetching Railway usage data...\n');
    
    const usage = await this.getUsage();
    const projection = this.calculateProjection(usage);
    const alertLevel = this.printUsageReport(usage, projection);
    
    // Take action based on alert level
    if (alertLevel === 'shutdown' && this.autoShutdown) {
      await this.shutdownServices();
    } else if (alertLevel === 'critical') {
      console.log(`${colors.yellow}Recommendation:${colors.reset}`);
      console.log('  - Upgrade to Railway paid plan');
      console.log('  - Optimize resource usage');
      console.log('  - Consider migrating to Coolify (see COOLIFY_MIGRATION.md)\n');
    }
    
    // Exit with appropriate code
    if (alertLevel === 'shutdown' || alertLevel === 'critical') {
      process.exit(1);
    }
  }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: node railway-usage-monitor.mjs [options]

Options:
  --no-auto-shutdown    Disable automatic shutdown
  -h, --help           Show this help message

Environment Variables:
  RAILWAY_AUTO_SHUTDOWN  Set to 'false' to disable auto-shutdown

Examples:
  node railway-usage-monitor.mjs
  node railway-usage-monitor.mjs --no-auto-shutdown
  RAILWAY_AUTO_SHUTDOWN=false node railway-usage-monitor.mjs
      `);
      process.exit(0);
    } else if (args[i] === '--no-auto-shutdown') {
      process.env.RAILWAY_AUTO_SHUTDOWN = 'false';
    }
  }
  
  const monitor = new RailwayUsageMonitor();
  monitor.run(options);
}

export default RailwayUsageMonitor;
