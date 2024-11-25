import subprocess
import sys

# File containing the commands
file_path = sys.argv[1]

def execute_commands(file_path):
    try:
        with open(file_path, 'r') as file:
            # Read all lines from the file
            commands = file.readlines()
        # print (commands)
        for command in commands:
            # Strip any leading/trailing whitespace or newline characters
            print (command)
            command = command.strip()
            if command:  # Ensure the line is not empty
                print(f"Executing: {command}")
                # Execute the command
                result = subprocess.run(command, shell=True, text=True, capture_output=True)
                # Output the result of the command
                print("Output:")
                print(result.stdout)
                if result.stderr:
                    print("Errors:")
                    print(result.stderr)
    except FileNotFoundError:
        print(f"File {file_path} not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    execute_commands(file_path)
