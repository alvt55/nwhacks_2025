# Example of a Stripe test key
stripe_test_key = "sk_test_abcdef1234567890abcdef1234567890"

# Another key for JWT-based authentication

def charge_customer(amount, currency="usd"):
    # Simulate charging a customer
    print(f"Charging ${amount} {currency}...")

    if amount > 0:
        print(f"Payment of ${amount} {currency} was successful!")
        return True
    else:
        print("Payment failed: Invalid amount.")
        return False

def process_payment():
    # Example of using Stripe API to process payment
    amount_to_charge = 50  # Amount in USD
    print(f"Using Stripe Test API Key: {stripe_test_key}")
    success = charge_customer(amount_to_charge)
    
    if success:
        print("Payment processed successfully.")
    else:
        print("Payment failed.")

# Simulate processing a payment
process_payment()