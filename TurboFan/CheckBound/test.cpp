#include <stdio.h>
#include <stdlib.h>
#include <time.h>

double f(double *ta) {
    int idx = rand() % 4; // Random index between 0 and 3
    return ta[idx];
}

int main() {
    srand(0); // Seed the random number generator
    double arr[4] = {1.1, 2.2, 3.3, 4.4};
    double b = 0;
    for (double i = 0; i < 0x10000; ++i) {
        // arr = {i, i, i, i};
        arr[0] = i;
        arr[1] = i;
        arr[2] = i;
        arr[3] = i;
        // set arr

        b = f(arr);
        printf("%f\n", b);
    }

    return 0;
}
