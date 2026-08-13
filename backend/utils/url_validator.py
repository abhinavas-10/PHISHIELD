import ipaddress
from urllib.parse import urlparse

import validators


ALLOWED_SCHEMES = {"http", "https"}


def validate_url(url):
    """Validate a URL before sending it to the ML pipeline."""

    if not isinstance(url, str):
        return False, "URL must be provided as text."

    url = url.strip()

    if not url:
        return False, "URL cannot be empty."

    if len(url) > 2048:
        return False, "URL is too long."

    if any(character.isspace() for character in url):
        return False, "URL cannot contain spaces."

    parsed = urlparse(url)

    if parsed.scheme.lower() not in ALLOWED_SCHEMES:
        return False, "URL must start with http:// or https://."

    if not parsed.netloc:
        return False, "URL must contain a valid domain."

    if not validators.url(url):
        return False, "Please enter a valid URL."

    hostname = parsed.hostname

    if not hostname:
        return False, "URL does not contain a valid hostname."

    try:
        ipaddress.ip_address(hostname)
    except ValueError:
        pass

    return True, "URL is valid."


def normalize_url(url):
    """Remove unnecessary whitespace from a URL."""

    return url.strip()