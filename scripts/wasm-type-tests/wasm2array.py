import sys

def read_file_as_hex_array(filename):
    try:
        with open(filename, 'rb') as file:
            data = file.read()
            # Convert each byte to its hexadecimal representation
            hex_array = [f"0x{byte:02x}" for byte in data]
            print(f"\n[{', '.join(hex_array)}]\n")  # Print the array without quotes
    except FileNotFoundError:
        print(f"Error: The file '{filename}' was not found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <filename>")
    else:
        filename = sys.argv[1]
        read_file_as_hex_array(filename)
