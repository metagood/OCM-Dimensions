#!/usr/bin/env python3
"""
Tests for X Username → Bitcoin Address Derivation

Includes the canonical "grok" test vector to ensure spec compliance.
"""

import pytest
from x_username_address import (
    normalize_username,
    username_to_address,
    verify_username_address,
    batch_generate,
    base58_encode
)


class TestNormalization:
    """Test username normalization."""
    
    def test_already_canonical(self):
        """Username already in canonical form."""
        assert normalize_username('grok') == 'grok'
        assert normalize_username('huuep') == 'huuep'
    
    def test_strip_at_sign(self):
        """Strip leading @ symbol."""
        assert normalize_username('@grok') == 'grok'
        assert normalize_username('@huuep') == 'huuep'
    
    def test_lowercase_conversion(self):
        """Convert to lowercase."""
        assert normalize_username('GROK') == 'grok'
        assert normalize_username('Grok') == 'grok'
        assert normalize_username('GRoK') == 'grok'
    
    def test_strip_whitespace(self):
        """Strip leading/trailing whitespace."""
        assert normalize_username(' grok ') == 'grok'
        assert normalize_username('\tgrok\n') == 'grok'
    
    def test_combined_normalization(self):
        """Multiple normalizations at once."""
        assert normalize_username(' @GROK ') == 'grok'
        assert normalize_username('\t@Huuep\n') == 'huuep'
    
    def test_double_at_sign(self):
        """Double @ should strip only the first one."""
        assert normalize_username('@@grok') == '@grok'
    
    def test_underscore_allowed(self):
        """Underscores are valid."""
        assert normalize_username('user_name') == 'user_name'
        assert normalize_username('test_123') == 'test_123'
    
    def test_too_short(self):
        """Username too short (< 4 chars)."""
        with pytest.raises(ValueError, match="Invalid X username"):
            normalize_username('abc')
        with pytest.raises(ValueError, match="Invalid X username"):
            normalize_username('gro')
    
    def test_too_long(self):
        """Username too long (> 15 chars)."""
        with pytest.raises(ValueError, match="Invalid X username"):
            normalize_username('a' * 16)
    
    def test_invalid_characters(self):
        """Invalid characters not allowed."""
        with pytest.raises(ValueError, match="Invalid X username"):
            normalize_username('user name')  # space
        with pytest.raises(ValueError, match="Invalid X username"):
            normalize_username('user-name')  # hyphen
        with pytest.raises(ValueError, match="Invalid X username"):
            normalize_username('user.name')  # period
        with pytest.raises(ValueError, match="Invalid X username"):
            normalize_username('user!name')  # exclamation


class TestAddressDerivation:
    """Test Bitcoin address derivation."""
    
    def test_grok_canonical_vector(self):
        """CRITICAL: Test the canonical 'grok' test vector.
        
        This is the reference implementation test vector defined by Grok.
        All compliant implementations MUST pass this test.
        """
        address = username_to_address('grok')
        assert address == '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4', \
            f"FAIL: grok derivation incorrect. Got {address}, expected 18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4"
    
    def test_grok_with_at_sign(self):
        """Test grok with @ prefix (should normalize to same result)."""
        address = username_to_address('@grok')
        assert address == '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
    
    def test_grok_uppercase(self):
        """Test GROK in uppercase (should normalize to same result)."""
        address = username_to_address('GROK')
        assert address == '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
    
    def test_grok_mixed_case_with_at(self):
        """Test @Grok with mixed case (should normalize to same result)."""
        address = username_to_address('@Grok')
        assert address == '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
    
    def test_huuep(self):
        """Test another known username."""
        address = username_to_address('huuep')
        assert address == '1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w'
    
    def test_deterministic(self):
        """Same username always produces same address."""
        addr1 = username_to_address('test_user')
        addr2 = username_to_address('test_user')
        assert addr1 == addr2
    
    def test_different_usernames_different_addresses(self):
        """Different usernames produce different addresses."""
        addr1 = username_to_address('user1')
        addr2 = username_to_address('user2')
        assert addr1 != addr2
    
    def test_address_format(self):
        """All addresses should start with '1' (P2PKH)."""
        address = username_to_address('grok')
        assert address.startswith('1')
        assert len(address) >= 26  # Minimum Bitcoin address length
        assert len(address) <= 35  # Maximum Bitcoin address length
    
    def test_case_sensitivity(self):
        """Normalization should make derivation case-insensitive."""
        addr_lower = username_to_address('testuser')
        addr_upper = username_to_address('TESTUSER')
        addr_mixed = username_to_address('TestUser')
        assert addr_lower == addr_upper == addr_mixed


class TestVerification:
    """Test address verification."""
    
    def test_verify_grok(self):
        """Verify the canonical grok address."""
        assert verify_username_address('grok', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4') is True
    
    def test_verify_grok_wrong_address(self):
        """Grok with wrong address should fail."""
        assert verify_username_address('grok', '1FakeAddress') is False
    
    def test_verify_huuep(self):
        """Verify huuep address."""
        assert verify_username_address('huuep', '1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w') is True
    
    def test_verify_invalid_username(self):
        """Invalid username should return False."""
        assert verify_username_address('invalid!', 'any_address') is False
    
    def test_verify_case_insensitive(self):
        """Verification should work with any case variation."""
        assert verify_username_address('@GROK', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4') is True
        assert verify_username_address('Grok', '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4') is True


class TestBatchGeneration:
    """Test batch address generation."""
    
    def test_batch_valid_usernames(self):
        """Generate addresses for multiple valid usernames."""
        results = batch_generate(['grok', 'huuep', 'test_user'])
        assert len(results) == 3
        assert results['grok'] == '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
        assert results['huuep'] == '1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w'
        assert results['test_user'] is not None
    
    def test_batch_mixed_valid_invalid(self):
        """Mix of valid and invalid usernames."""
        results = batch_generate(['grok', 'invalid!', 'huuep', 'ab'])
        assert results['grok'] == '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
        assert results['invalid!'] is None
        assert results['huuep'] == '1nZpo9Zb84wWDCKAwD2mD8xoUvNAdkD1w'
        assert results['ab'] is None
    
    def test_batch_empty_list(self):
        """Empty list should return empty dict."""
        results = batch_generate([])
        assert results == {}


class TestBase58Encoding:
    """Test Base58 encoding."""
    
    def test_base58_preserves_leading_zeros(self):
        """Leading zero bytes should be preserved as '1' characters."""
        # One leading zero byte
        result = base58_encode(b'\x00\x01\x02\x03')
        assert result.startswith('1')
        
        # Multiple leading zero bytes
        result = base58_encode(b'\x00\x00\x01\x02\x03')
        assert result.startswith('11')
    
    def test_base58_no_leading_zeros(self):
        """No leading zeros should not add extra '1' characters."""
        result = base58_encode(b'\x01\x02\x03')
        assert not result.startswith('1') or len(result) == 1


class TestDomainSeparator:
    """Test that domain separator is being used correctly."""
    
    def test_domain_separator_required(self):
        """Without domain separator, addresses would be different.
        
        This test verifies that the domain separator is actually being used
        by checking that we DON'T get the address that would result from
        hashing the username directly without the 'burn:' prefix.
        """
        # If we were NOT using the domain separator, "grok" would hash to
        # a different address. This test ensures we're using it.
        address = username_to_address('grok')
        
        # The address with domain separator
        assert address == '18Sx2KpH3P8LFgYD42PC6X3phZK7vcMY4'
        
        # NOT the address without domain separator (this would be wrong)
        assert address != '1GaZWnk3b9ZPvfYoW5nPhCYxzJtxd7NTYA'


class TestEdgeCases:
    """Test edge cases and boundary conditions."""
    
    def test_minimum_length_username(self):
        """4-character username (minimum allowed)."""
        address = username_to_address('abcd')
        assert address is not None
        assert address.startswith('1')
    
    def test_maximum_length_username(self):
        """15-character username (maximum allowed)."""
        address = username_to_address('a' * 15)
        assert address is not None
        assert address.startswith('1')
    
    def test_all_numbers(self):
        """Username with all numbers."""
        address = username_to_address('12345')
        assert address is not None
    
    def test_all_underscores_numbers(self):
        """Username with numbers and underscores."""
        address = username_to_address('1_2_3_4_5')
        assert address is not None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
