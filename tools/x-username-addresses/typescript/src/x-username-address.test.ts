/**
 * Tests for X Username → Bitcoin Address Derivation
 * 
 * Includes the canonical "grok" test vector to ensure spec compliance.
 */

import { describe, it, expect } from '@jest/globals';
import {
  normalizeUsername,
  usernameToAddress,
  verifyUsernameAddress,
  batchGenerate
} from './x-username-address';

describe('Username Normalization', () => {
  describe('already canonical', () => {
    it('should keep canonical usernames unchanged', () => {
      expect(normalizeUsername('grok')).toBe('grok');
      expect(normalizeUsername('huuep')).toBe('huuep');
    });
  });

  describe('strip @ sign', () => {
    it('should strip leading @ symbol', () => {
      expect(normalizeUsername('@grok')).toBe('grok');
      expect(normalizeUsername('@huuep')).toBe('huuep');
    });

    it('should strip only the first @ symbol', () => {
      expect(normalizeUsername('@@grok')).toBe('@grok');
    });
  });

  describe('lowercase conversion', () => {
    it('should convert to lowercase', () => {
      expect(normalizeUsername('GROK')).toBe('grok');
      expect(normalizeUsername('Grok')).toBe('grok');
      expect(normalizeUsername('GRoK')).toBe('grok');
    });
  });

  describe('whitespace stripping', () => {
    it('should strip leading/trailing whitespace', () => {
      expect(normalizeUsername(' grok ')).toBe('grok');
      expect(normalizeUsername('\tgrok\n')).toBe('grok');
    });
  });

  describe('combined normalization', () => {
    it('should apply multiple normalizations', () => {
      expect(normalizeUsername(' @GROK ')).toBe('grok');
      expect(normalizeUsername('\t@Huuep\n')).toBe('huuep');
    });
  });

  describe('underscores allowed', () => {
    it('should allow underscores', () => {
      expect(normalizeUsername('user_name')).toBe('user_name');
      expect(normalizeUsername('test_123')).toBe('test_123');
    });
  });

  describe('validation errors', () => {
    it('should reject too short usernames', () => {
      expect(() => normalizeUsername('abc')).toThrow('Invalid X username');
      expect(() => normalizeUsername('gro')).toThrow('Invalid X username');
    });

    it('should reject too long usernames', () => {
      expect(() => normalizeUsername('a'.repeat(16))).toThrow('Invalid X username');
    });

    it('should reject invalid characters', () => {
      expect(() => normalizeUsername('user name')).toThrow('Invalid X username');
      expect(() => normalizeUsername('user-name')).toThrow('Invalid X username');
      expect(() => normalizeUsername('user.name')).toThrow('Invalid X username');
      expect(() => normalizeUsername('user!name')).toThrow('Invalid X username');
    });
  });
});

describe('Address Derivation', () => {
  describe('canonical test vector', () => {
    it('CRITICAL: should derive correct address for "grok"', () => {
      /**
       * This is the canonical test vector defined by Grok.
       * All compliant implementations MUST pass this test.
       */
      const address = usernameToAddress('grok');
      expect(address).toBe('18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
    });

    it('should derive correct address for @grok (with @)', () => {
      const address = usernameToAddress('@grok');
      expect(address).toBe('18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
    });

    it('should derive correct address for GROK (uppercase)', () => {
      const address = usernameToAddress('GROK');
      expect(address).toBe('18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
    });

    it('should derive correct address for @Grok (mixed case with @)', () => {
      const address = usernameToAddress('@Grok');
      expect(address).toBe('18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
    });
  });

  describe('other known usernames', () => {
    it('should derive correct address for huuep', () => {
      const address = usernameToAddress('huuep');
      expect(address).toBe('1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w');
    });
  });

  describe('deterministic property', () => {
    it('should always produce the same address for the same username', () => {
      const addr1 = usernameToAddress('test_user');
      const addr2 = usernameToAddress('test_user');
      expect(addr1).toBe(addr2);
    });

    it('should produce different addresses for different usernames', () => {
      const addr1 = usernameToAddress('user1');
      const addr2 = usernameToAddress('user2');
      expect(addr1).not.toBe(addr2);
    });
  });

  describe('address format', () => {
    it('should start with "1" (P2PKH)', () => {
      const address = usernameToAddress('grok');
      expect(address[0]).toBe('1');
    });

    it('should be within valid Bitcoin address length range', () => {
      const address = usernameToAddress('grok');
      expect(address.length).toBeGreaterThanOrEqual(26);
      expect(address.length).toBeLessThanOrEqual(35);
    });
  });

  describe('case insensitivity', () => {
    it('should produce the same address regardless of case', () => {
      const addrLower = usernameToAddress('testuser');
      const addrUpper = usernameToAddress('TESTUSER');
      const addrMixed = usernameToAddress('TestUser');
      expect(addrLower).toBe(addrUpper);
      expect(addrUpper).toBe(addrMixed);
    });
  });
});

describe('Address Verification', () => {
  it('should verify the canonical grok address', () => {
    expect(verifyUsernameAddress('grok', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4')).toBe(true);
  });

  it('should reject wrong address for grok', () => {
    expect(verifyUsernameAddress('grok', '1FakeAddress')).toBe(false);
  });

  it('should verify huuep address', () => {
    expect(verifyUsernameAddress('huuep', '1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w')).toBe(true);
  });

  it('should return false for invalid username', () => {
    expect(verifyUsernameAddress('invalid!', 'any_address')).toBe(false);
  });

  it('should work with case variations', () => {
    expect(verifyUsernameAddress('@GROK', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4')).toBe(true);
    expect(verifyUsernameAddress('Grok', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4')).toBe(true);
  });
});

describe('Batch Generation', () => {
  it('should generate addresses for multiple valid usernames', () => {
    const results = batchGenerate(['grok', 'huuep', 'test_user']);
    expect(Object.keys(results)).toHaveLength(3);
    expect(results['grok']).toBe('18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
    expect(results['huuep']).toBe('1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w');
    expect(results['test_user']).not.toBeNull();
  });

  it('should handle mix of valid and invalid usernames', () => {
    const results = batchGenerate(['grok', 'invalid!', 'huuep', 'ab']);
    expect(results['grok']).toBe('18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
    expect(results['invalid!']).toBeNull();
    expect(results['huuep']).toBe('1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w');
    expect(results['ab']).toBeNull();
  });

  it('should return empty object for empty list', () => {
    const results = batchGenerate([]);
    expect(results).toEqual({});
  });
});

describe('Domain Separator', () => {
  it('should use the domain separator (different from plain hash)', () => {
    /**
     * This test verifies that the domain separator is actually being used
     * by checking that we DON'T get the address that would result from
     * hashing the username directly without the 'burn:' prefix.
     */
    const address = usernameToAddress('grok');
    
    // The address with domain separator (correct)
    expect(address).toBe('18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
    
    // NOT the address without domain separator (this would be wrong)
    expect(address).not.toBe('1GaZWnk3b9ZPvfYoW5nPhCYxzJtxd7NTYA');
  });
});

describe('Edge Cases', () => {
  it('should handle minimum length username (4 chars)', () => {
    const address = usernameToAddress('abcd');
    expect(address).toBeTruthy();
    expect(address[0]).toBe('1');
  });

  it('should handle maximum length username (15 chars)', () => {
    const address = usernameToAddress('a'.repeat(15));
    expect(address).toBeTruthy();
    expect(address[0]).toBe('1');
  });

  it('should handle all-numeric username', () => {
    const address = usernameToAddress('12345');
    expect(address).toBeTruthy();
  });

  it('should handle numbers and underscores', () => {
    const address = usernameToAddress('1_2_3_4_5');
    expect(address).toBeTruthy();
  });
});
