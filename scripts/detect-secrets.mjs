#!/usr/bin/env node

/**
 * Secret Detection and Validation Script
 * 
 * This script:
 * 1. Reads the .agents file to understand required secrets
 * 2. Checks current environment for missing or invalid secrets
 * 3. Validates secret formats
 * 4. Generates a report of missing/invalid secrets
 * 5. Can output in multiple formats (console, JSON, markdown)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

class SecretDetector {
  constructor() {
    this.agentsFile = path.join(__dirname, '..', '.agents');
    this.envExample = path.join(__dirname, '..', '.env.example');
    this.agentsData = null;
    this.currentEnv = process.env;
  }

  /**
   * Load and parse .agents file
   */
  loadAgentsFile() {
    try {
      const content = fs.readFileSync(this.agentsFile, 'utf-8');
      this.agentsData = JSON.parse(content);
      return true;
    } catch (error) {
      console.error(`${colors.red}Error loading .agents file:${colors.reset}`, error.message);
      return false;
    }
  }

  /**
   * Get all secrets from .agents file
   */
  getAllSecrets() {
    if (!this.agentsData) return [];
    
    const allSecrets = [];
    const secretCategories = this.agentsData.secrets || {};
    
    for (const [category, secrets] of Object.entries(secretCategories)) {
      if (Array.isArray(secrets)) {
        secrets.forEach(secret => {
          allSecrets.push({
            ...secret,
            category,
          });
        });
      }
    }
    
    return allSecrets;
  }

  /**
   * Get required secrets for a specific deployment mode
   */
  getRequiredSecrets(mode = 'zero_secrets') {
    const deploymentModes = this.agentsData.deployment_modes || {};
    const modeConfig = deploymentModes[mode];
    
    if (!modeConfig) {
      console.warn(`${colors.yellow}Warning: Deployment mode '${mode}' not found${colors.reset}`);
      return [];
    }
    
    const requiredNames = modeConfig.required_secrets || [];
    const allSecrets = this.getAllSecrets();
    
    return allSecrets.filter(secret => 
      requiredNames.includes(secret.name) || secret.required === true
    );
  }

  /**
   * Validate secret format
   */
  validateSecretFormat(secret, value) {
    if (!value || value === '') return { valid: false, reason: 'Empty value' };
    
    const format = secret.format;
    
    // Check for placeholder values
    const placeholders = [
      'your-',
      'GENERATE_',
      'RAILWAY_',
      'xxxxxxxxxxxx',
      'example.com',
    ];
    
    for (const placeholder of placeholders) {
      if (value.includes(placeholder)) {
        return { valid: false, reason: 'Contains placeholder value' };
      }
    }
    
    // Format-specific validation
    if (format) {
      if (format.includes('postgresql://') && !value.startsWith('postgresql://')) {
        return { valid: false, reason: 'Invalid PostgreSQL URL format' };
      }
      if (format.includes('redis://') && !value.startsWith('redis://')) {
        return { valid: false, reason: 'Invalid Redis URL format' };
      }
      if (format.includes('https://') && !value.startsWith('http://') && !value.startsWith('https://')) {
        return { valid: false, reason: 'Invalid URL format' };
      }
      if (format.includes('email') && !value.includes('@')) {
        return { valid: false, reason: 'Invalid email format' };
      }
    }
    
    // Minimum length check for secrets
    if (secret.name.includes('SECRET') || secret.name.includes('KEY')) {
      if (value.length < 16) {
        return { valid: false, reason: 'Secret too short (minimum 16 characters)' };
      }
    }
    
    return { valid: true, reason: 'Valid' };
  }

  /**
   * Check current environment
   */
  checkEnvironment(mode = 'zero_secrets') {
    const requiredSecrets = this.getRequiredSecrets(mode);
    const results = {
      mode,
      total: requiredSecrets.length,
      found: 0,
      missing: 0,
      invalid: 0,
      valid: 0,
      secrets: [],
    };
    
    for (const secret of requiredSecrets) {
      const value = this.currentEnv[secret.name];
      const status = {
        name: secret.name,
        category: secret.category,
        required: secret.required,
        found: !!value,
        value: value ? '***' : null,
      };
      
      if (value) {
        results.found++;
        const validation = this.validateSecretFormat(secret, value);
        status.valid = validation.valid;
        status.validationReason = validation.reason;
        
        if (validation.valid) {
          results.valid++;
        } else {
          results.invalid++;
        }
      } else {
        results.missing++;
        status.valid = false;
        status.validationReason = 'Not set';
      }
      
      results.secrets.push(status);
    }
    
    return results;
  }

  /**
   * Print console report
   */
  printConsoleReport(results) {
    console.log('\n' + colors.bright + colors.cyan + '='.repeat(80) + colors.reset);
    console.log(colors.bright + '  Secret Detection and Validation Report' + colors.reset);
    console.log(colors.cyan + '='.repeat(80) + colors.reset + '\n');
    
    console.log(`${colors.bright}Deployment Mode:${colors.reset} ${results.mode}`);
    console.log(`${colors.bright}Total Secrets:${colors.reset} ${results.total}`);
    console.log(`${colors.green}✓ Found:${colors.reset} ${results.found}`);
    console.log(`${colors.yellow}⚠ Missing:${colors.reset} ${results.missing}`);
    console.log(`${colors.green}✓ Valid:${colors.reset} ${results.valid}`);
    console.log(`${colors.red}✗ Invalid:${colors.reset} ${results.invalid}\n`);
    
    // Group by status
    const missing = results.secrets.filter(s => !s.found);
    const invalid = results.secrets.filter(s => s.found && !s.valid);
    const valid = results.secrets.filter(s => s.found && s.valid);
    
    if (missing.length > 0) {
      console.log(colors.red + colors.bright + 'Missing Secrets:' + colors.reset);
      missing.forEach(s => {
        console.log(`  ${colors.red}✗${colors.reset} ${s.name} ${colors.yellow}(${s.category})${colors.reset}`);
      });
      console.log('');
    }
    
    if (invalid.length > 0) {
      console.log(colors.yellow + colors.bright + 'Invalid Secrets:' + colors.reset);
      invalid.forEach(s => {
        console.log(`  ${colors.yellow}⚠${colors.reset} ${s.name} - ${s.validationReason}`);
      });
      console.log('');
    }
    
    if (valid.length > 0) {
      console.log(colors.green + colors.bright + 'Valid Secrets:' + colors.reset);
      valid.forEach(s => {
        console.log(`  ${colors.green}✓${colors.reset} ${s.name} ${colors.cyan}(${s.category})${colors.reset}`);
      });
      console.log('');
    }
    
    // Summary
    if (results.missing > 0 || results.invalid > 0) {
      console.log(colors.red + colors.bright + '⚠ ACTION REQUIRED:' + colors.reset);
      if (results.missing > 0) {
        console.log(`  - Set ${results.missing} missing secret(s)`);
      }
      if (results.invalid > 0) {
        console.log(`  - Fix ${results.invalid} invalid secret(s)`);
      }
      console.log('\nRefer to .agents file for secret specifications.');
      console.log('See RAILWAY_DEPLOYMENT.md for setup instructions.\n');
    } else {
      console.log(colors.green + colors.bright + '✓ All required secrets are properly configured!' + colors.reset + '\n');
    }
    
    console.log(colors.cyan + '='.repeat(80) + colors.reset + '\n');
  }

  /**
   * Generate JSON report
   */
  generateJSONReport(results) {
    return JSON.stringify(results, null, 2);
  }

  /**
   * Generate Markdown report
   */
  generateMarkdownReport(results) {
    let md = '# Secret Detection Report\n\n';
    md += `**Deployment Mode:** ${results.mode}\n\n`;
    md += '## Summary\n\n';
    md += `| Metric | Count |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Secrets | ${results.total} |\n`;
    md += `| Found | ${results.found} |\n`;
    md += `| Missing | ${results.missing} |\n`;
    md += `| Valid | ${results.valid} |\n`;
    md += `| Invalid | ${results.invalid} |\n\n`;
    
    md += '## Detailed Results\n\n';
    md += '| Secret Name | Category | Status | Validation |\n';
    md += '|-------------|----------|--------|------------|\n';
    
    results.secrets.forEach(s => {
      const status = s.found ? (s.valid ? '✓ Found' : '⚠ Invalid') : '✗ Missing';
      md += `| ${s.name} | ${s.category} | ${status} | ${s.validationReason || 'N/A'} |\n`;
    });
    
    return md;
  }

  /**
   * Run detection
   */
  run(options = {}) {
    const mode = options.mode || 'zero_secrets';
    const format = options.format || 'console';
    
    if (!this.loadAgentsFile()) {
      process.exit(1);
    }
    
    const results = this.checkEnvironment(mode);
    
    switch (format) {
      case 'json':
        console.log(this.generateJSONReport(results));
        break;
      case 'markdown':
        console.log(this.generateMarkdownReport(results));
        break;
      default:
        this.printConsoleReport(results);
    }
    
    // Exit with error code if secrets are missing or invalid
    if (results.missing > 0 || results.invalid > 0) {
      process.exit(1);
    }
  }
}

// CLI - check if this script is being run directly
const scriptPath = fileURLToPath(import.meta.url);
const runPath = process.argv[1];
if (scriptPath === runPath) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--mode' || args[i] === '-m') {
      options.mode = args[++i];
    } else if (args[i] === '--format' || args[i] === '-f') {
      options.format = args[++i];
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: node detect-secrets.mjs [options]

Options:
  -m, --mode <mode>      Deployment mode (zero_secrets, basic, full)
  -f, --format <format>  Output format (console, json, markdown)
  -h, --help            Show this help message

Examples:
  node detect-secrets.mjs
  node detect-secrets.mjs --mode basic
  node detect-secrets.mjs --mode full --format json
  node detect-secrets.mjs --format markdown > report.md
      `);
      process.exit(0);
    }
  }
  
  const detector = new SecretDetector();
  detector.run(options);
}

export default SecretDetector;
