# File: run_tc.gdb


# Catch any signals (like SIGSEGV for segmentation fault) that indicate a crash
catch signal SIGSEGV

# Define commands to execute when a signal is caught
commands
    echo Thread 1 \"$arg0\" received signal SIGSEGV, Segmentation fault.\n

    # Print the current instruction pointer (RIP) address
    echo At address: $pc\n

    # Check if registers are available
    if $pc != 0
        # Print the register values
        info registers

        # Print the memory around the instruction pointer (RIP)
        x/16i $pc

        # Optionally, print the memory content around a specific address
        # For example, print 16 bytes of memory around the address in $rsp
        if $rsp != 0
            x/16gx $rsp
        end
    else
        echo No valid registers available.\n
    end

    # Exit GDB
    quit
end

# Run the program
run

# If the program finishes without crashing
echo Program finished successfully.\n

# Exit GDB
quit
