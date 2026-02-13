# Web Tool: X Username → Bitcoin Address

Interactive web-based tool for generating Bitcoin addresses from X usernames.

## Features

- ✅ Pure client-side JavaScript (no server required)
- ✅ Works offline once loaded
- ✅ Full implementation of Grok's canonical algorithm with `'burn:'` domain separator
- ✅ Mobile-responsive design
- ✅ Zero dependencies (uses Web Crypto API + pure JS RIPEMD-160)

## Files

### `index.html` (14.7 KB)
Full-featured web interface with:
- Clean, modern UI
- Error handling and validation
- Educational warnings about unspendable addresses
- Links to source and algorithm credit
- **Use for:** GitHub Pages hosting, local development, sharing

### `inscription.html` (5.8 KB)
Inscription-optimized version:
- Minified and compact
- Fully self-contained single file
- Same functionality, smaller footprint
- Dark theme optimized for Bitcoin ordinals viewers
- **Use for:** Inscribing on Bitcoin as an ordinal

## Usage

### GitHub Pages

1. Enable GitHub Pages for this repository
2. Access at: `https://metagood.github.io/OCM-Dimensions/tools/x-username-addresses/web/`

### Local Development

```bash
# Serve locally
python3 -m http.server 8000
# Open http://localhost:8000/tools/x-username-addresses/web/
```

Or just open `index.html` directly in your browser (file:// protocol works).

### As a Bitcoin Inscription

The `inscription.html` file is optimized for inscribing:

```bash
# Using ord wallet
ord wallet inscribe inscription.html

# Result: Permanent, on-chain address generator
# Anyone can use it by viewing the inscription
```

**Inscription benefits:**
- Tool lives permanently on Bitcoin
- No hosting required (served from blockchain)
- Censorship-resistant
- Zero maintenance

## How It Works

1. **Input normalization:** Strips `@`, converts to lowercase, validates format
2. **Domain separation:** Prepends `'burn:'` to username
3. **Hashing:** SHA-256 → RIPEMD-160
4. **Address encoding:** Version byte (0x00) + checksum + Base58Check

**Example:**
```
Input:  "grok"
Domain: "burn:grok"
Output: 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4
```

## Implementation Notes

### RIPEMD-160
Web Crypto API doesn't support RIPEMD-160, so we include a pure JavaScript implementation. This is the same algorithm used by Bitcoin Core and is fully compatible with the Python/TypeScript implementations in this repository.

### Security
- All computation happens client-side
- No network requests after page load
- No private keys generated or stored
- Open source and auditable

## Testing

Test vectors (should match Python/TypeScript implementations):

```javascript
await addr("grok")     // 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4
await addr("huuep")    // 1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w
await addr("test_user")// 1P3KCN8tnhBeHTn6y7VwnjZbfbBFwvX3Ez
```

## Browser Compatibility

- ✅ Chrome/Edge 60+
- ✅ Firefox 57+
- ✅ Safari 11.1+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires:
- Web Crypto API (`crypto.subtle`)
- BigInt support
- ES6+ features

## File Sizes

| File | Size | Use Case |
|------|------|----------|
| `index.html` | 14.7 KB | GitHub Pages, sharing |
| `inscription.html` | 5.8 KB | Bitcoin inscription |

Both compress well with gzip (typical: ~4KB and ~2KB respectively).

## Credits

- **Algorithm:** [Grok (@xai)](https://x.com/grok/status/2022126474275221884)
- **Web Implementation:** OCM Dimensions team
- **RIPEMD-160:** Based on Bitcoin Core reference implementation

## License

MIT License (same as parent repository)
