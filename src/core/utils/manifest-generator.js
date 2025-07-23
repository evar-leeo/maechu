import { ENV_CONFIG } from '../config/env.config.js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateTeamsManifest() {
  const templatePath = path.resolve(__dirname, '../../../teams-app-manifest.json');
  const outputPath = path.resolve(__dirname, '../../../teams-app-manifest-generated.json');
  
  try {
    let manifestTemplate = readFileSync(templatePath, 'utf8');
    
    // 환경변수로 템플릿 변수 치환
    const replacements = {
      '{{SERVER_URL}}': ENV_CONFIG.SERVER_URL,
      '{{SERVER_DOMAIN}}': ENV_CONFIG.SERVER_URL.replace('https://', '').replace('http://', ''),
      '{{TEAMS_BOT_ID}}': ENV_CONFIG.TEAMS_BOT_ID,
      '{{TEAMS_APP_PACKAGE}}': ENV_CONFIG.TEAMS_APP_PACKAGE
    };
    
    for (const [placeholder, value] of Object.entries(replacements)) {
      manifestTemplate = manifestTemplate.replace(new RegExp(placeholder, 'g'), value);
    }
    
    // 생성된 매니페스트 저장
    writeFileSync(outputPath, manifestTemplate, 'utf8');
    
    console.log(`Teams manifest generated: ${outputPath}`);
    return JSON.parse(manifestTemplate);
    
  } catch (error) {
    console.error('Failed to generate Teams manifest:', error);
    throw error;
  }
}

export function getApiEndpoints() {
  return {
    lunch: ENV_CONFIG.TEAMS_LUNCH_ENDPOINT,
    bot: ENV_CONFIG.TEAMS_BOT_ENDPOINT,
    buttonCard: ENV_CONFIG.TEAMS_BUTTON_CARD_ENDPOINT,
    health: ENV_CONFIG.TEAMS_HEALTH_ENDPOINT
  };
} 