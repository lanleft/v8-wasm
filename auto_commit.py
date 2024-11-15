import subprocess
import requests
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# OpenAI API endpoint and key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions"

def get_git_diff():
    """Get the git diff of staged changes."""
    subprocess.run(["git", "add", "."])
    return subprocess.check_output(["git", "diff", "--staged"])

def generate_commit_message(diff):
    """Generate a commit message using OpenAI API."""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are an assistant tasked with generating a concise Git commit message."
            },
            {
                "role": "user",
                "content": f"You are tasked with generating a concise Git commit message for the following diff:\n\n<diff>\n{diff}\n</diff>\n\nYour goal is to create a clear and informative commit message that summarizes the changes made in this diff. A good commit message should be concise yet descriptive, allowing other developers to quickly understand the purpose of the commit.\n\nGuidelines for writing an effective commit message:\n1. Start with a brief (50 characters or less) summary of the change\n2. Use the imperative mood (e.g., \"Add feature\" instead of \"Added feature\")\n3. Focus on the \"what\" and \"why\" of the change, not the \"how\"\n4. If necessary, provide more detailed explanations in subsequent lines, leaving a blank line after the summary\n\nAnalyze the provided diff carefully, paying attention to:\n- Files that were modified, added, or deleted\n- The nature of the changes (e.g., bug fix, feature addition, refactoring)\n- Any significant logic changes or important code additions\n\nBased on your analysis, generate a commit message that accurately represents the changes in the diff. \n\nWrite your commit message inside <commit_message> tags. The first line should be the brief summary, followed by a blank line and then any additional details if necessary."
            }
        ],
        "max_tokens": 300,
        "temperature": 0.5
    }

    response = requests.post(OPENAI_API_ENDPOINT, headers=headers, json=data)
    response_json = response.json()

    if "choices" in response_json and len(response_json["choices"]) > 0:
        message_content = response_json["choices"][0]["message"]["content"]

        if "<commit_message>" not in message_content:
            raise ValueError("No commit message found in the response.")
        else:
            return message_content.split("<commit_message>")[1].split("</commit_message>")[0]
    else:
        raise ValueError("Failed to generate a commit message.")

def commit_changes(message):
    """Commit changes with the given message."""
    subprocess.run(["git", "commit", "-m", message])

def push_changes():
    """Push changes to origin master."""
    subprocess.run(["git", "push", "origin", "master"])

def main():
    # Get the git diff
    diff = get_git_diff()
    # print diff
    print("diff:", diff)
    
    if not diff:
        print("No changes to commit.")
        return
    
    # Generate commit message
    commit_message = generate_commit_message(diff)
    
    # Show the commit message to the user and ask for confirmation
    print(f"Generated commit message:\n\n{commit_message}\n")
    
    confirm = input("Do you want to commit with this message and push to origin master? (y/n): ").lower().strip()
    
    if confirm == 'y':
        # Commit changes
        commit_changes(commit_message)
        print(f"Changes committed with message: {commit_message}")
        
        # Push changes
        print("Pushing changes to origin master...")
        push_changes()
        print("Changes pushed successfully.")
    else:
        print("Operation cancelled.")

if __name__ == "__main__":
    main()