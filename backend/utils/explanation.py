def generate_explanation(features, prediction):
    """
    Generate human-readable security explanations
    from URL features.
    """

    reasons = []
    warnings = []

    # URL length
    if features["url_length"] > 100:
        warnings.append(
            "The URL is unusually long."
        )
    elif features["url_length"] <= 75:
        reasons.append(
            "The URL has a relatively normal length."
        )

    # HTTPS
    if features["has_https"]:
        reasons.append(
            "The URL uses HTTPS."
        )
    else:
        warnings.append(
            "The URL does not use HTTPS."
        )

    # IP address
    if features["has_ip_address"]:
        warnings.append(
            "The URL uses an IP address instead of a domain name."
        )
    else:
        reasons.append(
            "The URL uses a domain name rather than a raw IP address."
        )

    # Subdomains
    if features["subdomain_count"] >= 3:
        warnings.append(
            "The URL contains multiple subdomains."
        )
    elif features["subdomain_count"] <= 1:
        reasons.append(
            "The URL has a relatively simple domain structure."
        )

    # Suspicious keywords
    if features["suspicious_keyword_count"] > 0:
        warnings.append(
            "The URL contains potentially suspicious keywords."
        )
    else:
        reasons.append(
            "No common phishing-related keywords were detected."
        )

    # @ symbol
    if features["has_at_symbol"]:
        warnings.append(
            "The URL contains an @ symbol, which can be used in deceptive URLs."
        )

    # Double slash
    if features["has_double_slash"]:
        warnings.append(
            "The URL contains an unusual double-slash pattern."
        )

    # Port
    if features["has_port"]:
        warnings.append(
            "The URL specifies a custom network port."
        )

    # Special characters
    if features["special_character_count"] > 15:
        warnings.append(
            "The URL contains a high number of special characters."
        )

    # Digits
    if features["digit_count"] > 10:
        warnings.append(
            "The URL contains an unusually high number of digits."
        )

    # Entropy
    if features["url_entropy"] > 4.5:
        warnings.append(
            "The URL contains a relatively high level of character randomness."
        )

    # Ensure we always have useful information.
    if not reasons and not warnings:
        reasons.append(
            "No obvious suspicious URL characteristics were detected."
        )

    # Prediction-specific summary
    if prediction == "Phishing":
        summary = (
            "The machine-learning model classified this URL "
            "as potentially phishing based on its extracted URL characteristics."
        )
    else:
        summary = (
            "The machine-learning model classified this URL "
            "as likely legitimate based on its extracted URL characteristics."
        )

    return {
        "summary": summary,
        "reasons": reasons,
        "warnings": warnings,
    }