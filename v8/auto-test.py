import subprocess

# Path to the JavaScript file
js_file_path = '../tests/t10.js'
js_tmp_file_path = "../tests/t10_tmp.js"

# Command template to run
command_template = './out/release/d8 --expose-gc --allow-natives-syntax --sandbox-testing --experimental-wasm-memory64 ' + js_tmp_file_path

# Function to update $$offset in the JS file
def update_js_file(offset_value):
    with open(js_file_path, 'r') as file:
        content = file.read()

    new_content = content.replace('$$offset', hex(offset_value))

    with open(js_tmp_file_path, 'w') as file:
        file.write(new_content)


# Command failed with offset 0x4d -- crash
# Command succeeded with offset 0x1d3 -- hang
# 0x3ea, 0x3ca: static_cast<uint32_t>(index) <= static_cast<uint32_t>(length_)
# 0x3a1: encountered: Check failed: IsJSReceiver(obj)
# 0x31f, 0x31e: unreachable code
# 0x317 :module->status() == kEvaluated.
# 0x316: module->status() == kEvaluated || module->status() == kErrored.
for offset in range(0x599, 0x200, -1):
    update_js_file(offset)
    process = subprocess.run(command_template, shell=True)
    if process.returncode != 0:
        print(f' Command failed with offset {hex(offset)}')
    else:
        print(f'Command succeeded with offset {hex(offset)}')
