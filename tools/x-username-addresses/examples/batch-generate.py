#!/usr/bin/env python3
"""
Example: Batch generate addresses for multiple X usernames
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'python'))

from x_username_address import batch_generate

# List of X usernames to generate addresses for
usernames = [
    'grok',
    'huuep',
    'onchainmonkey',
    'metagood',
    'test_user_123',
    'btc_maxi',
]

print("Generating Bitcoin addresses for X usernames...\n")
print(f"{'Username':<20} {'Bitcoin Address'}")
print("-" * 75)

results = batch_generate(usernames)

for username, address in results.items():
    if address:
        print(f"{username:<20} {address}")
    else:
        print(f"{username:<20} [INVALID USERNAME]")

print(f"\nTotal: {len([a for a in results.values() if a])} valid addresses generated")
