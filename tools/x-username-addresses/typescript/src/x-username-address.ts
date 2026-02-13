/**
 * X Username → Bitcoin Address Derivation
 * 
 * Generate deterministic Bitcoin P2PKH addresses from X (Twitter) usernames
 * for sending inscriptions, Runes, and BRC-20 tokens.
 * 
 * Algorithm: SHA-256(b'burn:' + username) → RIPEMD-160 → Base58Check
 * 
 * @author Metagood / OCM Dimensions
 * @license MIT
 */

import { createHash } from 'crypto';

/** Bitcoin Base58 alphabet (excludes 0, O, I, l to avoid confusion) */
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/** Domain separator for hash namespace isolation */
const DOMAIN_SEPARATOR = 'burn:';

/** X username validation pattern (4-15 chars, alphanumeric + underscore, lowercase) */
const USERNAME_PATTERN = /^[a-z0-9_]{4,15}$/;

/**
 * Encode bytes as Base58 string with leading-zero preservation.
 */
function base58Encode(payload: Buffer): string {
  let n = BigInt('0x' + payload.toString('hex'));
  let result = '';
  
  // Convert to base58
  while (n > 0n) {
    const remainder = Number(n % 58n);
    n = n / 58n;
    result = BASE58_ALPHABET[remainder] + result;
  }
  
  // Preserve leading zero bytes as '1' characters
  for (const byte of payload) {
    if (byte === 0) {
      result = '1' + result;
    } else {
      break;
    }
  }
  
  return result;
}

/**
 * Normalize an X username to canonical form.
 * 
 * Canonical form: lowercase(strip_leading_@(trim(username)))
 * 
 * @param raw - Raw username input (may include @, mixed case, whitespace)
 * @returns Normalized username
 * @throws Error if username is invalid after normalization
 * 
 * @example
 * ```typescript
 * normalizeUsername('@Grok')  // 'grok'
 * normalizeUsername('GROK')   // 'grok'
 * normalizeUsername(' grok ') // 'grok'
 * ```
 */
export function normalizeUsername(raw: string): string {
  // Strip whitespace
  let username = raw.trim();
  
  // Strip single leading @
  if (username.startsWith('@')) {
    username = username.slice(1);
  }
  
  // Lowercase
  username = username.toLowerCase();
  
  // Validate
  if (!USERNAME_PATTERN.test(username)) {
    throw new Error(
      `Invalid X username after normalization: '${username}'. ` +
      `Must be 4-15 chars, only a-z, 0-9, underscore.`
    );
  }
  
  return username;
}

/**
 * Derive a deterministic P2PKH Bitcoin address from an X username.
 * 
 * Pipeline:
 *   1. Normalize username
 *   2. Add domain separator (b'burn:')
 *   3. SHA-256
 *   4. RIPEMD-160
 *   5. Version byte (0x00 for P2PKH mainnet)
 *   6. Checksum (first 4 bytes of double SHA-256)
 *   7. Base58Check encode
 * 
 * @param rawUsername - X username (e.g., 'grok', '@Grok', 'GROK')
 * @returns Bitcoin P2PKH address (starts with '1')
 * 
 * @example
 * ```typescript
 * usernameToAddress('grok')   // '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
 * usernameToAddress('@Grok')  // '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
 * ```
 */
export function usernameToAddress(rawUsername: string): string {
  // Step 1: Normalize
  const username = normalizeUsername(rawUsername);
  
  // Step 2: Add domain separator (CRITICAL - prevents cross-protocol collisions)
  const domainInput = Buffer.concat([
    Buffer.from(DOMAIN_SEPARATOR, 'utf8'),
    Buffer.from(username, 'utf8')
  ]);
  
  // Step 3: SHA-256 (32 bytes)
  const sha256 = createHash('sha256').update(domainInput).digest();
  
  // Step 4: RIPEMD-160 (20 bytes) — Bitcoin's Hash160
  const ripemd160 = createHash('ripemd160').update(sha256).digest();
  
  // Step 5: Prepend version byte (0x00 = P2PKH mainnet)
  const versioned = Buffer.concat([Buffer.from([0x00]), ripemd160]);
  
  // Step 6: Double-SHA-256 checksum (first 4 bytes)
  const hash1 = createHash('sha256').update(versioned).digest();
  const hash2 = createHash('sha256').update(hash1).digest();
  const checksum = hash2.subarray(0, 4);
  
  // Step 7: Base58Check encode
  const address = base58Encode(Buffer.concat([versioned, checksum]));
  
  return address;
}

/**
 * Verify that a claimed address matches the deterministic derivation
 * for a given username.
 * 
 * @param rawUsername - X username
 * @param claimedAddress - Bitcoin address to verify
 * @returns True if the address is the correct derivation for the username
 * 
 * @example
 * ```typescript
 * verifyUsernameAddress('grok', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4')  // true
 * verifyUsernameAddress('grok', '1FakeAddress')                       // false
 * ```
 */
export function verifyUsernameAddress(rawUsername: string, claimedAddress: string): boolean {
  try {
    const derived = usernameToAddress(rawUsername);
    return derived === claimedAddress;
  } catch {
    return false;
  }
}

/**
 * Generate addresses for multiple usernames.
 * 
 * @param usernames - List of X usernames
 * @returns Map of username to address (or null if invalid)
 * 
 * @example
 * ```typescript
 * batchGenerate(['grok', 'huuep', 'invalid!'])
 * // { grok: '18Sx2K...', huuep: '1nZpo9...', 'invalid!': null }
 * ```
 */
export function batchGenerate(usernames: string[]): Record<string, string | null> {
  const results: Record<string, string | null> = {};
  
  for (const username of usernames) {
    try {
      results[username] = usernameToAddress(username);
    } catch {
      results[username] = null;
    }
  }
  
  return results;
}
