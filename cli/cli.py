from fernet import Fernet
from argparse import ArgumentParser
import os
import re

import requests
import json 

import subprocess

def encrypt(value: str):
   
    # res = requests.get('google.com')
    # response = json.loads(res.text)
    # encryptKey = response.data.key 
    
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



def process_file(file_path):


    patterns = [
    r"^[a-zA-Z0-9]{32}$",  # Standard 32-character key
    r"^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$",  # Key with dashes
    r"^[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}$",  # Base64-like JWT key
     r"sk_(test|live)_[a-zA-Z0-9]{32}"  # Stripe API key (test or live)
    ]
    
    # key_pattern = re.compile(r"api", re.IGNORECASE)
    found_keys = []

    try:
        with open(file_path, "r") as file:
            # Read the file content
            content = file.read()
        
        modified_content = ""

        # Use re.sub to replace all occurrences of the pattern in the content
        for pattern in patterns:
            pattern = re.compile(pattern)
            modified_content = re.sub(
                pattern, lambda m: encrypt(m.group(0)), content)
            found_keys.extend(pattern.findall(content))

        # Write the modified content back to the file
        with open(file_path, "w") as file:
            file.write(modified_content)
      

    except Exception as e:
        print(f"Could not read file {file_path}: {e}")

    return found_keys




def main():
    

    
    directory = "./"  # Current directory
    
    # list of files tracked, not in gitignore
    list_of_bytes= subprocess.check_output("git ls-files", shell=True).splitlines()
    list_of_files = [byte.decode('utf-8') for byte in list_of_bytes]
    print(list_of_files)

    #   Check if the directory exists
    if not os.path.isdir(directory):
        print(f"Error: The directory {directory} does not exist.")
    else:
        # Iterate through all files in the specified directory
        for root, dirs, files in os.walk(directory):
                
            for file in files:
                if (os.path.realpath(os.path.join(root, file)) == __file__) or (file not in list_of_files):
                    continue
                
                print("Checking", file)
                file_path = os.path.join(root, file)
                print(file_path)
                print(process_file(file_path))


if __name__ == "__main__":
    main()