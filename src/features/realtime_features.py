def amount_vs_avg(
    amount,
    avg_amount
):

    if avg_amount == 0:
        return 0

    return round(
        amount / avg_amount,
        2
    )


def country_changed(
    tx_country,
    home_country
):

    return int(
        tx_country != home_country
    )


