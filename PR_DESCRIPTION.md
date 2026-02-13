# Pull Request: X Username → Bitcoin Inscription Address Tool

## Summary

This PR adds a new tool to OCM Dimensions for deriving deterministic Bitcoin addresses from X (Twitter) usernames. This enables sending Bitcoin inscriptions, Runes, and BRC-20 tokens to social identities in a trustless, verifiable way.

## What's New

### 📁 `/tools/x-username-addresses/`

A complete implementation of Grok's canonical algorithm for X username → Bitcoin address derivation.

**Features:**
- ✅ Pure deterministic address derivation (no server, no oracle required)
- ✅ Python and TypeScript implementations
- ✅ Comprehensive test suites with canonical test vectors
- ✅ Full technical specification document
- ✅ Example scripts and CLI tools

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
Checksum (double SHA-256)
    ↓
Base58Check encode
    ↓
Bitcoin P2PKH Address
```

**Example:**
```
Username: "grok"
Address:  18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4
```

## Files Added

```
tools/x-username-addresses/
├── README.md                              # Main documentation
├── docs/
│   └── SPECIFICATION.md                   # Complete technical spec
├── python/
│   ├── x_username_address.py             # Python implementation
│   ├── test_x_username_address.py        # Python tests
│   └── requirements.txt                   # Python dependencies
├── typescript/
│   ├── src/
│   │   ├── x-username-address.ts         # TypeScript implementation
│   │   ├── x-username-address.test.ts    # TypeScript tests
│   │   └── index.ts                       # CLI interface
│   ├── package.json                       # NPM config
│   └── tsconfig.json                      # TypeScript config
└── examples/
    └── batch-generate.py                  # Example: batch address generation
```

## Testing

### Python Tests
```bash
cd tools/x-username-addresses/python
pip install -r requirements.txt
python -m pytest test_x_username_address.py -v
```

**Test Coverage:**
- ✅ Canonical "grok" test vector (CRITICAL for spec compliance)
- ✅ Normalization edge cases (case, whitespace, @ stripping)
- ✅ Validation (length, character set)
- ✅ Deterministic property (same input → same output)
- ✅ Domain separator verification
- ✅ Base58 encoding correctness

### TypeScript Tests
```bash
cd tools/x-username-addresses/typescript
npm install
npm test
```

**Test Coverage:**
- ✅ Same comprehensive test suite as Python
- ✅ Canonical "grok" test vector
- ✅ Cross-implementation consistency

## Usage Examples

### Python
```python
from x_username_address import username_to_address, verify_username_address

# Generate address
address = username_to_address("grok")
print(address)  # 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4

# Verify address
is_valid = verify_username_address("grok", "18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4")
print(is_valid)  # True
```

### TypeScript
```typescript
import { usernameToAddress, verifyUsernameAddress } from './x-username-address';

// Generate address
const address = usernameToAddress('grok');
console.log(address);  // 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4

// Verify address
const isValid = verifyUsernameAddress('grok', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4');
console.log(isValid);  // true
```

### CLI
```bash
# Python
python x_username_address.py grok
# Output:
# Username: grok
# Address:  18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4

# TypeScript
npm run build
node dist/index.js grok
# Same output
```

## Critical: Test Vector Compliance

⚠️ **All implementations MUST produce this exact result:**

```
username_to_address("grok") == "18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4"
```

This ensures ecosystem interoperability. The `'burn:'` domain separator is **mandatory**.

## Use Cases

✅ **Good Use Cases:**
- Sending inscription gifts to X users
- Community airdrops based on social identity
- Social proof-of-receipt (user proves "this is mine")
- Building verifiable on-chain social graphs

❌ **Not Suitable For:**
- High-value assets requiring custody (addresses are unspendable)
- Situations where the recipient must spend
- Cases where username reassignment is unacceptable

## Security Considerations

### What This Provides
- ✅ Deterministic address derivation
- ✅ Public verifiability
- ✅ Cross-protocol collision resistance (via domain separator)

### What This Does NOT Provide
- ❌ Proof of X account ownership (requires OAuth)
- ❌ Ability to spend (no private key exists by design)
- ❌ Protection against username reassignment
- ❌ Prevention of unsolicited inscriptions

### Known Limitations
1. **Username reassignment**: If X reassigns @username to a new user, they inherit the derived address
2. **Unsolicited inscriptions**: Anyone can send to any derived address
3. **No spending**: Funds sent are permanently locked (statistical burn, not provably unspendable)

## Documentation

- **README.md** - Quick start and usage guide
- **SPECIFICATION.md** - Complete technical specification (21KB)
- **Examples** - Batch generation and integration examples

## Credits

- **Algorithm**: Designed by Grok (@xai)
- **Specification**: Documented by Metagood team
- **Implementation**: OCM Dimensions contributors

## Checklist

- [x] Python implementation with tests
- [x] TypeScript implementation with tests
- [x] Canonical "grok" test vector in both implementations
- [x] Complete specification document
- [x] README with usage examples
- [x] Example scripts
- [x] All tests passing

## Testing Instructions for Reviewers

1. **Clone the branch:**
   ```bash
   git fetch origin feature/x-username-inscription-addresses
   git checkout feature/x-username-inscription-addresses
   ```

2. **Test Python implementation:**
   ```bash
   cd tools/x-username-addresses/python
   pip install -r requirements.txt
   python -m pytest test_x_username_address.py -v
   ```

3. **Test TypeScript implementation:**
   ```bash
   cd tools/x-username-addresses/typescript
   npm install
   npm test
   ```

4. **Verify test vector:**
   ```bash
   # Python
   python x_username_address.py grok
   
   # TypeScript
   npm run build && node dist/index.js grok
   
   # Both should output:
   # Username: grok
   # Address:  18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4
   ```

## Future Enhancements

Potential future additions (not in this PR):
- Web-based verification tool
- Alternative authentication methods (X OAuth attestation)
- Integration with ord/bitcoin-cli for inscription creation
- Browser extension

---

**Note:** Addresses generated by this tool have no corresponding private key. Funds sent to these addresses cannot be recovered. This is by design for proof-of-association use cases.
