from cryptography.fernet import Fernet

def encrypt(value: str):
    # api req key from backend 
    # use key to encrypt 

    key = Fernet.generate_key()
    cipher_suite = Fernet(key)
    encoded_key = cipher_suite.encrypt(value.encode())
    # print(key.decode("base64"))
    return encoded_key.decode('utf-8')
    # key,
    
    
def decrypt(key: bytes, encoded_key: bytes):
    
    cipher_suite = Fernet(key)
    decoded_key = cipher_suite.decrypt(encoded_key)
    return decoded_key.decode()

from argparse import ArgumentParser
import os
import re

# parser = ArgumentParser()
# parser.add_argument('directory', type=str, default=os.getcwd(), help='Directory containing files to process')
# args = parser.parse_args() # make them usable


# def encrypt(m):
#     return m.group(0) + 'test'


def process_file(file_path):
    # A basic pattern that might match API keys (e.g., alphanumeric, often with underscores or dashes)
    # api_key_pattern = re.compile(r'[A-Za-z0-9-_]{32,}')

    api_key_pattern = re.compile(r"api", re.IGNORECASE)
    found_keys = []

    try:
        with open(file_path, "r") as file:
            # Read the file content
            content = file.read()

        # Use re.sub to replace all occurrences of the pattern in the content
        modified_content = re.sub(
            api_key_pattern, lambda m: encrypt(m.group(0)), content
        )

        # Append found keys (all matches) to the list
        found_keys.extend(api_key_pattern.findall(content))

        # Write the modified content back to the file
        with open(file_path, "w") as file:
            file.write(modified_content)
      

    except Exception as e:
        print(f"Could not read file {file_path}: {e}")

    return found_keys


def main():
    directory = "./"  # Current directory

    #   Check if the directory exists
    if not os.path.isdir(directory):
        print(f"Error: The directory {directory} does not exist.")
    else:
        # Iterate through all files in the specified directory
        for root, _, files in os.walk(directory):
            print("files", files)
            for file in files:
                if os.path.realpath(os.path.join(root, file)) == __file__:
                    continue
                
                file_path = os.path.join(root, file)
                print(process_file(file_path))


if __name__ == "__main__":
    main()