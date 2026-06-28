// Cloudflare Pages Function: POST /api/reset
const SEED_PHONES = [
  {
    id: "iphone-15-pro-max",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    color: "#8e8e93", // Titanium Gray
    sellingPrices: [
      { capacity: "256GB", newPrice: 44900, usedPrice: 35900, buyPrice: 31000, trend: "down" },
      { capacity: "512GB", newPrice: 50900, usedPrice: 41900, buyPrice: 36000, trend: "stable" },
      { capacity: "1TB", newPrice: 58900, usedPrice: 48900, buyPrice: 42000, trend: "stable" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 12500, time: "2-3 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 3800, time: "1-2 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนกระจกฝาหลัง (Back Glass)", price: 4500, time: "3-4 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมเมนบอร์ด (Motherboard)", price: 6500, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 5900, time: "2-3 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนแพตูดชาร์จ (Charging Port)", price: 2500, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "iphone-15",
    brand: "Apple",
    model: "iPhone 15",
    color: "#ffc5d9", // Pastel Pink
    sellingPrices: [
      { capacity: "128GB", newPrice: 32900, usedPrice: 24900, buyPrice: 21000, trend: "down" },
      { capacity: "256GB", newPrice: 36900, usedPrice: 28900, buyPrice: 24500, trend: "down" },
      { capacity: "512GB", newPrice: 45900, usedPrice: 36500, buyPrice: 31000, trend: "stable" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 9500, time: "2 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 3500, time: "1 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนกระจกฝาหลัง (Back Glass)", price: 3900, time: "3 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมเมนบอร์ด (Motherboard)", price: 5500, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 4800, time: "2 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนแพตูดชาร์จ (Charging Port)", price: 2200, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "iphone-14-pro",
    brand: "Apple",
    model: "iPhone 14 Pro",
    color: "#5f4f6d", // Deep Purple
    sellingPrices: [
      { capacity: "128GB", newPrice: 36900, usedPrice: 28500, buyPrice: 24000, trend: "down" },
      { capacity: "256GB", newPrice: 40900, usedPrice: 31900, buyPrice: 27000, trend: "down" },
      { capacity: "512GB", newPrice: 49900, usedPrice: 38900, buyPrice: 33000, trend: "down" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 11000, time: "2 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 3500, time: "1 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนกระจกฝาหลัง (Back Glass)", price: 4200, time: "3 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมเมนบอร์ด (Motherboard)", price: 5800, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 5200, time: "2 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนแพตูดชาร์จ (Charging Port)", price: 2200, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "iphone-13",
    brand: "Apple",
    model: "iPhone 13",
    color: "#1d322c", // Midnight Green
    sellingPrices: [
      { capacity: "128GB", newPrice: 24900, usedPrice: 16500, buyPrice: 13500, trend: "down" },
      { capacity: "256GB", newPrice: 28900, usedPrice: 19500, buyPrice: 16000, trend: "down" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 7900, time: "2 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 3200, time: "1-2 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนกระจกฝาหลัง (Back Glass)", price: 2900, time: "3 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมเมนบอร์ด (Motherboard)", price: 3500, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 3800, time: "2 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนแพตูดชาร์จ (Charging Port)", price: 1800, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "galaxy-s24-ultra",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    color: "#2a2d34", // Titanium Black
    sellingPrices: [
      { capacity: "256GB", newPrice: 46900, usedPrice: 37500, buyPrice: 32000, trend: "up" },
      { capacity: "512GB", newPrice: 52900, usedPrice: 42900, buyPrice: 37000, trend: "stable" },
      { capacity: "1TB", newPrice: 62900, usedPrice: 50900, buyPrice: 44000, trend: "stable" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ศูนย์ (Original Screen)", price: 9900, time: "2-3 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่ศูนย์ (Original Battery)", price: 2200, time: "1-2 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนฝาหลังแท้ (Back Glass)", price: 2800, time: "2 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมบอร์ด (Motherboard)", price: 6000, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 6900, time: "2 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนตูดชาร์จ (Charging Port)", price: 1800, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "galaxy-s23-ultra",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    color: "#2e3b32", // Green
    sellingPrices: [
      { capacity: "256GB", newPrice: 37900, usedPrice: 26900, buyPrice: 22000, trend: "down" },
      { capacity: "512GB", newPrice: 43900, usedPrice: 30900, buyPrice: 25500, trend: "down" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ศูนย์ (Original Screen)", price: 8500, time: "2 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่ศูนย์ (Original Battery)", price: 1950, time: "1 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนฝาหลังแท้ (Back Glass)", price: 2500, time: "2 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมบอร์ด (Motherboard)", price: 5000, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 5900, time: "2 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนตูดชาร์จ (Charging Port)", price: 1800, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "galaxy-a55",
    brand: "Samsung",
    model: "Galaxy A55 5G",
    color: "#c2d4f0", // Awesome Iceblue
    sellingPrices: [
      { capacity: "128GB", newPrice: 13990, usedPrice: 9900, buyPrice: 8000, trend: "stable" },
      { capacity: "256GB", newPrice: 15990, usedPrice: 11500, buyPrice: 9500, trend: "stable" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ศูนย์ (Original Screen)", price: 3500, time: "2 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่ศูนย์ (Original Battery)", price: 1200, time: "1 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนฝาหลังแท้ (Back Glass)", price: 1500, time: "2-3 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมบอร์ด (Motherboard)", price: 2900, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 2200, time: "2 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนตูดชาร์จ (Charging Port)", price: 1200, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "xiaomi-14-ultra",
    brand: "Xiaomi",
    model: "Xiaomi 14 Ultra",
    color: "#111111", // Black Leather
    sellingPrices: [
      { capacity: "512GB", newPrice: 40990, usedPrice: 32500, buyPrice: 27500, trend: "down" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 8900, time: "3 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 2000, time: "1 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนฝาหลังแท้ (Back Glass)", price: 2500, time: "2 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมบอร์ด (Motherboard)", price: 4500, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 1800, time: "1-2 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนตูดชาร์จ (Charging Port)", price: 1900, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "redmi-note-13-pro",
    brand: "Xiaomi",
    model: "Redmi Note 13 Pro+ 5G",
    color: "#ded2f9", // Aurora Purple
    sellingPrices: [
      { capacity: "256GB", newPrice: 12990, usedPrice: 8900, buyPrice: 7000, trend: "down" },
      { capacity: "512GB", newPrice: 14990, usedPrice: 10500, buyPrice: 8500, trend: "down" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 4200, time: "2-3 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 1200, time: "1 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนฝาหลังแท้ (Back Glass)", price: 1500, time: "2 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมบอร์ด (Motherboard)", price: 3500, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 2800, time: "2 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนตูดชาร์จ (Charging Port)", price: 1200, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "oppo-reno-11-pro",
    brand: "Oppo",
    model: "Reno 11 Pro 5G",
    color: "#ffffff", // Pearl White
    sellingPrices: [
      { capacity: "512GB", newPrice: 19990, usedPrice: 13500, buyPrice: 11000, trend: "down" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 5500, time: "2 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 1400, time: "1 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนฝาหลังแท้ (Back Glass)", price: 1800, time: "2 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมบอร์ด (Motherboard)", price: 3900, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 1800, time: "1.5 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนตูดชาร์จ (Charging Port)", price: 1400, time: "1 ชม.", warranty: "90 วัน" }
    ]
  },
  {
    id: "vivo-v30-pro",
    brand: "Vivo",
    model: "V30 Pro 5G",
    color: "#e2f2fd", // Bloom White
    sellingPrices: [
      { capacity: "512GB", newPrice: 19999, usedPrice: 13900, buyPrice: 11500, trend: "stable" }
    ],
    repairs: [
      { type: "screen", name: "เปลี่ยนหน้าจอแท้ (Original Screen)", price: 5200, time: "2 ชม.", warranty: "90 วัน" },
      { type: "battery", name: "เปลี่ยนแบตเตอรี่แท้ (Original Battery)", price: 1300, time: "1 ชม.", warranty: "180 วัน" },
      { type: "backglass", name: "เปลี่ยนฝาหลังแท้ (Back Glass)", price: 1800, time: "2 ชม.", warranty: "90 วัน" },
      { type: "motherboard", name: "ซ่อมบอร์ด (Motherboard)", price: 3900, time: "1-2 วัน", warranty: "90 วัน" },
      { type: "camera", name: "เปลี่ยนกล้องหลัง (Rear Camera)", price: 3800, time: "2-3 ชม.", warranty: "90 วัน" },
      { type: "charging", name: "เปลี่ยนตูดชาร์จ (Charging Port)", price: 1400, time: "1 ชม.", warranty: "90 วัน" }
    ]
  }
];

export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "D1 Database binding 'DB' not found." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Clear all existing rows
    await db.prepare("DELETE FROM phones").run();

    // Prepare insertion statement
    const insertStmt = db.prepare(
      "INSERT INTO phones (id, brand, model, color, selling_prices, repairs) VALUES (?, ?, ?, ?, ?, ?)"
    );

    const statements = SEED_PHONES.map(phone => 
      insertStmt.bind(
        phone.id,
        phone.brand,
        phone.model,
        phone.color,
        JSON.stringify(phone.sellingPrices),
        JSON.stringify(phone.repairs)
      )
    );

    // D1 batch executions run multiple statements in a single transaction
    await db.batch(statements);

    return new Response(JSON.stringify(SEED_PHONES), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
