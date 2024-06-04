
import os
import subprocess
import time

def list_js_files(directory):
    js_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.js'):
                full_path = os.path.join(root, file)
                js_files.append(full_path)
    return js_files

def extract_flags(file_path):
    flags = ""
    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('// Flags:'):
                flags = line[len('// Flags:'):].strip()
                break
    return flags

def run_d8_with_flags(file_path, flags):
    d8_command = f"../v8/out/release/d8 --expose-gc --allow-natives-syntax --shell --sandbox-testing {flags} {file_path}"
    print(f"Running: {d8_command}")
    process = subprocess.Popen(d8_command, shell=True)
    return process.pid

def dump_proc_mapping(pid, dump_file):
    dump_folder = 'dump'
    if not os.path.exists(dump_folder):
        os.makedirs(dump_folder)
    dump_path = os.path.join(dump_folder, dump_file)
    
    with open(dump_path, 'w') as dump_file:
        proc_maps_command = f"cat /proc/{pid}/maps"
        proc_maps = subprocess.check_output(proc_maps_command, shell=True)
        dump_file.write(proc_maps.decode())

def main():
    directory = '/home/vult/Desktop/v8/v8/test/mjsunit/wasm'
    js_files = list_js_files(directory)
    
    for file_path in js_files:
        print(f"Processing: {file_path}")
        flags = extract_flags(file_path)
        pid = run_d8_with_flags(file_path, flags)
        dump_file_name = os.path.basename(file_path) + '.dump'
        
        # Wait a bit to ensure the process starts and mappings are available
        time.sleep(2)
        
        dump_proc_mapping(pid, dump_file_name)
        
        # Keep the process alive (this can be replaced with a more appropriate condition if needed)
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            # Cleanup: terminate the d8 process
            subprocess.Popen(f"kill {pid}", shell=True)
            print("Process terminated and script stopped.")

if __name__ == "__main__":
    main()
