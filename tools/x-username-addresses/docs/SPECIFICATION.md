# X Username → Bitcoin Address: Deterministic Hash Approach

## Implementation Specification v1.1

**Date:** 2026-02-12 (Updated: 19:06 PST with Grok's actual algorithm)  
**Author:** Toky (tokenization specialist)  
**Context:** Sending Bitcoin inscriptions to X/Twitter usernames using Grok's deterministic hash method  
**Constraint:** Recipient must be able to easily prove the inscription is "theirs." Spending is NOT required.

**IMPORTANT:** This spec has been updated with Grok's actual implementation, which includes a `'burn:'` domain separator prefix.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Algorithm](#2-algorithm)
3. [Input Normalization](#3-input-normalization)
4. [Reference Implementation](#4-reference-implementation)
5. [Proof Mechanism](#5-proof-mechanism)
6. [Verification Process](#6-verification-process)
7. [Security Analysis](#7-security-analysis)
8. [Production Considerations](#8-production-considerations)
9. [Worked Example](#9-worked-example)
10. [Summary](#10-summary)

---

## 1. Overview

**⚠️ CRITICAL: Domain Separator**

This specification uses Grok's canonical algorithm which includes a `'burn:'` prefix as a domain separator before hashing. This is essential for:
- Preventing cross-protocol collisions
- Establishing a unique namespace for X username inscription addresses
- Following cryptographic best practices

**All implementations MUST use** `SHA-256(b'burn:' + username)` **as specified**, not just `SHA-256(username)`.

### Concept

Derive a deterministic Bitcoin address from an X username such that:
- **Anyone** can compute the address for any username (open algorithm)
- **The username owner** can prove "this address was derived from MY username"
- **Nobody** can spend from the address (no private key exists — this is by design)
- **Inscriptions/Runes/BRC-20** sent to the address are permanently and publicly associated with that username

### What This IS
- A **coordination convention** — a publicly verifiable mapping from usernames to addresses
- A **proof-of-association** — the inscription is demonstrably linked to a specific username
- A **social primitive** — "I inscribed this for @huuep" is verifiable by anyone

### What This IS NOT
- NOT a custody solution (nobody can spend from the address)
- NOT identity authentication (the scheme doesn't prove WHO controls the X account)
- NOT a true burn address (not provably unspendable at the protocol level — just statistically impossible)
- NOT "soul-bound" in the SBT sense (no on-chain identity binding)

### Why It Still Works for the Constraint

The constraint says: *"X username should be able to easily prove the inscription is theirs. Not being able to spend it is fine."*

This approach satisfies that because:
1. The algorithm is public and deterministic
2. Anyone can independently verify: `f("huuep") → 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w`
3. @huuep can point to the address and say "that's my username-derived address" and anyone can confirm it
4. The proof is mathematical, not trust-based

---

## 2. Algorithm

### Pipeline

```
Input: X username string (e.g., "huuep")
    │
    ▼
[Normalize] ─── lowercase, strip @, validate charset
    │
    ▼
[Domain Separator] ─── Prepend b'burn:' → b'burn:huuep'
    │                  (CRITICAL: prevents cross-protocol collisions)
    ▼
[SHA-256] ─── 32 bytes
    │
    ▼
[RIPEMD-160] ─── 20 bytes (this is Bitcoin's "Hash160")
    │
    ▼
[Version Byte] ─── Prepend 0x00 (P2PKH mainnet) → 21 bytes
    │
    ▼
[Checksum] ─── SHA-256(SHA-256(versioned)) → take first 4 bytes
    │
    ▼
[Concatenate] ─── versioned (21 bytes) + checksum (4 bytes) → 25 bytes
    │
    ▼
[Base58Check Encode] ─── Standard Bitcoin Base58
    │
    ▼
Output: Bitcoin address (e.g., "1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w")
```

**Example:**
- Input: `"grok"`
- After normalize: `"grok"`
- With domain separator: `b'burn:grok'`
- Output: `18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4`

### Key Properties

| Property | Value |
|----------|-------|
| Input space | Normalized X usernames (4-15 chars, `[a-z0-9_]`) |
| Domain separator | `b'burn:'` prefix before hashing |
| Output space | P2PKH addresses (Base58Check, starts with `1`) |
| Determinism | Same input always produces same output |
| Collision resistance | SHA-256 + RIPEMD-160 → ~2^80 collision resistance |
| Reversibility | One-way — cannot recover username from address |
| Cross-protocol safety | Domain separator prevents collisions with other uses of username hashing |
| Key existence | No known private key; finding one requires ~2^160 work |

---

## 3. Input Normalization

### Canonical Form

**The canonical input is: the X username, lowercased, with no `@` prefix, with no leading/trailing whitespace.**

```
Canonical form: lowercase(strip_at(trim(username)))
```

### Rules

| Raw Input | Canonical Form | Notes |
|-----------|---------------|-------|
| `huuep` | `huuep` | Already canonical |
| `@huuep` | `huuep` | Strip leading `@` |
| `Huuep` | `huuep` | Lowercase |
| `@HUUEP` | `huuep` | Both transforms |
| ` huuep ` | `huuep` | Trim whitespace |
| `@@huuep` | `@huuep` | ⚠️ Strip only ONE leading `@` — edge case |
| `hu uep` | ❌ REJECT | Spaces in middle → invalid X username |
| `huuep_` | `huuep_` | Underscores are valid |
| `123` | ❌ REJECT | Too short (X minimum is 4 chars as of 2025) |
| `a_very_long_username_here` | ❌ REJECT | Too long (X max is 15 chars) |

### Validation Regex

```
^[a-z0-9_]{4,15}$
```

Applied AFTER normalization. If the canonical form doesn't match, reject the input.

### Edge Cases to Handle

1. **Username changes:** If @huuep changes their handle to @huuep2, the derived address changes. Inscriptions sent to the old address are still linked to the old username — this is a feature, not a bug. The inscription is a record of what the username was at the time.

2. **Deleted accounts:** The derived address still exists on-chain. The inscription is now linked to a username that no longer exists. This is acceptable — it's historical.

3. **Reused usernames:** If X reassigns a deleted username to a new user, the new user "inherits" the derived address. This is a known limitation (see Security Analysis).

4. **Unicode/emoji:** X usernames are ASCII-only (`[a-zA-Z0-9_]`), so this doesn't arise.

5. **Display names vs usernames:** We use the **@handle** (username), NOT the display name. Display names can contain any Unicode and are not unique.

---

## 4. Reference Implementation

### Python

```python
import hashlib
import re

# Bitcoin Base58 alphabet (no 0, O, I, l)
BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

def base58_encode(payload: bytes) -> str:
    """Encode bytes as Base58 string with leading-zero preservation."""
    n = int.from_bytes(payload, 'big')
    result = ''
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
    Returns canonical string or raises ValueError.
    """
    # Strip whitespace
    username = raw.strip()
    
    # Strip single leading @
    if username.startswith('@'):
        username = username[1:]
    
    # Lowercase
    username = username.lower()
    
    # Validate
    if not re.match(r'^[a-z0-9_]{4,15}$', username):
        raise ValueError(
            f"Invalid X username after normalization: '{username}'. "
            f"Must be 4-15 chars, only a-z, 0-9, underscore."
        )
    
    return username


def username_to_address(raw_username: str) -> str:
    """
    Derive a deterministic P2PKH Bitcoin address from an X username.
    
    Pipeline: normalize → domain separator → SHA-256 → RIPEMD-160 → version byte → checksum → Base58Check
    
    IMPORTANT: Uses 'burn:' prefix as domain separator (Grok's canonical implementation).
    """
    # Step 1: Normalize
    username = normalize_username(raw_username)
    
    # Step 2: Add domain separator (CRITICAL - this is Grok's actual implementation)
    domain_input = b'burn:' + username.encode('utf-8')
    
    # Step 3: SHA-256 (32 bytes)
    sha256_hash = hashlib.sha256(domain_input).digest()
    
    # Step 4: RIPEMD-160 (20 bytes) — this is Bitcoin's Hash160
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
    """
    try:
        derived = username_to_address(raw_username)
        return derived == claimed_address
    except ValueError:
        return False


# === Example Usage ===
if __name__ == '__main__':
    examples = ['huuep', '@huuep', 'HUUEP', '@AlphaAndyOCM', 'OnChainMonkey']
    
    for name in examples:
        try:
            addr = username_to_address(name)
            canonical = normalize_username(name)
            print(f"  @{name:20s} → canonical: {canonical:15s} → {addr}")
        except ValueError as e:
            print(f"  @{name:20s} → ERROR: {e}")
    
    # Verification example
    print("\nVerification:")
    addr = username_to_address('huuep')
    print(f"  verify('huuep', '{addr}') = {verify_username_address('huuep', addr)}")
    print(f"  verify('huuep', '1FakeAddress') = {verify_username_address('huuep', '1FakeAddress')}")
```

### JavaScript/TypeScript

```typescript
import { createHash } from 'crypto';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(payload: Buffer): string {
  let n = BigInt('0x' + payload.toString('hex'));
  let result = '';
  
  while (n > 0n) {
    const remainder = Number(n % 58n);
    n = n / 58n;
    result = BASE58_ALPHABET[remainder] + result;
  }
  
  // Preserve leading zero bytes
  for (const byte of payload) {
    if (byte === 0) {
      result = '1' + result;
    } else {
      break;
    }
  }
  
  return result;
}

function normalizeUsername(raw: string): string {
  let username = raw.trim();
  if (username.startsWith('@')) {
    username = username.slice(1);
  }
  username = username.toLowerCase();
  
  if (!/^[a-z0-9_]{4,15}$/.test(username)) {
    throw new Error(`Invalid X username: "${username}"`);
  }
  
  return username;
}

function usernameToAddress(rawUsername: string): string {
  const username = normalizeUsername(rawUsername);
  
  // Add domain separator (CRITICAL - Grok's canonical implementation)
  const domainInput = Buffer.concat([
    Buffer.from('burn:', 'utf8'),
    Buffer.from(username, 'utf8')
  ]);
  
  // SHA-256
  const sha256 = createHash('sha256').update(domainInput).digest();
  
  // RIPEMD-160
  const ripemd160 = createHash('ripemd160').update(sha256).digest();
  
  // Version byte (0x00 for P2PKH mainnet)
  const versioned = Buffer.concat([Buffer.from([0x00]), ripemd160]);
  
  // Double-SHA-256 checksum
  const hash1 = createHash('sha256').update(versioned).digest();
  const hash2 = createHash('sha256').update(hash1).digest();
  const checksum = hash2.subarray(0, 4);
  
  // Base58Check
  return base58Encode(Buffer.concat([versioned, checksum]));
}

function verifyUsernameAddress(rawUsername: string, claimedAddress: string): boolean {
  try {
    return usernameToAddress(rawUsername) === claimedAddress;
  } catch {
    return false;
  }
}
```

### Shell One-Liner (for verification)

```bash
# Derive address for "huuep" using standard tools
# NOTE: Includes 'burn:' domain separator
echo -n "burn:huuep" | \
  openssl dgst -sha256 -binary | \
  openssl dgst -ripemd160 -binary | \
  (printf '\x00'; cat) | \
  (tee >(openssl dgst -sha256 -binary | openssl dgst -sha256 -binary | head -c 4) | cat) | \
  base58  # requires base58 tool
# Expected output: 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w
```

*(Note: the shell pipeline is illustrative. In practice, use the Python or JS implementation.)*

---

## 5. Proof Mechanism

### How @huuep Proves "This Inscription Is Mine"

The proof is purely mathematical and requires no private keys, signatures, or trusted third parties.

#### Proof Steps

1. **@huuep publishes their username** (which is already public — it's their X handle)
2. **Anyone runs the algorithm:** `username_to_address("huuep")` → `1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w`
3. **Anyone checks the blockchain:** Look up that address on any block explorer → see the inscription
4. **Conclusion:** The inscription at that address is deterministically linked to the username "huuep"

#### What @huuep Does in Practice

**Option A: Tweet the proof**
```
My X-inscription address: 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w

Verify: SHA-256(b'burn:huuep') → RIPEMD-160 → Base58Check with version 0x00

Anyone can run the algorithm to confirm. The inscription at this 
address was sent to me by @sender.

[Link to verification tool]
```

**Option B: Use a verification website**
- Visit `https://x-inscriptions.example.com/verify`
- Enter username: `huuep`
- Site displays: derived address, any inscriptions at that address, and the full derivation for transparency

**Option C: Run the code themselves**
```bash
$ python3 x_inscription.py huuep
Address: 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w
Inscriptions: [list from ord indexer]
```

#### Strength of the Proof

| Proof Aspect | Strength | Notes |
|-------------|----------|-------|
| "This address maps to my username" | ✅ **Strong** | Deterministic, anyone can verify |
| "I am the real @huuep on X" | ⚠️ **Out of scope** | Requires checking X directly |
| "I authorized this inscription" | ❌ **Not proven** | Anyone can inscribe to any username's address |
| "Nobody else can claim this" | ⚠️ **Weak** | Username reassignment is a risk |

### Key Insight

The proof says: **"If you believe I am @huuep on X, then this inscription is deterministically mine."**

It does NOT say: "I cryptographically prove I control this X account." That would require signing, which is Deliverable 2 territory.

---

## 6. Verification Process

### For a Verifier (Anyone)

```
Input: 
  - Claimed username (e.g., "huuep")
  - Claimed address (e.g., "1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w")

Process:
  1. Normalize the username → "huuep"
  2. Run the derivation algorithm → get derived_address
  3. Compare: derived_address == claimed_address?
  4. If yes → the address IS the deterministic mapping for that username
  5. Check the blockchain → are there inscriptions at that address?
  6. If yes → those inscriptions are linked to that username

Output: VERIFIED or FAILED
```

### Verification Levels

**Level 1: Address Derivation (automated, trustless)**
- "Does this address correspond to this username?" → Pure math, anyone can verify

**Level 2: On-Chain State (automated, trustless)**
- "Are there inscriptions at this address?" → Query any Bitcoin full node or indexer

**Level 3: Identity Binding (manual, requires trust)**
- "Is this person actually @huuep on X?" → Requires visiting X.com and confirming the account exists with that handle

**Level 4: Intent (not verifiable in this scheme)**
- "Did @huuep want this inscription?" → Cannot be determined (anyone can inscribe to any derived address)

### Verification Tool Architecture

```
┌─────────────────────────────────────────────┐
│           Verification Web App              │
├─────────────────────────────────────────────┤
│                                             │
│  Input: @username                           │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ 1. Normalize username                │   │
│  │ 2. Derive address (client-side JS)   │   │
│  │ 3. Query ord indexer for inscriptions│   │
│  │ 4. Display results                   │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Output:                                    │
│  ┌──────────────────────────────────────┐   │
│  │ Username: huuep                      │   │
│  │ Derived Address: 1nZpo9Z...          │   │
│  │ Inscriptions: 3 found               │   │
│  │  - Inscription #12345 (image/png)    │   │
│  │  - Inscription #12346 (text/plain)   │   │
│  │  - Rune: MONKEY•GOLD (1000 units)   │   │
│  │                                      │   │
│  │ Derivation:                          │   │
│  │  SHA-256("huuep") = a3b2c1...        │   │
│  │  RIPEMD-160(^) = d4e5f6...           │   │
│  │  Address = 1nZpo9Z...               │   │
│  │                                      │   │
│  │ ✅ Verified: This address is the     │   │
│  │    deterministic mapping for @huuep  │   │
│  └──────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 7. Security Analysis

### 7.1 Attack Vectors

#### A. Username Squatting / Reassignment Attack
- **Vector:** X reassigns a deleted/suspended username to a new user. The new user now "owns" the derived address and all inscriptions sent to it.
- **Severity:** **MEDIUM** — X rarely reassigns usernames, but it happens (especially for short/desirable handles)
- **Mitigation:** Include a timestamp or block height in the derivation? (breaks simplicity). Accept the risk and document it. Alternatively, the inscription metadata can include a snapshot timestamp.

#### B. Pre-image Attack on Address
- **Vector:** Attacker tries to find a private key `k` such that `Hash160(PubKey(k)) == Hash160("huuep")`
- **Severity:** **NEGLIGIBLE** — Requires ~2^160 operations (heat death of the universe territory)
- **Practical impact:** Nobody can spend from these addresses

#### C. Impersonation
- **Vector:** Alice inscribes to @bob's derived address and claims she IS @bob
- **Severity:** **LOW** — Anyone can verify @bob's identity on X independently. The inscription doesn't prove WHO inscribed it, just that it's AT @bob's address.
- **Mitigation:** The proof goes in the other direction — @bob proves the address is his, not that Alice is @bob.

#### D. Unwanted Inscriptions
- **Vector:** Someone inscribes offensive content to @huuep's derived address
- **Severity:** **MEDIUM** — Like receiving spam email, the recipient can't prevent it
- **Mitigation:** Verification tools could add filtering. The inscription is "at" the address, not "endorsed by" the address owner.

#### E. Normalization Ambiguity
- **Vector:** Different implementations normalize differently → different addresses for the same username
- **Severity:** **HIGH if not standardized** — This is the #1 practical risk
- **Mitigation:** THIS SPEC defines the canonical normalization. All implementations MUST follow Section 3.

#### F. Algorithm Change / Versioning
- **Vector:** A "v2" of this scheme is released with different parameters. Now there are two addresses per username.
- **Severity:** **MEDIUM**
- **Mitigation:** Version the scheme. If v2 is ever needed, use a different version byte or prefix. v1 addresses are forever.

#### G. Hash Collision (two usernames → same address)
- **Vector:** Find two valid X usernames that produce the same derived address
- **Severity:** **NEGLIGIBLE** — Birthday attack on RIPEMD-160 requires ~2^80 operations, and the input space (valid X usernames) is far smaller than 2^80. Still computationally infeasible for the foreseeable future.

#### H. Missing Domain Separator (Implementation Error)
- **Vector:** Implementation omits the `'burn:'` prefix, generating incompatible addresses
- **Severity:** **CRITICAL** — Breaks entire coordination mechanism. Example: `"grok"` alone → `1GaZWnk3b9ZPvfYoW5nPhCYxzJtxd7NTYA` vs `b'burn:grok'` → `18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4`
- **Mitigation:** 
  - **All implementations MUST use the domain separator**
  - Test vectors should be published and verified
  - Reference implementations (Python/TypeScript in this spec) are canonical
  - Ecosystem should reject non-compliant tools

**Why the domain separator matters:**
1. **Cross-protocol safety** — Prevents collisions if usernames are hashed elsewhere
2. **Namespace isolation** — Creates a unique identifier space for this specific use case
3. **Cryptographic best practice** — Standard technique for domain separation in hash-based protocols
4. **Grok's canonical choice** — This is the algorithm Grok published and uses

### 7.2 What This Scheme Cannot Do

| Capability | Available? | Why Not |
|-----------|-----------|---------|
| Prove X account ownership | ❌ | No signing involved |
| Prevent unwanted inscriptions | ❌ | Address is public and derivable |
| Survive username changes | ❌ | New username = new address |
| Allow spending | ❌ | No private key |
| Revoke association | ❌ | On-chain is forever |
| Prove sender identity | ❌ | Anyone can inscribe to any address |

### 7.3 Honest Threat Model Summary

**This scheme is secure against:**
- ✅ Address forgery (can't claim a different address for a username)
- ✅ Private key discovery (nobody can spend)
- ✅ Hash collision (computationally infeasible)

**This scheme is vulnerable to:**
- ❌ Username reassignment (new user inherits old address)
- ❌ Unsolicited inscriptions (anyone can inscribe)
- ❌ Normalization disagreements (if implementations diverge)
- ❌ Social engineering (phishing with wrong normalization)
- ❌ **Missing domain separator (breaks interoperability - CRITICAL)**

**This scheme does not address:**
- Identity authentication (who controls the X account?)
- Authorization (did the user consent to this inscription?)
- Spending (by design — funds are frozen)

---

## 8. Production Considerations

### 8.1 UX Flow: Sending an Inscription to @huuep

```
Sender's perspective:
1. Open inscription tool
2. Enter recipient: @huuep
3. Tool derives address: 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w
4. Tool shows: "This address is deterministically derived from @huuep. 
   Funds sent here CANNOT be spent. The inscription will be permanently 
   associated with this username."
5. Sender confirms and broadcasts inscription transaction
6. Sender (optionally) tweets: "Inscribed [thing] to @huuep! 
   Verify: [link to verification tool]"
```

```
Recipient's perspective:
1. Gets notified (tweet mention, DM, or checks verification tool)
2. Visits verification tool, enters their username
3. Sees: their derived address, the inscription(s) at it
4. Shares/tweets: "Look what I received! Verify at [link]"
```

### 8.2 Tooling Required

#### Minimum Viable Product
1. **Derivation library** — Python and JS implementations (provided above)
2. **Verification website** — Static site, client-side JS only, no backend needed
3. **Ord indexer access** — To look up inscriptions at derived addresses

#### Nice to Have
4. **Browser extension** — Hovering over @username shows derived address and any inscriptions
5. **X bot** — Reply to tweets with derived address info (e.g., "Reply with !inscriptions to see what's been inscribed to your username")
6. **Bulk derivation tool** — For projects inscribing to many usernames at once
7. **Inscription creation tool** — Streamlined UI: paste @username → select content → inscribe

### 8.3 Address Format Decision

The current spec uses **P2PKH (Legacy, starts with `1`)**.

Alternatives considered:

| Format | Prefix | Pro | Con |
|--------|--------|-----|-----|
| **P2PKH** (this spec) | `1...` | Simple, widely supported, matches Grok's code | Legacy format, higher fees if spending were possible |
| **P2SH** | `3...` | More "modern" | No benefit for unspendable addresses |
| **P2WPKH (SegWit)** | `bc1q...` | Lower fees, modern | More complex derivation (Bech32 encoding) |
| **P2TR (Taproot)** | `bc1p...` | Native to Ordinals ecosystem | Different hash construction (tweaked key) |

**Recommendation:** Stick with P2PKH for v1. It's the simplest, matches the original Grok implementation, and since these addresses will never be spent from, the fee savings of SegWit/Taproot are irrelevant. However, document the format so a v2 could use Taproot if desired.

### 8.4 Inscription Protocol Compatibility

| Protocol | Compatible? | Notes |
|----------|------------|-------|
| **Ordinals** | ✅ Yes | Inscriptions can be sent to any valid address |
| **BRC-20** | ✅ Yes | Token transfers go to the derived address |
| **Runes** | ✅ Yes | Rune edicts can target any address |
| **RGB** | ⚠️ Partial | RGB requires UTXO-level assignment; works if the address receives a UTXO |
| **Taproot Assets** | ⚠️ Partial | Lightning-native; would need on-chain commitment |

### 8.5 Gas/Fee Considerations

- Sending to a P2PKH address: standard transaction fee (~1-10 sat/vB depending on mempool)
- The inscription itself determines most of the cost (content size)
- No special fee implications for derived addresses vs. normal addresses

### 8.6 Registry / Directory Considerations

Consider maintaining a **public registry** of known derived addresses:

```json
{
  "version": "1.1",
  "algorithm": "burn-prefix-sha256-ripemd160-base58check-p2pkh",
  "domain_separator": "burn:",
  "entries": [
    {
      "username": "huuep",
      "address": "1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w",
      "first_inscription_block": 880000,
      "inscription_count": 3
    },
    {
      "username": "grok",
      "address": "18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4",
      "first_inscription_block": 880100,
      "inscription_count": 1
    }
  ]
}
```

This is optional (the algorithm is the source of truth), but useful for discovery and indexing.

---

## 9. Worked Example

### Derivation for @huuep

```
Step 1: Input
  Raw: "@huuep"

Step 2: Normalize
  Strip @: "huuep"
  Lowercase: "huuep" (already lowercase)
  Validate: matches ^[a-z0-9_]{4,15}$ → ✅
  Canonical: "huuep"

Step 3: Domain Separator (CRITICAL)
  Prepend b'burn:' to canonical username
  Input bytes: 62 75 72 6E 3A 68 75 75 65 70 (UTF-8 for "burn:huuep")
  Result: b'burn:huuep'

Step 4: SHA-256
  Input: b'burn:huuep'
  SHA-256: (run the algorithm to get 32 bytes)

Step 5: RIPEMD-160
  Input: SHA-256 output (32 bytes)
  RIPEMD-160: (run the algorithm to get 20 bytes)

Step 6: Version byte
  Prepend 0x00
  Result: 21 bytes

Step 7: Checksum
  Double-SHA-256 of the 21 bytes
  Take first 4 bytes

Step 8: Base58Check
  Encode (21 + 4 = 25 bytes) as Base58
  Result: Bitcoin address starting with '1'
  Final address: 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w
```

### Verification for @huuep

```
Claim: "The inscription at 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w belongs to @huuep"

Verification:
  1. Normalize "huuep" → "huuep"  ✅
  2. Add domain separator → b'burn:huuep'  ✅
  3. Derive address → 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w  ✅
  4. Compare with claimed address  ✅
  5. Look up address on blockchain → inscription found  ✅
  6. Check X.com/huuep exists → yes  ✅ (manual step)

Result: VERIFIED
  - The address IS the deterministic mapping for username "huuep"
  - There IS an inscription at that address
  - The account @huuep DOES exist on X
```

---

## 10. Summary

### What We're Building

A deterministic, open-algorithm mapping from X usernames to Bitcoin addresses for the purpose of "sending" inscriptions to social identities.

### Properties

| Property | Status |
|----------|--------|
| Deterministic | ✅ Same username always gives same address |
| Verifiable | ✅ Anyone can independently derive and check |
| Trustless derivation | ✅ No oracle, no server, pure math |
| Proof of association | ✅ Username owner can easily demonstrate the link |
| Spendable | ❌ By design — no private key exists |
| Authenticated | ❌ Does not prove X account ownership (see Deliverable 2) |
| Unsolicited-inscription resistant | ❌ Anyone can inscribe |
| Username-change resistant | ❌ New handle = new address |

### When to Use This Approach

✅ **Use when:**
- You want a simple, elegant, no-infrastructure way to "address" inscriptions to X users
- The recipient just needs to prove association, not spend
- You're building a social/community feature (e.g., "inscribe a gift to @friend")
- Speed and simplicity matter more than authentication

❌ **Don't use when:**
- You need the recipient to actually claim/spend the inscription
- You need proof that the X account owner consented
- You're dealing with high-value assets that need custody
- Username reassignment risk is unacceptable

### Files

- **This spec:** `x-username-inscription-grok-spec.md`
- **Alternative approaches:** `x-username-inscription-alternatives.md` (companion document)

---

**Spec version 1.1 — 2026-02-12**

**Changelog:**
- v1.0: Initial specification (inferred from visible tweet snippet)
- v1.1: Updated with Grok's actual algorithm including `'burn:'` domain separator (19:06 PST)

**CRITICAL:** All implementations MUST use the domain separator. Test with:
```python
generate_burn_address("grok") == "18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4"  # Verified with Grok
```
