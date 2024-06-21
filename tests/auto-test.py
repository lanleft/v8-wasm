import subprocess
import sys

# Path to the JavaScript file
# js_tmp_file_path = "t10_tmp.js"

# Command template to run
# command_template = '../v8/out/release/d8 --expose-gc --allow-natives-syntax --sandbox-testing --experimental-wasm-memory64 ' + js_tmp_file_path


# Function to update $$offset in the JS file
# def update_js_file(offset_value):
#     with open(js_file_path, 'r') as file:
#         content = file.read()

#     new_content = content.replace('$$offset', hex(offset_value))

#     with open(js_tmp_file_path, 'w') as file:
#         file.write(new_content)


# rm -rf test_output && mkdir test_output

# Command failed with offset 0x4d -- crash
# Command succeeded with offset 0x1d3 -- hang
# 0x3ea, 0x3ca: static_cast<uint32_t>(index) <= static_cast<uint32_t>(length_)
# 0x3a1: encountered: Check failed: IsJSReceiver(obj)
# 0x31f, 0x31e: unreachable code
# 0x317 :module->status() == kEvaluated.
# 0x316: module->status() == kEvaluated || module->status() == kErrored.

# 0x1027 -> 0x1722
# g_id = 0
# for offset in range(0x1036, 0x1040):
#     print(offset)
#     # print(f'============================== offset {hex(offset)} ===============================')
#     command_template = "gdb -x run_tc.gdb --args ../v8/out/release/d8 --expose-gc --allow-natives-syntax --sandbox-testing --experimental-wasm-memory64 t10.js -- " + str(offset) + "> test_output/" + str(g_id) + "_" + hex(offset)[2:] + ".txt"
#     # print(f'Running command: {command_template}')
#     process = subprocess.run(command_template, shell=True)
#     # print(f'============================================================================')
#     g_id += 1

# # dump gdb 




import threading
js_file_path = 't10.js'
# Function to process a sub-range of indices
def process_range(start, end):
    for offset in range(start, end):
        print(offset)
        # print(f'============================== offset {hex(offset)} ===============================')
        command_template = "gdb -x run_tc.gdb --args ../v8/out/release/d8 --expose-gc --allow-natives-syntax --sandbox-testing --experimental-wasm-memory64 t10.js -- " + str(offset) + "> test_output/" + str(offset) + "_" + hex(offset)[2:] + ".txt"
        # print(f'Running command: {command_template}')
        process = subprocess.run(command_template, shell=True)
        # print(f'============================================================================')


# Function to divide the work among threads
def multi_thread_range(start, end, num_threads):
    # Calculate the size of each chunk
    total_size = end - start
    chunk_size = total_size // num_threads
    threads = []

    for i in range(num_threads):
        # Determine the start and end indices for each thread
        chunk_start = start + i * chunk_size
        # Ensure the last thread processes up to the end
        if i == num_threads - 1:
            chunk_end = end
        else:
            chunk_end = chunk_start + chunk_size
        
        # Create and start the thread
        thread = threading.Thread(target=process_range, args=(chunk_start, chunk_end))
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

    print("All threads have completed.")

# Example usage
start_index = 0x1027    
end_index = 0x1722
number_of_threads = 50

multi_thread_range(start_index, end_index, number_of_threads)