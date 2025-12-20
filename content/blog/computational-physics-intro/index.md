---
title: "Introduction to Computational Physics"
date: "2024-05-20"
description: "Why I love simulating physics with code."
tags: ["physics", "simulation", "python"]
---

Computational physics allows us to explore realms that are otherwise inaccessible. From the center of a star to the folding of a protein, simulations act as our virtual laboratory.

## The N-Body Problem

One of the classic problems in computational physics is the N-body problem. How do $N$ particles interact under gravity?

$$
F = G \frac{m_1 m_2}{r^2}
$$

```python
def gravity(m1, m2, r):
    G = 6.674 * 10**-11
    return G * m1 * m2 / r**2
```

In this blog, we will explore:
- **Monte Carlo methods**
- **Molecular Dynamics**
- **Quantum Mechanics simulations**

Stay tuned for more!
