
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
    d8_command = f"out/release/d8 --expose-gc --allow-natives-syntax --shell --sandbox-testing {flags} {file_path}"
    print(f"Running: {d8_command}")
    process = subprocess.Popen(d8_command, shell=True)
    # print(f"Process ID: {process.pid}")
    return process.pid

def dump_proc_mapping(pid, dump_file):
    dump_folder = '/home/vult/Desktop/v8/tests/dump/'
    if not os.path.exists(dump_folder):
        os.makedirs(dump_folder)
    dump_path = os.path.join(dump_folder, dump_file)
    
    with open(dump_path, 'w') as dump_file:
        proc_maps_command = f"cat /proc/{pid}/maps"
        proc_maps = subprocess.check_output(proc_maps_command, shell=True)
        dump_file.write(proc_maps.decode())

def get_d8_pid():
    # Define the command to get the PID of the `d8` process
    command = "ps aux | grep 'out/release/d8' | grep -v grep | awk '{print $2}'"
    
    # Execute the command and capture the output
    result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Get the standard output and split it into lines
    pids = result.stdout.strip().split('\n')
    
    # Filter out any empty lines
    pids = [pid for pid in pids if pid]
    
    if (len(pids) < 2):
        return 0
    return pids[1]

def main():
    directory = '/home/vult/Desktop/v8/v8/test/mjsunit/wasm'
    js_files = list_js_files(directory)
    cnt = 0
    losing_files = []
    
    for file_path in js_files:
        # if (cnt ==2):
        #     break
        print(f"Processing: {file_path}")
        flags = extract_flags(file_path)
        pid = run_d8_with_flags(file_path, flags)
        # time.sleep(20)
        pid = get_d8_pid()
        print(f"PID: {pid}")
        if (pid == 0):
            losing_files.append(file_path)
            print("No d8 process found.")
            continue

        dump_file_name = os.path.basename(file_path) + '.dump'
        
        # Wait a bit to ensure the process starts and mappings are available
        time.sleep(2)
        
        dump_proc_mapping(pid, dump_file_name)
        cnt += 1
        subprocess.Popen(f"kill {pid}", shell=True)
        
        # # Keep the process alive (this can be replaced with a more appropriate condition if needed)
        # try:
        #     while True:
        #         time.sleep(1)
        # except KeyboardInterrupt:
        #     # Cleanup: terminate the d8 process
        #     subprocess.Popen(f"kill {pid}", shell=True)
        #     print("Process terminated and script stopped.")
        
    print("==========================================================")
    for file_path in losing_files:
        print(file_path)
# /home/vult/Desktop/v8/v8/test/mjsunit/wasm/serialize-lazy-module.js // missing flags lifoff
# /home/vult/Desktop/v8/v8/test/mjsunit/wasm/user-properties-exported.js // shouldn't add --verify-heap flag
# /home/vult/Desktop/v8/v8/test/mjsunit/wasm/user-properties-constructed.js
# /home/vult/Desktop/v8/v8/test/mjsunit/wasm/user-properties-reexport.js

if __name__ == "__main__":
    main()
