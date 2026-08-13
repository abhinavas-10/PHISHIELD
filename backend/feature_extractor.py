import ipaddress
import math
import re
from collections import Counter
from urllib.parse import urlparse


SUSPICIOUS_KEYWORDS = {
    "login",
    "signin",
    "verify",
    "verification",
    "account",
    "secure",
    "security",
    "update",
    "confirm",
    "confirmation",
    "password",
    "credential",
    "bank",
    "paypal",
    "wallet",
    "bonus",
    "free",
    "claim",
    "gift",
    "prize",
    "recover",
    "suspended",
    "unlock",
}


def calculate_entropy(value: str) -> float:
    """Calculate Shannon entropy for a string."""

    if not value:
        return 0.0

    counts = Counter(value)
    length = len(value)

    entropy = 0.0

    for count in counts.values():
        probability = count / length
        entropy -= probability * math.log2(probability)

    return entropy


def has_ip_address(hostname: str) -> int:
    """Return 1 if the hostname is an IPv4 or IPv6 address."""

    if not hostname:
        return 0

    try:
        ipaddress.ip_address(hostname)
        return 1
    except ValueError:
        return 0


def count_suspicious_keywords(url: str) -> int:
    """Count suspicious keywords appearing in the URL."""

    url_lower = url.lower()

    return sum(
        1
        for keyword in SUSPICIOUS_KEYWORDS
        if keyword in url_lower
    )


def count_subdomains(hostname: str) -> int:
    """Count subdomains in a hostname."""

    if not hostname:
        return 0

    hostname = hostname.split(":")[0].lower()

    parts = hostname.split(".")

    if len(parts) <= 2:
        return 0

    return len(parts) - 2


def extract_features(url: str) -> dict:
    """
    Extract security-related features from a URL.

    Returns a dictionary containing numerical URL features.
    """

    parsed = urlparse(url)

    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""

    special_characters = re.findall(
        r"[^a-zA-Z0-9]",
        url,
    )

    digits = re.findall(r"\d", url)

    letters = re.findall(r"[a-zA-Z]", url)

    features = {
        "url_length": len(url),

        "hostname_length": len(hostname),

        "path_length": len(path),

        "query_length": len(query),

        "has_https": int(parsed.scheme.lower() == "https"),

        "has_ip_address": has_ip_address(hostname),

        "subdomain_count": count_subdomains(hostname),

        "dot_count": url.count("."),

        "hyphen_count": url.count("-"),

        "slash_count": url.count("/"),

        "question_mark_count": url.count("?"),

        "equals_count": url.count("="),

        "at_symbol_count": url.count("@"),

        "ampersand_count": url.count("&"),

        "percent_count": url.count("%"),

        "digit_count": len(digits),

        "letter_count": len(letters),

        "special_character_count": len(special_characters),

        "suspicious_keyword_count": (
            count_suspicious_keywords(url)
        ),

        "has_at_symbol": int("@" in url),

        "has_double_slash": int("//" in url[8:]),

        "has_port": int(parsed.port is not None),

        "url_entropy": calculate_entropy(url),
    }

    return features


def feature_names() -> list[str]:
    """Return features in a consistent order."""

    return [
        "url_length",
        "hostname_length",
        "path_length",
        "query_length",
        "has_https",
        "has_ip_address",
        "subdomain_count",
        "dot_count",
        "hyphen_count",
        "slash_count",
        "question_mark_count",
        "equals_count",
        "at_symbol_count",
        "ampersand_count",
        "percent_count",
        "digit_count",
        "letter_count",
        "special_character_count",
        "suspicious_keyword_count",
        "has_at_symbol",
        "has_double_slash",
        "has_port",
        "url_entropy",
    ]