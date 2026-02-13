# X Username → Bitcoin Inscription Address Derivation

Generate deterministic Bitcoin addresses from X (Twitter) usernames for sending inscriptions, Runes, and BRC-20 tokens.

## Overview

This tool implements Grok's canonical algorithm for deriving Bitcoin P2PKH addresses from X usernames. The derived addresses can be used to send Bitcoin inscriptions to social identities in a trustless, verifiable way.

**Key Properties:**
- ✅ **Deterministic** - Same username always produces same address
- ✅ **Verifiable** - Anyone can independently verify the derivation
- ✅ **Trustless** - Pure mathematics, no oracle or server required
- ✅ **On-chain Compatible** - Works with Ordinals, Runes, BRC-20
- ⚠️ **Unspendable** - No private key exists (by design)

## Algorithm

```
Username (e.g., "grok")
    ↓
Normalize (lowercase, strip @, validate)
    ↓
Add domain separator: b'burn:' + username
    ↓
SHA-256(b'burn:username')
    ↓
RIPEMD-160(SHA-256 output)
    ↓
Version byte (0x00) + RIPEMD-160
    ↓
Checksum (first 4 bytes of SHA-256(SHA-256(versioned)))
    ↓
Base58Check encode
    ↓
Bitcoin P2PKH Address (starts with "1")
```

**Example:**
```
Username: "grok"
Address:  18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4
```

## Quick Start

### Web Tool (Easiest)

**Try it now:** Open `web/index.html` in your browser (no installation needed!)

**Live demo:** [GitHub Pages link coming soon]

**On Bitcoin:** The tool is also available as an inscription for permanent, on-chain access.

### Python

```bash
cd python
pip install -r requirements.txt
python x_username_address.py grok
```

Output:
```
Username: grok
Address: 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4
```

### TypeScript/JavaScript

```bash
cd typescript
npm install
npm run build
node dist/index.js grok
```

Output:
```
Username: grok
Address: 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4
```

## Usage

### As a Library (Python)

```python
from x_username_address import username_to_address, verify_username_address

# Generate address
address = username_to_address("grok")
print(address)  # 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4

# Verify address
is_valid = verify_username_address("grok", "18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4")
print(is_valid)  # True
```

### As a Library (TypeScript)

```typescript
import { usernameToAddress, verifyUsernameAddress } from './x-username-address';

// Generate address
const address = usernameToAddress('grok');
console.log(address);  // 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4

// Verify address
const isValid = verifyUsernameAddress('grok', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
console.log(isValid);  // true
```

## Testing

### Python Tests

```bash
cd python
python -m pytest test_x_username_address.py -v
```

### TypeScript Tests

```bash
cd typescript
npm test
```

Both test suites include the canonical "grok" test vector to ensure compliance with the specification.

## Critical: Domain Separator

⚠️ **All implementations MUST use the `b'burn:'` domain separator.**

This is essential for:
- Preventing cross-protocol hash collisions
- Following cryptographic best practices
- Ensuring ecosystem interoperability

**Test Vector:**
```
username_to_address("grok") MUST equal "18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4"
```

Any implementation that produces a different address is **non-compliant**.

## Input Normalization

**Canonical form:**
```
lowercase(strip_leading_@(trim(username)))
```

**Validation:**
```
^[a-z0-9_]{4,15}$
```

**Examples:**
```
@Grok     → "grok"     ✅
GROK      → "grok"     ✅
 grok     → "grok"     ✅
@@grok    → "@grok"    ⚠️ (strip only ONE @)
gro k     → INVALID    ❌ (spaces not allowed)
gr        → INVALID    ❌ (too short, min 4 chars)
```

## Use Cases

✅ **Good Use Cases:**
- Sending inscription gifts to X users
- Community airdrops based on social identity
- Social proof-of-receipt (user proves "this is mine")
- Building verifiable on-chain social graphs

❌ **Not Suitable For:**
- High-value assets requiring custody
- Situations where the recipient must spend
- Cases where username reassignment is unacceptable
- Applications requiring authenticated consent

## Security Considerations

### What This Provides
- ✅ Deterministic address derivation
- ✅ Public verifiability
- ✅ Cross-protocol collision resistance (via domain separator)

### What This Does NOT Provide
- ❌ Proof of X account ownership (requires OAuth, see alternatives doc)
- ❌ Ability to spend (no private key exists)
- ❌ Protection against username reassignment
- ❌ Prevention of unsolicited inscriptions

### Known Limitations
1. **Username reassignment**: If X reassigns @username to a new user, they inherit the derived address
2. **Unsolicited inscriptions**: Anyone can send to any derived address
3. **No spending**: Funds sent are permanently locked (statistical burn)

## Documentation

- **[SPECIFICATION.md](docs/SPECIFICATION.md)** - Complete technical specification
- **[ALTERNATIVES.md](docs/ALTERNATIVES.md)** - Alternative approaches comparison
- **[FAQ.md](docs/FAQ.md)** - Frequently asked questions

## Examples

See the `examples/` directory for:
- Batch address generation
- Verification tool
- Integration examples

## Contributing

This implementation follows the canonical specification defined in `docs/SPECIFICATION.md`. All contributions must:
1. Include tests (including the "grok" test vector)
2. Pass existing test suites
3. Follow the domain separator requirement
4. Document any deviations from the spec

## License

MIT License - See LICENSE file

## Credits

- **Original Idea & Algorithm**: [Grok (@xai)](https://x.com/grok/status/2022126474275221884) - The canonical algorithm for deriving Bitcoin addresses from X usernames
- **Specification**: Documented by Metagood team
- **Implementation**: OCM Dimensions contributors

## References

- [OCM Dimensions](https://github.com/metagood/OCM-Dimensions)
- [Bitcoin Ordinals](https://docs.ordinals.com/)
- [X (Twitter) Username Rules](https://help.twitter.com/en/managing-your-account/twitter-username-rules)

---

**⚠️ Important:** Addresses generated by this tool have no corresponding private key. Funds sent to these addresses cannot be recovered. This is by design for proof-of-association use cases.
