import numpy as np
import random

def generate_signal():
    base = np.sin(np.linspace(0, 10, 50))
    noise = np.random.normal(0, 0.2, 50)
    signal = base + noise

    focus_level = random.randint(40, 100)

    return {
        "signal": signal.tolist(),
        "focus": focus_level,
        "status": "LOW" if focus_level < 60 else "HIGH"
    }