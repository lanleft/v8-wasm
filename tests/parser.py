import sys

def parse_wasm_file(file_path):
    with open(file_path, 'rb') as file:
        byte_data = file.read()
    hex_array = [byte for byte in byte_data]
    return hex_array

def print_hex_array(array):
    print("[", end="")
    for i in range(len(array)):
        print(f"0x{array[i]:02x}", end="")
        if i < len(array) - 1:
            print(", ", end="")
    print("]")

if __name__ == "__main__":
    # file_path = 'memory_wasm.wasm'
    if len(sys.argv) < 2:
        print('Please provide a file path')
        sys.exit(1)
    file_path = sys.argv[1]
    print(f'Parsing file: {file_path}')
    hex_array = parse_wasm_file(file_path)
    print(hex_array)