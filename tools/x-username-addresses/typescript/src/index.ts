#!/usr/bin/env node
/**
 * CLI for X Username → Bitcoin Address Derivation
 */

import { usernameToAddress, normalizeUsername } from './x-username-address';

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: x-username-address <username>');
    console.log('\nExamples:');
    console.log('  x-username-address grok');
    console.log('  x-username-address @Grok');
    console.log('  x-username-address huuep');
    process.exit(1);
  }
  
  const username = args[0];
  
  try {
    const address = usernameToAddress(username);
    const canonical = normalizeUsername(username);
    console.log(`Username: ${canonical}`);
    console.log(`Address:  ${address}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error: Unknown error occurred');
    }
    process.exit(1);
  }
}

main();
