#!/usr/bin/env python3
"""
X Username → Bitcoin Address Derivation

Generate deterministic Bitcoin P2PKH addresses from X (Twitter) usernames
for sending inscriptions, Runes, and BRC-20 tokens.

Algorithm: SHA-256(b'burn:' + username) → RIPEMD-160 → Base58Check

Author: Metagood / OCM Dimensions
License: MIT
"""

import hashlib
import re
from typing import Optional

# Bitcoin Base58 alphabet (excludes 0, O, I, l to avoid confusion)
BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

# Domain separator for hash namespace isolation
DOMAIN_SEPARATOR = b'burn:'

# X username validation pattern (4-15 chars, alphanumeric + underscore, lowercase after normalization)
USERNAME_PATTERN = re.compile(r'^[a-z0-9_]{4,15}$')


def base58_encode(payload: bytes) -> str:
    """
    Encode bytes as Base58 string with leading-zero preservation.
    
    Args:
        payload: Bytes to encode
        
    Returns:
        Base58-encoded string
    """
    # Convert bytes to integer
    n = int.from_bytes(payload, 'big')
    result = ''
    
    # Convert to base58
    while n > 0:
        n, remainder = divmod(n, 58)
        result = BASE58_ALPHABET[remainder] + result
    
    # Preserve leading zero bytes as '1' characters
    for byte in payload:
        if byte == 0:
            result = '1' + result
        else:
            break
    
    return result


def normalize_username(raw: str) -> str:
    """
    Normalize an X username to canonical form.
    
    Canonical form: lowercase(strip_leading_@(trim(username)))
    
    Args:
        raw: Raw username input (may include @, mixed case, whitespace)
        
    Returns:
        Normalized username
        
    Raises:
        ValueError: If username is invalid after normalization
        
    Examples:
        >>> normalize_username('@Grok')
        'grok'
        >>> normalize_username('GROK')
        'grok'
        >>> normalize_username(' grok ')
        'grok'
    """
    # Strip whitespace
    username = raw.strip()
    
    # Strip single leading @
    if username.startswith('@'):
        username = username[1:]
    
    # Lowercase
    username = username.lower()
    
    # Validate
    if not USERNAME_PATTERN.match(username):
        raise ValueError(
            f"Invalid X username after normalization: '{username}'. "
            f"Must be 4-15 chars, only a-z, 0-9, underscore."
        )
    
    return username


def username_to_address(raw_username: str) -> str:
    """
    Derive a deterministic P2PKH Bitcoin address from an X username.
    
    Pipeline:
        1. Normalize username
        2. Add domain separator (b'burn:')
        3. SHA-256
        4. RIPEMD-160
        5. Version byte (0x00 for P2PKH mainnet)
        6. Checksum (first 4 bytes of double SHA-256)
        7. Base58Check encode
    
    Args:
        raw_username: X username (e.g., 'grok', '@Grok', 'GROK')
        
    Returns:
        Bitcoin P2PKH address (starts with '1')
        
    Examples:
        >>> username_to_address('grok')
        '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
        >>> username_to_address('@Grok')
        '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
    """
    # Step 1: Normalize
    username = normalize_username(raw_username)
    
    # Step 2: Add domain separator (CRITICAL - prevents cross-protocol collisions)
    domain_input = DOMAIN_SEPARATOR + username.encode('utf-8')
    
    # Step 3: SHA-256 (32 bytes)
    sha256_hash = hashlib.sha256(domain_input).digest()
    
    # Step 4: RIPEMD-160 (20 bytes) — Bitcoin's Hash160
    ripemd160_hash = hashlib.new('ripemd160', sha256_hash).digest()
    
    # Step 5: Prepend version byte (0x00 = P2PKH mainnet)
    versioned = b'\x00' + ripemd160_hash
    
    # Step 6: Double-SHA-256 checksum (first 4 bytes)
    checksum = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]
    
    # Step 7: Base58Check encode
    address = base58_encode(versioned + checksum)
    
    return address


def verify_username_address(raw_username: str, claimed_address: str) -> bool:
    """
    Verify that a claimed address matches the deterministic derivation
    for a given username.
    
    Args:
        raw_username: X username
        claimed_address: Bitcoin address to verify
        
    Returns:
        True if the address is the correct derivation for the username
        
    Examples:
        >>> verify_username_address('grok', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4')
        True
        >>> verify_username_address('grok', '1FakeAddress')
        False
    """
    try:
        derived = username_to_address(raw_username)
        return derived == claimed_address
    except ValueError:
        return False


def batch_generate(usernames: list[str]) -> dict[str, Optional[str]]:
    """
    Generate addresses for multiple usernames.
    
    Args:
        usernames: List of X usernames
        
    Returns:
        Dictionary mapping username to address (or None if invalid)
        
    Examples:
        >>> batch_generate(['grok', 'huuep', 'invalid!'])
        {'grok': '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4', 'huuep': '1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w', 'invalid!': None}
    """
    results = {}
    for username in usernames:
        try:
            results[username] = username_to_address(username)
        except ValueError:
            results[username] = None
    return results


def main():
    """Command-line interface."""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python x_username_address.py <username>")
        print("\nExamples:")
        print("  python x_username_address.py grok")
        print("  python x_username_address.py @Grok")
        print("  python x_username_address.py huuep")
        sys.exit(1)
    
    username = sys.argv[1]
    
    try:
        address = username_to_address(username)
        canonical = normalize_username(username)
        print(f"Username: {canonical}")
        print(f"Address:  {address}")
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
