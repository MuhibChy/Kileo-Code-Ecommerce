export const mockCategories = [
  { id: 'all', name: 'All Products', icon: 'Grid', count: 12 },
  { id: 'electronics', name: 'Electronics & Audio', icon: 'Headphones', count: 4 },
  { id: 'wearables', name: 'Smart Wearables', icon: 'Watch', count: 2 },
  { id: 'computing', name: 'Computers & Gaming', icon: 'Laptop', count: 3 },
  { id: 'accessories', name: 'Premium Accessories', icon: 'Smartphone', count: 3 }
];

export const mockVendors = [
  {
    id: 'v1',
    name: 'TechSphere Global',
    rating: 4.9,
    reviews: 1420,
    productsCount: 48,
    isVerified: true,
    location: 'San Francisco, CA',
    description: 'Premier authorized distributor of next-gen smart hardware and acoustics.'
  },
  {
    id: 'v2',
    name: 'AudioLux Studio',
    rating: 4.8,
    reviews: 890,
    productsCount: 32,
    isVerified: true,
    location: 'Berlin, Germany',
    description: 'Acoustic engineers curating audiophile-grade wireless monitors and sound equipment.'
  },
  {
    id: 'v3',
    name: 'Nexus Horizon',
    rating: 4.9,
    reviews: 2150,
    productsCount: 65,
    isVerified: true,
    location: 'Tokyo, Japan',
    description: 'Precision gaming gear, custom mechanical keyboards, and ergonomics.'
  },
  {
    id: 'v4',
    name: 'PrimeGear Labs',
    rating: 4.7,
    reviews: 620,
    productsCount: 24,
    isVerified: true,
    location: 'Austin, TX',
    description: 'High-speed fast charging, aerospace-grade docks, and smart power banks.'
  }
];

export const mockBanners = [
  {
    id: 'b1',
    tag: 'Flagship Launch 2026',
    title: 'Acoustic Precision. Wireless Perfection.',
    subtitle: 'Experience spatial lossless audio with Kileo Pro Wireless Noise-Cancelling Headphones.',
    badge: 'Save 25% Today',
    ctaText: 'Shop Flagship Audio',
    code: 'KILEO25',
    category: 'electronics',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    accentColor: '#818cf8',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'b2',
    tag: 'Exclusive Vendor Showcase',
    title: 'Ultra-Slim Mechanical Ergonomics',
    subtitle: 'Machined aluminum chassis, hot-swappable switches, and multi-device Bluetooth 5.4.',
    badge: 'Free Express Delivery',
    ctaText: 'Explore Keyboards',
    code: 'NEXUS10',
    category: 'computing',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
    accentColor: '#34d399',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'b3',
    tag: 'Next-Gen Wearables',
    title: 'Titanium Smart Health Tracker',
    subtitle: 'Continuous ECG, 14-day battery life, and sapphire glass crystal for the modern explorer.',
    badge: 'Limited Stock',
    ctaText: 'Discover Wearables',
    code: 'TITAN20',
    category: 'wearables',
    gradient: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #b45309 100%)',
    accentColor: '#fbbf24',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  }
];

export const mockProducts = [
  {
    id: 'p1',
    name: 'Kileo Pro Studio Wireless Headphones',
    slug: 'kileo-pro-studio-wireless-headphones',
    category: 'electronics',
    vendorId: 'v2',
    vendorName: 'AudioLux Studio',
    price: 249.99,
    compareAtPrice: 329.99,
    rating: 4.9,
    numReviews: 128,
    quantity: 34,
    sku: 'KIL-AUD-01',
    isFeatured: true,
    isHot: true,
    tag: 'Best Seller',
    description: 'Engineered with custom 40mm beryllium drivers, active hybrid noise cancellation (ANC), 45-hour playback, and ultra-plush memory foam earpads.',
    specs: {
      'Driver Size': '40mm Beryllium',
      'Battery Life': '45 Hours (ANC On)',
      'Connectivity': 'Bluetooth 5.4 & 3.5mm Hi-Res',
      'Weight': '248g'
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p2',
    name: 'Titanium Apex Chrono Smartwatch',
    slug: 'titanium-apex-chrono-smartwatch',
    category: 'wearables',
    vendorId: 'v1',
    vendorName: 'TechSphere Global',
    price: 319.00,
    compareAtPrice: 399.00,
    rating: 4.8,
    numReviews: 94,
    quantity: 18,
    sku: 'KIL-WAT-02',
    isFeatured: true,
    isHot: false,
    tag: 'New',
    description: 'Forged Grade 5 aerospace titanium, dual-frequency GNSS GPS, sapphire touchscreen, water resistant to 100 meters, and biometric heart/SpO2 sensors.',
    specs: {
      'Case Material': 'Grade 5 Titanium',
      'Display': '1.43” AMOLED Sapphire Glass',
      'Water Rating': '10 ATM (100m)',
      'Battery': 'Up to 14 Days'
    },
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p3',
    name: 'Nexus Horizon 75% Mechanical Keyboard',
    slug: 'nexus-horizon-75-mechanical-keyboard',
    category: 'computing',
    vendorId: 'v3',
    vendorName: 'Nexus Horizon',
    price: 159.50,
    compareAtPrice: 189.00,
    rating: 4.9,
    numReviews: 215,
    quantity: 42,
    sku: 'KIL-KB-03',
    isFeatured: true,
    isHot: true,
    tag: 'Top Rated',
    description: 'Gasket-mounted acoustic dampening, hot-swappable tactile switches, South-facing RGB lighting, and custom CNC aluminum volume encoder.',
    specs: {
      'Layout': '75% Compact (82 Keys)',
      'Mount Style': 'Gasket Mount Silicone Dampened',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Connection': 'Tri-mode (Type-C, 2.4Ghz, BT 5.1)'
    },
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p4',
    name: 'Quantum Soundbar with Wireless Subwoofer',
    slug: 'quantum-soundbar-subwoofer',
    category: 'electronics',
    vendorId: 'v2',
    vendorName: 'AudioLux Studio',
    price: 289.00,
    compareAtPrice: 349.00,
    rating: 4.7,
    numReviews: 67,
    quantity: 12,
    sku: 'KIL-SND-04',
    isFeatured: false,
    isHot: false,
    tag: 'Sale',
    description: 'Dolby Atmos 5.1 cinema soundbar with downward-firing wireless 8-inch subwoofer, eARC HDMI pass-through, and room acoustic calibration.',
    specs: {
      'Channels': '5.1 Channel Surround',
      'Output Power': '420 Watts Peak',
      'Connectivity': 'HDMI eARC, Optical, AirPlay 2',
      'Format Support': 'Dolby Atmos, DTS:X'
    },
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p5',
    name: 'AeroGlide Wireless Precision Mouse',
    slug: 'aeroglide-wireless-precision-mouse',
    category: 'computing',
    vendorId: 'v3',
    vendorName: 'Nexus Horizon',
    price: 79.99,
    compareAtPrice: 99.99,
    rating: 4.8,
    numReviews: 184,
    quantity: 55,
    sku: 'KIL-MSE-05',
    isFeatured: true,
    isHot: false,
    tag: 'Popular',
    description: 'Ultralight 58-gram ergonomic gaming mouse with 26,000 DPI optical sensor, optical switches, and zero-latency wireless polling.',
    specs: {
      'Weight': '58 grams',
      'Sensor': 'PAW3395 26,000 DPI',
      'Battery Life': '90 Hours continuous',
      'Switches': 'Optical 100M Clicks'
    },
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p6',
    name: 'GaN Ultra 140W Multi-Port Fast Charger',
    slug: 'gan-ultra-140w-fast-charger',
    category: 'accessories',
    vendorId: 'v4',
    vendorName: 'PrimeGear Labs',
    price: 64.99,
    compareAtPrice: 79.99,
    rating: 4.9,
    numReviews: 142,
    quantity: 60,
    sku: 'KIL-CHG-06',
    isFeatured: false,
    isHot: true,
    tag: 'Fast Charging',
    description: 'Gallium Nitride (GaN III) high-efficiency charger with 3x USB-C Power Delivery 3.1 ports and 1x USB-A port. Capable of fast-charging a 16-inch laptop in 30 minutes.',
    specs: {
      'Max Output': '140W USB-PD 3.1',
      'Ports': '3x USB-C, 1x USB-A',
      'Safety': 'Over-voltage, heat monitoring',
      'Plugs': 'Foldable US / UK / EU adapter bundle'
    },
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p7',
    name: 'PulseTrack Active Fitness Smart Band',
    slug: 'pulsetrack-active-fitness-smart-band',
    category: 'wearables',
    vendorId: 'v1',
    vendorName: 'TechSphere Global',
    price: 89.00,
    compareAtPrice: 119.00,
    rating: 4.6,
    numReviews: 73,
    quantity: 29,
    sku: 'KIL-BND-07',
    isFeatured: false,
    isHot: false,
    tag: 'Fitness',
    description: 'Featherlight fitness tracker with 24/7 heart-rate variability, sleep staging analysis, 30+ workout modes, and 50m waterproof rating.',
    specs: {
      'Weight': '21 grams',
      'Display': '1.1-inch Color OLED',
      'Battery': '20 Days on single charge',
      'Waterproof': '5 ATM'
    },
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p8',
    name: 'Nomad MagSafe Aluminum Desk Stand',
    slug: 'nomad-magsafe-desk-stand',
    category: 'accessories',
    vendorId: 'v4',
    vendorName: 'PrimeGear Labs',
    price: 49.99,
    compareAtPrice: 59.99,
    rating: 4.8,
    numReviews: 88,
    quantity: 40,
    sku: 'KIL-STN-08',
    isFeatured: false,
    isHot: false,
    tag: 'Desk Setup',
    description: 'Precision CNC sculpted anodized aluminum charging dock with magnetic alignment, weighted non-slip base, and cable concealment channel.',
    specs: {
      'Material': '6000-series Anodized Aluminum',
      'Angle': '60-degree viewing tilt',
      'Compatibility': 'iPhone 12-16 & MagSafe cases',
      'Weight': '320g weighted base'
    },
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p9',
    name: 'SpatialAudio ANC Earbuds Pro',
    slug: 'spatialaudio-anc-earbuds-pro',
    category: 'electronics',
    vendorId: 'v2',
    vendorName: 'AudioLux Studio',
    price: 139.99,
    compareAtPrice: 179.99,
    rating: 4.8,
    numReviews: 156,
    quantity: 26,
    sku: 'KIL-EAR-09',
    isFeatured: true,
    isHot: true,
    tag: 'Trending',
    description: 'Ultra-low distortion micro-planar drivers, transparency mode, wireless Qi charging case, IPX5 sweat resistance, and quad-mic beamforming.',
    specs: {
      'Playback': '8 Hours + 24 Hours in case',
      'Codecs': 'LDAC, AAC, aptX Adaptive',
      'Noise Cancel': 'Up to 42dB cancellation',
      'Waterproof': 'IPX5'
    },
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p10',
    name: 'Apex Horizon 4K Ultra-Wide Curved Monitor',
    slug: 'apex-horizon-4k-curved-monitor',
    category: 'computing',
    vendorId: 'v3',
    vendorName: 'Nexus Horizon',
    price: 699.00,
    compareAtPrice: 849.00,
    rating: 4.9,
    numReviews: 92,
    quantity: 8,
    sku: 'KIL-MON-10',
    isFeatured: true,
    isHot: false,
    tag: 'Premium',
    description: '34-inch 1500R curved Nano IPS panel with 165Hz refresh rate, 98% DCI-P3 color gamut, USB-C 90W PD hub, and ergonomic height-adjustable stand.',
    specs: {
      'Size & Curve': '34-inch 21:9 (1500R Curve)',
      'Resolution': '3440 x 1440 WQHD',
      'Refresh Rate': '165Hz (1ms GtG)',
      'Ports': '2x HDMI 2.1, 1x DP 1.4, USB-C 90W'
    },
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p11',
    name: 'OmniPack 25,000mAh Laptop Power Bank',
    slug: 'omnipack-25000mah-power-bank',
    category: 'accessories',
    vendorId: 'v4',
    vendorName: 'PrimeGear Labs',
    price: 99.00,
    compareAtPrice: 129.00,
    rating: 4.7,
    numReviews: 81,
    quantity: 35,
    sku: 'KIL-PWR-11',
    isFeatured: false,
    isHot: false,
    tag: 'Travel Ready',
    description: 'Airline approved 99.9Wh flight-safe power bank with real-time digital OLED status screen, dual 100W USB-C bidirectional fast charging.',
    specs: {
      'Capacity': '25,000mAh / 92.5Wh',
      'Output': '100W USB-C + 45W USB-C + 18W USB-A',
      'Display': 'Full OLED Wattage & Health readout',
      'Recharge Time': '45 minutes to 80%'
    },
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 'p12',
    name: 'CyberShield RFID Minimalist Carbon Wallet',
    slug: 'cybershield-rfid-carbon-wallet',
    category: 'accessories',
    vendorId: 'v1',
    vendorName: 'TechSphere Global',
    price: 45.00,
    compareAtPrice: 55.00,
    rating: 4.8,
    numReviews: 110,
    quantity: 50,
    sku: 'KIL-WLT-12',
    isFeatured: false,
    isHot: false,
    tag: 'EDC',
    description: 'Constructed from genuine 3K matte carbon fiber plates with military-grade RFID blocking, cash strap, and quick-card eject mechanism.',
    specs: {
      'Material': 'Aerospace 3K Carbon Fiber',
      'Capacity': '1 to 12 cards + 10 bills',
      'Protection': '13.56 MHz RFID Shielding',
      'Weight': '42g'
    },
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80'
    ]
  }
];

export const mockCoupons = [
  { code: 'KILEO20', discountPercent: 20, description: '20% Off Storewide' },
  { code: 'WELCOME10', discountPercent: 10, description: '10% Off Your Order' },
  { code: 'KILEO50', fixedDiscount: 50, minSpend: 200, description: '$50 Off orders over $200' },
  { code: 'FREESHIP', freeShipping: true, description: 'Free Express Shipping' }
];

export const mockReviews = {
  p1: [
    { id: 'r1', user: 'Marcus Vance', rating: 5, date: '2 days ago', verified: true, title: 'Incredible soundstage and battery life', comment: 'The beryllium drivers deliver a crispness I have not heard in wireless headphones before. Battery lasted my entire 4-day trip!' },
    { id: 'r2', user: 'Elena Rostova', rating: 5, date: '1 week ago', verified: true, title: 'Comfortable for 8-hour work days', comment: 'Extremely soft earcups and the ANC isolates typing noise completely. Well worth the price.' },
    { id: 'r3', user: 'David Kim', rating: 4, date: '2 weeks ago', verified: true, title: 'Superb build quality', comment: 'Solid hinges, premium case. App EQ presets are spot on.' }
  ],
  p2: [
    { id: 'r4', user: 'Sophia Martinez', rating: 5, date: '3 days ago', verified: true, title: 'Titanium chassis is gorgeous', comment: 'Lightweight yet rugged. GPS locks in under 3 seconds on morning runs.' },
    { id: 'r5', user: 'Liam O’Connor', rating: 4, date: '1 week ago', verified: true, title: 'Excellent battery life', comment: 'Almost 12 days before needing a charge with notifications active.' }
  ],
  p3: [
    { id: 'r6', user: 'Alex Chen', rating: 5, date: 'Yesterday', verified: true, title: 'Best typing sound profile out of the box', comment: 'The gasket mount creates a deep, satisfying thock. No rattle on the spacebar.' }
  ]
};
