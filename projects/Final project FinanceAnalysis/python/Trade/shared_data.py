#!/usr/bin/env python3
"""
Shared data module to hold a global DataFrame.
Both sp500_data_loader.py (Step 1) and sp500_step2.py (Step 2)
import this file to share the same data in a single process.
"""

import pandas as pd

# The global DataFrame. Step 1 sets this, Step 2 reads it.
df_prices = pd.DataFrame()