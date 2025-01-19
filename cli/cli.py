from cryptography.fernet import Fernet

def main():
    print("Hello World!")


if __name__ == "__main__":
    main()

def encrypt(value: str):
    key = Fernet.generate_key()
    cipher_suite = Fernet(key)
    encoded_key = cipher_suite.encrypt(value.encode())
    return key, encoded_key
    
def decrypt(key: bytes, encoded_key: bytes):
    cipher_suite = Fernet(key)
    decoded_key = cipher_suite.decrypt(encoded_key)
    return decoded_key.decode()