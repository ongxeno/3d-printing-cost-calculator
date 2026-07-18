# 🖨️ 3D Print TrueCost Calculator

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**[👉 Try the Live Demo Here!](https://ongxeno.github.io/3d-printing-cost-calculator/)** *(Note: Update this link once deployed via GitHub Pages!)*

Welcome to the **3D Print TrueCost Calculator**! Whether you're a weekend hobbyist printing tabletop minis or running a small Etsy shop out of your garage, figuring out the *actual* cost of your 3D prints can be tricky. It's not just about the plastic—it's the electricity, your time, and the wear and tear on your trusty machine. 

This calculator takes the guesswork out of 3D printing economics and gives you a beautifully detailed, granular breakdown of your true break-even costs.

---

## ✨ Features

- **Filament Presets**: Built-in pricing, power draw, and hardware wear multipliers for common filaments like PLA, PETG, ABS, TPU, and abrasives like PA-CF.
- **Multi-Material Support**: Printing a job with a support interface or multiple colors? Add as many materials as you want and assign their roles (Part, Support Base, Support Interface, Prime Tower).
- **Printer Hardware Profiles**: Comes with pre-loaded profiles for popular printers (Bambu Lab, Prusa, Creality).
- **Maintenance Wear Tracking**: Every print wears down your nozzles, belts, and PEI sheets. This calculator figures out exactly how much each print costs you in hardware degradation down to the specific component.
- **Granular Economics**: Factor in your local electricity rates, labor costs (prep, setup, post-processing), and even a failure risk buffer!
- **Itemized Receipt**: Get a gorgeous, easy-to-read "receipt" breaking down your Grand Total into materials, energy, labor, depreciation, and component wear.

## 🛠️ How to Use the Calculator

1. **Select Your Printer**: Pick your machine from the **Hardware Profile** dropdown. The app will automatically load its power consumption and maintenance parts.
2. **Enter Job Details**: 
   - Type in your estimated print time (hours and minutes).
   - Add your materials. Select the filament type, its role in the print, and the weight in grams.
3. **Tweak Your Economics**: Set your local electricity rate and what you consider your labor to be worth per hour. Add time for prep, setup, and post-processing.
4. **Adjust Advanced Variables (Optional)**: If you've modified your printer or know your exact effective power draw, you can override the base variables and add custom maintenance parts.
5. **View Your Receipt**: Check the **Itemized Receipt** on the right side of the screen to see exactly how much your print cost to make!

---
*Happy Printing! May your first layers always stick perfectly.* 🚀
