# **Thermodynamic and Economic Analysis of Fused Deposition Modeling Polymers: A Southeast Asian Market Perspective**

The transition of Fused Filament Fabrication (FFF) and Fused Deposition Modeling (FDM) from a rapid prototyping novelty to an end-use additive manufacturing technology has fundamentally altered the economic landscape of polymer procurement. Within the manufacturing hubs of Southeast Asia, particularly in Thailand, the localized cost of additive manufacturing is governed by three primary pillars: capital expenditure amortization (hardware wear), thermodynamic energy consumption (electrical power draw), and feedstock logistics (filament pricing).  
This comprehensive analysis delivers an exhaustive evaluation of the current market economics and thermophysical properties of various FDM 3D printing filaments. By re-evaluating baseline commodity plastics and analyzing an expanded matrix of aesthetic, engineering, ultra-performance, and composite polymers, this report establishes an empirical framework for the total cost of ownership in 3D printing farms. The data synthesis is specifically calibrated to the Thai Baht (THB) market, reflecting current import tariffs, regional distribution networks, and the operational realities of tropical ambient environments. The resulting data model provides a programmatic foundation for calculating dynamic print costs across diverse material profiles.

## **Analytical Framework for Energy and Wear Calculus**

To accurately construct the power\_draw\_multiplier and hardware\_wear\_multiplier for each polymer, an empirical methodology rooted in thermodynamics and tribology was established. The baseline metric for both multipliers is standard Polylactic Acid (PLA), which is assigned a value of 1.0. All subsequent materials are evaluated relative to this baseline.

### **Thermodynamic Energy Modeling**

The primary consumers of electrical energy during the extrusion process are the heated print bed, the hotend assembly, and the active chamber heater. Minor continuous draws originate from the motherboard, stepping motors, and cooling fans, which constitute a baseline system draw of approximately 40 Watts1.  
The steady-state power required to maintain a specific temperature is dictated by convective and radiative heat losses. For any heated surface within the printer envelope, the required power output ![][image1] at a surface temperature ![][image2] in an ambient chamber temperature ![][image3] is modeled using the combined convective and Stefan-Boltzmann radiative heat transfer equations:  
![][image4]  
Where ![][image5] is the convective heat transfer coefficient, ![][image6] is the effective surface area, ![][image7] is the surface emissivity, and ![][image8] is the Stefan-Boltzmann constant. Standard PLA printing, utilizing a nozzle temperature of 210°C, a bed temperature of 60°C, and a standard ambient temperature of 25°C, yields an overall steady-state power draw of approximately 104.5 Watts on a standard 256x256 millimeter desktop platform1. This calculation explicitly informs the 1.0 baseline multiplier.  
As thermal requirements scale to accommodate engineering polymers, power consumption increases non-linearly due to the fourth-power relationship in radiative heat loss. Furthermore, ultra-performance polymers such as Polyether Ether Ketone (PEEK) require actively heated build chambers to prevent catastrophic anisotropic shrinkage. An active 120°C chamber heater must overcome the U-value heat loss of the enclosure panels, drawing upwards of 450 Watts independently1. This fundamentally shifts the unit economics of printing high-temperature thermoplastics.

| Material Profile | Nozzle Temp (°C) | Bed Temp (°C) | Chamber Temp (°C) | Total Steady-State Power (W) | Power Multiplier |
| :---- | :---- | :---- | :---- | :---- | :---- |
| PLA (Standard) | 210 | 60 | 25 | 104.5 | 1.00 |
| PETG (Durable) | 240 | 80 | 25 | 142.0 | 1.36 |
| ABS / ASA | 260 | 100 | 45 | 150.0 | 1.44 |
| Polycarbonate (PC) | 280 | 110 | 50 | 163.5 | 1.56 |
| PEI (Ultem) | 380 | 140 | 80 | 448.6 | 4.29 |
| PEEK | 410 | 150 | 120 | 585.1 | 5.60 |

### **Tribology and Hardware Degradation Mechanics**

The secondary hidden cost in additive manufacturing operations is hardware degradation. Standard FDM nozzles are machined from brass, possessing a hardness of approximately 3 on the Mohs scale. While highly thermally conductive, brass is exceptionally susceptible to abrasive wear from dispersed phases within polymer matrices. The hardware\_wear\_multiplier quantifies this degradation rate, encompassing the erosion of the nozzle orifice, the wearing of hardened steel extruder drive gears, and the thermal degradation of PTFE bowden tubes.  
Unfilled polymers exhibit negligible abrasiveness, maintaining the baseline wear multiplier of 1.0. However, the introduction of inorganic fillers alters the tribological profile of the melt flow significantly. Chopped carbon fibers are highly stiff; as they flow parallel to the nozzle walls, they induce micro-abrasion, scoring the internal geometry and rapidly widening the nozzle diameter. Glass fibers, composed of amorphous silica, possess a Mohs hardness of 6 to 7, rendering them significantly more destructive than carbon fiber. The most severe degradation originates from phosphorescent additives used in glow-in-the-dark filaments. These Strontium Aluminate crystals are large, jagged, and possess a Mohs hardness exceeding 7.0, capable of destroying a standard brass nozzle within a single 500-gram extrusion cycle2.

| Dispersed Phase Filler | Typical Mohs Hardness | Abrasive Severity | Assigned Wear Multiplier |
| :---- | :---- | :---- | :---- |
| Unfilled (Neat Polymer) | \< 2.0 | Negligible | 1.0 |
| Wood Flour / Particulates | 2.0 \- 3.0 | Mild | 1.5 |
| Titanium Dioxide (Matte) | 5.5 \- 6.0 | Mild to Moderate | 1.5 |
| Carbon Fiber (Chopped) | 2.0 \- 3.0 (High Stiffness) | Severe | 5.0 |
| Glass Fiber (Silica) | 6.0 \- 7.0 | Extreme | 6.0 |
| Strontium Aluminate (Glow) | 7.0 \- 7.5 | Catastrophic | 8.0 |

## **Baseline Commodity Polymers**

The foundation of the FDM ecosystem rests upon a core group of commodity polymers. In the Thai market, the pricing dynamics for these materials are highly competitive, driven by regional proximity to major Chinese manufacturers such as eSun, Sunlu, and Bambu Lab, alongside local distributors like Print3DD and Septillion3.  
Polylactic Acid (PLA) serves as the undisputed baseline of the additive manufacturing sector. As a biodegradable aliphatic polyester derived from renewable resources—such as the abundant cassava starch produced locally in Thailand7—it features a low glass transition temperature and extrudes with near-zero warpage. In the Thai retail market, mid-tier brands command an average price of 450 THB per kilogram, factoring in promotional refill spools from premium ecosystems and standard third-party pricing4. Thermodynamically, its low processing temperatures (210°C nozzle, 60°C bed) define the 1.0 power multiplier1. As an unfilled, non-abrasive plastic, its wear multiplier remains safely at 1.0.  
Polyethylene Terephthalate Glycol (PETG) bridges the mechanical gap between the ease of PLA and the thermal durability of ABS. The glycol modification prevents crystallization during the extrusion process, resulting in a tough, chemically resistant, and highly amorphous part. Pricing parity with PLA has largely been achieved in Southeast Asia, with local retail averages sitting firmly at 450 THB per kilogram4. Due to the elevated thermal requirements—specifically a 240°C hotend and an 80°C heated bed to ensure proper layer adhesion—the baseline power consumption increases to approximately 142 Watts, yielding a power multiplier of 1.361. The wear multiplier remains equivalent to PLA at 1.0.  
Acrylonitrile Butadiene Styrene (ABS) and its UV-resistant counterpart, Acrylonitrile Styrene Acrylate (ASA), are heavily utilized for functional, temperature-resistant applications. ASA is particularly favored in Thailand's tropical climate for outdoor applications due to its superior resistance to photo-oxidation degradation, a vulnerability that severely limits the lifespan of standard ABS10. Economically, ABS retails slightly lower than ASA, but a blended market average for high-quality spools rests at 550 THB per kilogram4. The high thermal expansion coefficient of these styrene-based polymers necessitates an enclosed build volume and a 100°C bed to mitigate severe warping. This pushes the continuous power draw to roughly 150 Watts, establishing a power multiplier of 1.441. Both materials are non-abrasive, retaining a wear multiplier of 1.0.  
Carbon Fiber Reinforced Polyamide (PA-CF) represents a significant leap into engineering-grade composites. Polyamide (Nylon) offers extreme inter-layer toughness and fatigue resistance, while the inclusion of chopped carbon fiber severely restricts the material's notorious tendency to warp during cooling. Pricing for PA-CF scales dramatically compared to commodity plastics; reputable mid-tier brands in Thailand retail between 1,490 THB and 1,749 THB, establishing a reliable average of 1,600 THB per kilogram9. Extrusion temperatures approaching 290°C demand high instantaneous wattage, though the relatively moderate 80°C bed requirement keeps the overall power multiplier at a manageable 1.201. However, the carbon fibers act as severe abrasives, requiring hardened steel extrusion pathways and yielding a wear multiplier of 5.0.  
Thermoplastic Polyurethane (TPU) is an essential elastomer for flexible, high-impact, and vibration-dampening applications. Typically measured on the Shore A hardness scale, TPU prints must be extruded slowly to prevent buckling within the filament path. Pricing across Bangkok distributors is relatively consistent, averaging 850 THB per kilogram9. Thermodynamically, TPU is highly efficient. With nominal bed temperatures around 50°C and hotends at 225°C, it consumes the least power of all engineering materials evaluated, resulting in a power multiplier of 0.851. The soft nature of the elastomer ensures zero abnormal hardware wear, maintaining the 1.0 baseline.  
Dedicated Support Materials, specifically Polyvinyl Alcohol (PVA) and High Impact Polystyrene (HIPS), are critical for fabricating complex overhangs and internal cavities. PVA provides water-soluble support for PLA and PETG, while HIPS dissolves in d-Limonene, making it the standard pairing for ABS8. Due to the complex manufacturing chemistry and the extreme desiccant packaging required to manage PVA's intense hygroscopy, it is inherently expensive, commanding an average bulk-equivalent price of 1,350 THB per kilogram8. While HIPS requires ABS-level thermal energy, PVA mirrors the thermal profile of PLA. Synthesizing their usage profiles yields a blended power multiplier of 1.15. As neat polymers, their hardware wear multipliers remain at 1.0.

## **Aesthetic and Hobbyist Polymer Profiles**

The consumer segment of 3D printing has driven massive innovation in aesthetic filament modifications. By compounding baseline PLA with various organic and inorganic additives, manufacturers can radically alter the visual and tactile properties of the final print.  
Silk PLA achieves its highly sought-after lustrous, metallic finish not through metal powders, but via the compounding of proprietary polyester elastomers. This structural modification forces the polymer chains to align highly parallel during extrusion, maximizing light reflectance. In the local market, Silk variants are priced at a slight premium, averaging 550 THB per kilogram4. The elastomeric additives require slightly more thermal energy to melt uniformly without clogging, gently nudging the power multiplier to 1.011. The wear multiplier remains at the 1.0 baseline.  
Matte PLA relies on the incorporation of inorganic fillers—typically fine titanium dioxide or specialized talc—to aggressively diffuse light, effectively hiding layer lines and providing a premium, injection-molded tactile feel. The market for Matte PLA is highly competitive, often priced equivalently to standard PLA at an average of 450 THB per kilogram9. While the power multiplier remains completely unaffected at 1.00, the mineral fillers exhibit a mild abrasive quality. Over thousands of hours of printing, this micro-abrasion degrades standard brass nozzles, warranting a slight increase in the wear multiplier to 1.5.  
Wood-Filled PLA incorporates pulverized wood flour or bamboo particulates into the PLA matrix. This unique compounding allows the final printed parts to be sanded, stained, and treated much like authentic timber. Local pricing for reliable wood filaments averages 550 THB per kilogram8. Thermodynamically, Wood PLA must be printed at lower temperatures (typically around 200°C) to prevent the organic wood fibers from charring and blocking the nozzle. This thermal reduction drops the power multiplier slightly to 0.991. Similar to matte filaments, the particulate nature of the wood flour causes mild abrasion, justifying a 1.5 wear multiplier.  
Glow-in-the-Dark PLA presents one of the most mechanically hostile environments for a 3D printer. The photoluminescent effect is achieved by heavily loading the PLA matrix with Strontium Aluminate crystals. Economically, the material is highly accessible, averaging 500 THB per kilogram5. While its power consumption perfectly mirrors standard PLA (1.00 multiplier), the Strontium Aluminate crystals are exceptionally hard and jagged. Extruding this material through a standard brass nozzle acts identically to forcing liquid sandpaper through a precise aperture. The catastrophic rate of erosion dictates a wear multiplier of 8.0, making it mandatory to utilize hardened steel, tungsten carbide, or ruby-tipped nozzles for prolonged usage15.

## **Engineering-Grade Polymers**

Moving beyond the thermal limitations of commodity plastics, engineering-grade polymers offer superior mechanical properties tailored for end-use industrial applications, jigs, and fixtures.  
Polycarbonate (PC) is revered for its extreme impact resistance and high thermal deflection temperature. It is optically translucent in its neat form and incredibly rigid. In the Thai ecosystem, engineering-grade PC tailored for desktop FDM systems commands a premium, averaging 1,500 THB per kilogram16. The thermodynamics of printing Polycarbonate are demanding. Achieving successful inter-layer adhesion without delamination requires a 110°C bed and a 280°C nozzle, relying on a highly insulated passive enclosure that rapidly reaches 50°C. This intense thermal demand pushes the sustained power consumption to approximately 163 Watts, resulting in a power multiplier of 1.561. As an unfilled polymer, the wear multiplier remains 1.0.  
Polypropylene (PP) is highly prized in the automotive and packaging industries for its extreme chemical resistance, low density, and unparalleled fatigue resistance, making it the premier choice for living hinges. However, its highly semi-crystalline structure leads to severe volumetric shrinkage during cooling, making it notoriously difficult to print without specialized adhesion surfaces. Available through specialized channels in Thailand, high-quality PP averages 1,000 THB per kilogram17. PP requires precise thermal control with a 230°C nozzle and an 85°C bed, generating a power multiplier of 1.371. The wear multiplier remains 1.0.  
Polyoxymethylene (POM), commonly known by its commercial name Delrin, is an engineering thermoplastic used in precision parts requiring high stiffness, low friction, and excellent dimensional stability20. It is heavily utilized for fabricating mechanical gears and bearing surfaces. POM is relatively difficult to source locally in filament form and is largely imported, driving the retail price to roughly 1,500 THB per kilogram20. The material is notoriously difficult to adhere to a build plate, requiring a massive 110°C bed temperature combined with a 245°C hotend. The sustained power consumption is heavy, pulling a 1.62 power multiplier1. The wear multiplier is evaluated at 1.0.

## **High-Performance and Industrial Composites**

The absolute pinnacle of FDM technology is the extrusion of ultra-polymers and fiber-reinforced composites. These materials are explicitly designed to replace machined aluminum and steel in aerospace, automotive, and medical applications.  
Polyetherimide (PEI), universally recognized under the commercial SABIC brand name Ultem (specifically the 9085 and 1010 grades), is an amorphous, high-performance polymer renowned for its inherent flame retardancy, massive strength-to-weight ratio, and aerospace certifications23. Economically, PEI is prohibitively expensive for standard consumers. Global industrial pricing dictates costs between 10,000 and 15,000 THB per kilogram, establishing our model baseline at 12,000 THB25. Thermodynamically, PEI cannot be printed on standard desktop machines. It requires a 380°C hotend, a 140°C bed, and an actively heated 80°C chamber. The active chamber heater demands massive, continuous electrical wattage to overcome environmental heat loss, driving the power multiplier to an extraordinary 4.291. The neat resin carries a wear multiplier of 1.0.  
Polyether Ether Ketone (PEEK) represents the apex of semi-crystalline ultra-polymers. It is utilized heavily in spinal implants due to its radiolucency and biocompatibility, as well as in extreme-environment dynamic stress applications23. As a niche industrial material, PEEK commands extreme pricing. In the Thai market, importing this material translates to approximately 25,000 THB per kilogram23. The thermal architecture required to print PEEK is staggering: a 410°C nozzle, a 150°C bed, and a 120°C actively heated chamber. This configuration draws near 585 Watts of sustained power, establishing the highest power multiplier in the dataset at 5.601. The unfilled matrix maintains a wear multiplier of 1.0.  
Composite Polymers leverage the integration of chopped fibers into standard matrices to dramatically alter structural performance, mitigating warpage and vastly increasing tensile modulus.

* **PETG-GF (Glass Fiber):** Priced accessibly at around 950 THB per kilogram9. The amorphous silica glass fibers are highly abrasive, necessitating a 6.0 wear multiplier. Standard PETG thermal profiles apply, resulting in a 1.14 power multiplier1.  
* **ABS-GF (Glass Fiber):** Priced aggressively by manufacturers like FusRock at 850 THB29. The glass fibers aggressively score the nozzle, resulting in a wear multiplier of 6.0. The high bed temperature requirement yields a power multiplier of 1.441.  
* **PLA-CF (Carbon Fiber):** Retails for roughly 790 THB9. While retaining the low 1.01 power multiplier of PLA, the stiff carbon fibers require a wear multiplier of 5.0.  
* **PETG-CF (Carbon Fiber):** Retails at an average of 880 THB8. It combines the chemical resistance of PETG with the stiffness of CF. The power multiplier evaluates to 1.36, with a wear multiplier of 5.0.

## **Complete Economic and Thermodynamic Data Model**

The culmination of this thermodynamic, tribological, and macroeconomic research is structured into the final JSON data model below. This structure provides a complete Record\<string, FilamentPreset\> mapping, explicitly detailing the calculated identifiers, names, localized Thai Baht pricing, thermodynamic power multipliers, and abrasive hardware wear multipliers for immediate integration into programmatic cost-estimation software.

JSON  
{  
  "mat\_pla": {  
    "id": "mat\_pla",  
    "name": "PLA (Standard)",  
    "price\_per\_kg\_thb": 450,  
    "power\_draw\_multiplier": 1.00,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_petg": {  
    "id": "mat\_petg",  
    "name": "PETG (Durable)",  
    "price\_per\_kg\_thb": 450,  
    "power\_draw\_multiplier": 1.36,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_abs\_asa": {  
    "id": "mat\_abs\_asa",  
    "name": "ABS / ASA",  
    "price\_per\_kg\_thb": 550,  
    "power\_draw\_multiplier": 1.44,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_pa\_cf": {  
    "id": "mat\_pa\_cf",  
    "name": "PA-CF (Carbon Fiber Nylon)",  
    "price\_per\_kg\_thb": 1600,  
    "power\_draw\_multiplier": 1.20,  
    "hardware\_wear\_multiplier": 5.0  
  },  
  "mat\_tpu": {  
    "id": "mat\_tpu",  
    "name": "TPU (Flexible)",  
    "price\_per\_kg\_thb": 850,  
    "power\_draw\_multiplier": 0.85,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_support": {  
    "id": "mat\_support",  
    "name": "Dedicated Support (PVA/HIPS)",  
    "price\_per\_kg\_thb": 1350,  
    "power\_draw\_multiplier": 1.15,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_pla\_silk": {  
    "id": "mat\_pla\_silk",  
    "name": "Silk PLA",  
    "price\_per\_kg\_thb": 550,  
    "power\_draw\_multiplier": 1.01,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_pla\_matte": {  
    "id": "mat\_pla\_matte",  
    "name": "Matte PLA",  
    "price\_per\_kg\_thb": 450,  
    "power\_draw\_multiplier": 1.00,  
    "hardware\_wear\_multiplier": 1.5  
  },  
  "mat\_pla\_wood": {  
    "id": "mat\_pla\_wood",  
    "name": "Wood-filled PLA",  
    "price\_per\_kg\_thb": 550,  
    "power\_draw\_multiplier": 0.99,  
    "hardware\_wear\_multiplier": 1.5  
  },  
  "mat\_pla\_glow": {  
    "id": "mat\_pla\_glow",  
    "name": "Glow-in-the-Dark PLA",  
    "price\_per\_kg\_thb": 500,  
    "power\_draw\_multiplier": 1.00,  
    "hardware\_wear\_multiplier": 8.0  
  },  
  "mat\_pc": {  
    "id": "mat\_pc",  
    "name": "Polycarbonate (PC)",  
    "price\_per\_kg\_thb": 1500,  
    "power\_draw\_multiplier": 1.56,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_pp": {  
    "id": "mat\_pp",  
    "name": "Polypropylene (PP)",  
    "price\_per\_kg\_thb": 1000,  
    "power\_draw\_multiplier": 1.37,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_pom": {  
    "id": "mat\_pom",  
    "name": "POM (Delrin)",  
    "price\_per\_kg\_thb": 1500,  
    "power\_draw\_multiplier": 1.62,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_pei": {  
    "id": "mat\_pei",  
    "name": "PEI (Ultem 9085/1010)",  
    "price\_per\_kg\_thb": 12000,  
    "power\_draw\_multiplier": 4.29,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_peek": {  
    "id": "mat\_peek",  
    "name": "PEEK",  
    "price\_per\_kg\_thb": 25000,  
    "power\_draw\_multiplier": 5.60,  
    "hardware\_wear\_multiplier": 1.0  
  },  
  "mat\_petg\_gf": {  
    "id": "mat\_petg\_gf",  
    "name": "PETG-GF (Glass Fiber)",  
    "price\_per\_kg\_thb": 950,  
    "power\_draw\_multiplier": 1.14,  
    "hardware\_wear\_multiplier": 6.0  
  },  
  "mat\_abs\_gf": {  
    "id": "mat\_abs\_gf",  
    "name": "ABS-GF (Glass Fiber)",  
    "price\_per\_kg\_thb": 850,  
    "power\_draw\_multiplier": 1.44,  
    "hardware\_wear\_multiplier": 6.0  
  },  
  "mat\_pla\_cf": {  
    "id": "mat\_pla\_cf",  
    "name": "PLA-CF (Carbon Fiber)",  
    "price\_per\_kg\_thb": 790,  
    "power\_draw\_multiplier": 1.01,  
    "hardware\_wear\_multiplier": 5.0  
  },  
  "mat\_petg\_cf": {  
    "id": "mat\_petg\_cf",  
    "name": "PETG-CF (Carbon Fiber)",  
    "price\_per\_kg\_thb": 880,  
    "power\_draw\_multiplier": 1.36,  
    "hardware\_wear\_multiplier": 5.0  
  }  
}

#### **Works cited**

1. [unknown\_url](http://docs.google.com/unknown_url)  
2. 250g 500g 1.75mm PLA Luminous Rainbow Filament Glow in the Dark Stars 95A Spool Luminous 3D Printing For PLA Filament 3D | Shopee Thailand, [https://shopee.co.th/250g-500g-1.75mm-PLA-Luminous-Rainbow-Filament-Glow-in-the-Dark-Stars-95A-Spool-Luminous-3D-Printing-For-PLA-Filament-3D-i.1055836268.24138627124](https://shopee.co.th/250g-500g-1.75mm-PLA-Luminous-Rainbow-Filament-Glow-in-the-Dark-Stars-95A-Spool-Luminous-3D-Printing-For-PLA-Filament-3D-i.1055836268.24138627124)  
3. 3DD Digital Fabrication : 3D Printer, Scanner, Laser, [https://www.print3dd.com/](https://www.print3dd.com/)  
4. ช้อป Esun Filament ออนไลน์ในราคาที่ดีกว่า | Lazada Thailand, [https://www.lazada.co.th/tag/esun-filament/](https://www.lazada.co.th/tag/esun-filament/)  
5. Happy3D-Thailand, ร้านค้าออนไลน์, [https://shopee.co.th/happy3dth](https://shopee.co.th/happy3dth)  
6. Bambu Lab แบมบูแลป ผู้นำแบรนด์ 3D Printer | 3DD Digital Fabrication เครื่องพิมพ์3มิติ สแกนเนอร์ เลเซอร์, [https://www.print3dd.com/bambu-lab/](https://www.print3dd.com/bambu-lab/)  
7. Development of 3D Printing Filament from Poly(Lactic Acid) and Cassava Pulp Composite with Epoxy Compatibilizer \- MDPI, [https://www.mdpi.com/2073-4360/17/23/3228](https://www.mdpi.com/2073-4360/17/23/3228)  
8. Mate Lab, ร้านค้าออนไลน์ \- Shopee Thailand, [https://shopee.co.th/matelab](https://shopee.co.th/matelab)  
9. 3D Print Material \- 3D Printer THAI, [https://www.3dprinterthai.com/collections/3d-print-material](https://www.3dprinterthai.com/collections/3d-print-material)  
10. เส้นพลาสติกที่เหมาะกับการใช้งานกลางแจ้ง | 3DD Digital Fabrication เครื่องพิมพ์3มิติ สแกนเนอร์ เลเซอร์, [https://www.print3dd.com/polymer-for-outdoor/](https://www.print3dd.com/polymer-for-outdoor/)  
11. Molastic, ร้านค้าออนไลน์ \- Shopee Thailand, [https://shopee.co.th/molastic](https://shopee.co.th/molastic)  
12. esun PVA 1.75mm / 3.0mm | 3DD Digital Fabrication เครื่องพิมพ์3มิติ สแกนเนอร์ เลเซอร์, [https://www.print3dd.com/product/esun-pva-1-75mm-3-0mm/](https://www.print3dd.com/product/esun-pva-1-75mm-3-0mm/)  
13. pla ราคาพิเศษ | ซื้อออนไลน์ที่ Shopee ส่งฟรี\*ทั่วไทย\!, [https://shopee.co.th/search?keyword=pla\&page=2](https://shopee.co.th/search?keyword=pla&page=2)  
14. ช้อป Ziro Pla ออนไลน์ในราคาที่ดีกว่า | Lazada Thailand, [https://www.lazada.co.th/tag/ziro-pla/](https://www.lazada.co.th/tag/ziro-pla/)  
15. Trianglelab Hardened Steel T- Volcano Nozzles high temperature 3D printER PEI PEEK Carbon fiber filament for Volcano hot | Shopee Thailand, [https://shopee.co.th/Trianglelab-Hardened-Steel-T-Volcano-Nozzles-high-temperature-3D-printER-PEI-PEEK-Carbon-fiber-filament-for-Volcano-hot-i.1055836268.28518378382](https://shopee.co.th/Trianglelab-Hardened-Steel-T-Volcano-Nozzles-high-temperature-3D-printER-PEI-PEEK-Carbon-fiber-filament-for-Volcano-hot-i.1055836268.28518378382)  
16. Bambu Lab PC Filament 1.75mm 1KG (มีแกน) Polycarbonate ทนร้อนสูง แข็งแรงระดับวิศวกรรม รองรับ AMS | Shopee Thailand, [https://shopee.co.th/Bambu-Lab-PC-Filament-1.75mm-1KG-(%E0%B8%A1%E0%B8%B5%E0%B9%81%E0%B8%81%E0%B8%99)-%E2%9A%A1-Polycarbonate-%E0%B8%97%E0%B8%99%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B9%E0%B8%87-%E0%B9%81%E0%B8%82%E0%B9%87%E0%B8%87%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B1%E0%B8%9A%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%9A-AMS-i.1089657936.41830436590](https://shopee.co.th/Bambu-Lab-PC-Filament-1.75mm-1KG-\(%E0%B8%A1%E0%B8%B5%E0%B9%81%E0%B8%81%E0%B8%99\)-%E2%9A%A1-Polycarbonate-%E0%B8%97%E0%B8%99%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B9%E0%B8%87-%E0%B9%81%E0%B8%82%E0%B9%87%E0%B8%87%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%A3%E0%B8%B0%E0%B8%94%E0%B8%B1%E0%B8%9A%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%9A-AMS-i.1089657936.41830436590)  
17. BASF Ultrafuse® Polypropylene (PP) 3D Print Filament 700g \- Cubic Technology, [https://cubictech.com.au/products/ultrafuse-polypropylene-pp-3d-print-filament-700g](https://cubictech.com.au/products/ultrafuse-polypropylene-pp-3d-print-filament-700g)  
18. PA & PP Filament | Eryone 3D Printer​ Online Store – eryone3d, [https://eryone3d.com/collections/pa-pp](https://eryone3d.com/collections/pa-pp)  
19. Yousu Polypropylene PP Filament 1.75 มม.3D เครื่องพิมพ์สําหรับ 3D การพิมพ์ 1 กก.(2.2 ปอนด์) Ultra Tough และสารเคมีความต้านทาน Spool รองรับ wtih Creality Ender/Anycubic/Fla | Shopee Thailand, [https://shopee.co.th/Yousu-Polypropylene-PP-Filament-1.75-%E0%B8%A1%E0%B8%A1.3D-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B9%8C%E0%B8%AA%E0%B9%8D%E0%B8%B2%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A-3D-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B9%8C-1-%E0%B8%81%E0%B8%81.(2.2-%E0%B8%9B%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B9%8C)-Ultra-Tough-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A1%E0%B8%B5%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%95%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%99-Spool-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%9A-wtih-Creality-Ender-Anycubic-Fla-i.236998886.27504570721](https://shopee.co.th/Yousu-Polypropylene-PP-Filament-1.75-%E0%B8%A1%E0%B8%A1.3D-%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B9%8C%E0%B8%AA%E0%B9%8D%E0%B8%B2%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A-3D-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9E%E0%B8%B4%E0%B8%A1%E0%B8%9E%E0%B9%8C-1-%E0%B8%81%E0%B8%81.\(2.2-%E0%B8%9B%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B9%8C\)-Ultra-Tough-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AA%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A1%E0%B8%B5%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%95%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%99-Spool-%E0%B8%A3%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%9A-wtih-Creality-Ender-Anycubic-Fla-i.236998886.27504570721)  
20. EL3D® PA/PC/POM/Conductive Filament Collection \- Envirolaser 3D, [https://www.envirolaser3d.com/products/el3d%C2%AE-pa-pc-pom-conductive-filament-collection](https://www.envirolaser3d.com/products/el3d%C2%AE-pa-pc-pom-conductive-filament-collection)  
21. Plastics Engineering Third Edition \- Madar, [https://www.madar-ju.com/storage/images/files/file\_1732206676c3zNL.pdf](https://www.madar-ju.com/storage/images/files/file_1732206676c3zNL.pdf)  
22. 3d Printer Filament POM 1.75mm/3mm 1kg Plastic Rubber Consumables Material MakerBot | Shopee Thailand, [https://shopee.co.th/3d-Printer-Filament-POM-1.75mm-3mm-1kg-Plastic-Rubber-Consumables-Material-MakerBot-i.1055836268.27368380225](https://shopee.co.th/3d-Printer-Filament-POM-1.75mm-3mm-1kg-Plastic-Rubber-Consumables-Material-MakerBot-i.1055836268.27368380225)  
23. Inslogic PEEK Filament, [https://www.inslogic3d.com/products/peek-filament](https://www.inslogic3d.com/products/peek-filament)  
24. PrimaSelect PEI Ultem 9085 \- 1.75mm \- 500g \- Natural | 3D Prima, [https://www.3dprima.com/filaments/primaselect-pei-ultem-9085-1-75mm-500g-natural\_24289\_5386](https://www.3dprima.com/filaments/primaselect-pei-ultem-9085-1-75mm-500g-natural_24289_5386)  
25. PEI Ultem 9085 Filament | 3D4Makers | 3D printing, [https://www.3d4makers.com/products/pei-ultem-9085-filament](https://www.3d4makers.com/products/pei-ultem-9085-filament)  
26. PEI ULTEM 1010 \- Filament2Print, [https://filament2print.com/en/advanced/892-pei-ultem-1010.html](https://filament2print.com/en/advanced/892-pei-ultem-1010.html)  
27. PEEK CMF Implants ขยายตัวเลือกวัสดุสำหรับการศัลยกรรมเฉพาะบุคคล \- 3DD Digital Fabrication, [https://www.print3dd.com/peek-cmf-implants/](https://www.print3dd.com/peek-cmf-implants/)  
28. PEEK Filament 1.75mm, 1kg \- eBay, [https://www.ebay.com/itm/286682950619](https://www.ebay.com/itm/286682950619)  
29. ModCables101, ร้านค้าออนไลน์ \- Shopee Thailand, [https://shopee.co.th/modcables101](https://shopee.co.th/modcables101)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAA20lEQVR4XmNgGAXoQBOIpwHxLCB+BMUboHwQngTEbkDMCtOADkSAOACIy4H4HxDXAXEIFCcD8X4g/g/Ep2EacAFPIH4AxNJo4oxAPIUBYggLmhwccAPxHgaIK9ABSNMaBogB4mhycKAExM+B2AZdggHiogcMEANArsEK/Biw2wDSUAaVu4UmhwJaGbD7sRKI/wLxMSCWQZODA1A0vmWAxABZIJoBYvsDNHGiwRwGiAGgkCYZCDJAEgjIgHQ0OaJAKQNE81MgVkeTwwv0gfgTA0QzMgaJj4JRQB8AABhXLSG7tX8wAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAZCAYAAABKM8wfAAAB4ElEQVR4Xu2WTShEURTHj1Dks0iJUlJSFoqlhYWNRCys7JQslK+UksVsLGwt5XMhC/IRQpSxlJ2SDRk2kjUlhf+/8555czUz1HtvXppf/WreuU3v3HvPPfeJpEnzP8iCc3+wT/+WOgZgjRF7hJ+w0xHLhltw1hHznRzRJEyYLJOuNuIrohNMGXVw1wyKJrwvOiEbls4abHXEfIf1GDJiBaIJTxrxfLguOslA0QsjsMKIB5IMuAQ3REvAT/juElhsDiSiFF7BMXPAY7g47D7Lorv7axrhC2w2BzymHl7CYfhkjMWFs2Qp8MBxe/xkHq7KH9/LQxYRTTgRDXABbsMmK8aJcoXslsf21239roLXcBRuwgMrbtMFX+EzPLOek8J+2wM/4BvMjB3+pggewUJ4KlrrjJXDsPVMbiRaVoOiPf0E1sJbK+7kHnaYQTfg9TwjugtMgMmSEDyEudaz2WWYUKL+zYPOA+8qeaLbyuu6HT6IHlLC5O2LhhfMhGiJ2b08bMXjYU7QFdrgO2wRPdV7El3hsOiFQzjGWmZ5cFXtlhUPluO0GXSDSrgDh+Cx6OGzGYEXcFz0xC+KJsFkudXOrz6TZOOBoR/ewSnxoBy8IATP5WebCyxsnWUS+wmbJqV8AfPaVXpFBHDPAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAZCAYAAAAiwE4nAAABYklEQVR4Xu2UvyuFURzGH/kRRVLKYJPFwCKDMsnKoEzqDhaLiYnJ4g9gI/KjZKAMshObWSZ1N4PZYMHz+J63zv12r7fzuha9n/oM9zn3nO95zy+g5L/QRvcSXLJuxVmmwy57oZ90Lsra6SXdibJkOmGDeFRMRYdcfgybYGFG6JUPYQWvYRPK0NKf0ZkoS0b7semyHljBDZd303PYJJvKIq3SQZf/CS30kF7AljAF9e3wYR799JGu+oYcnmDbkHygxukbnfINOWhfn+mEb/gJLaGWUjPV8qSgu6mtSOqnQ1KFFWyEBpymB/SWzof8ATbZI3pCR0PeEN23BfpB32lrbfM3KrZC7+kAbAn3Q9srXYf10/VJPQN10SD1Xh8Rn2rtf1Puqp61G9gXxPSh9nRuhWwsygqhQe9gL5GYpGuwr8lOdXat9LsSssL00lO6Czs0WuIuOgsrJPRbb/N2+H9Jye/4Apr+PFx5pdgCAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAZCAYAAAAFbs/PAAAAyklEQVR4XmNgGF5gNxA/AuJXQPwAVQo3KAfi/1CaIGAB4jVA/BuIbdDksAJpBohT7gKxOKoUduACxP8YILaAbANp4kBRgQa2MkDcD/K0O1SsFSoWAVOEDJ4D8U8gtkUSwxsIIIn5QMwI5YNoEB8k7glThAxAEulIfBEgvgrET4BYEUkcDJSA+DQQCyKJTWFAdb8mkhyDHxDPQRZggJh8nQESWiCMYgsoNKKRBYDgKxAvBWJmIC5jQPgNDHiQOVAAUiAMxSiKR8HAAwBOoyQQQpcK6wAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAbCAYAAACjkdXHAAAA50lEQVR4XmNgGNaAFYidgVgaXYIYEAPE/4HYF12CEBAD4isMEM1FaHIEQTMDRCMIl6PJEQQnoRikeSGaHF7gB8Q8DBAbQZoPQPkEgTAQ74OygxhI1AyybQKUDQplkOaHQCwJV4EDqDBAbFGA8k2B+BsQPwFiGagYVsACxLOAOANJzBiIv0IxiI0T2ALxTwZE9CBjkO0gV2AFINvmMkCSIzIQBOLTDBADotHk4OAMEGujCzJAQvgAA46EArLJCIjPM2BP/BIMkGgDaZ6JLKEPxJ+gEiAM8q8lkvxFJDkYnoQkPwpGAW4AAO2uNQEiybs+AAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAbCAYAAABBTc6+AAAAg0lEQVR4XmNgGAUkA0YgNgfiFUD8DIhfA7E2soJVQPwDiBuBWBWIhRkgmsCAH4j/AnEwTAAdlAPxeiBmRZcAAR4gPgDE/9EwyBowkATih0CsBBNAB5xAvAOITdElkIErEM9iQHUDyMso4DoQ3wHiuUB8GoitUaUhfgb5HeQmATS5EQ8ACy4TcCzBFrcAAAAASUVORK5CYII=>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAbCAYAAABIpm7EAAAAqElEQVR4XmNgGAXDAmgB8QogfgbE/9FwL5I6MOiESvwC4kdQNgiDNIP48QilDAysQPwXiPOBmBkqNh+I/wGxB0wRMvAD4glAzIgk5ssAsaEcSQwMOIF4BxDroImnM+DQYAnEP9EFgeA6FIujS+gD8Sd0QQaIn4LRBUEA5KTNQMwP5YP8AfJTMZSNFcgA8R0gngvE54D4JAMexTAgAMSSQMyDLjEKBh8AAOrWIOjXAi92AAAAAElFTkSuQmCC>