// Cloudflare Pages Function: GET and POST /api/phones
export async function onRequestGet(context) {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "D1 Database binding 'DB' not found." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { results } = await db.prepare("SELECT * FROM phones").all();

    // Map rows to parse JSON strings back into objects
    const phones = results.map(row => ({
      id: row.id,
      brand: row.brand,
      model: row.model,
      color: row.color,
      sellingPrices: JSON.parse(row.selling_prices || "[]"),
      repairs: JSON.parse(row.repairs || "[]")
    }));

    return new Response(JSON.stringify(phones), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "D1 Database binding 'DB' not found." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await context.request.json();
    const { brand, model, color, sellingPrices = [], repairs = [] } = body;

    if (!brand || !model) {
      return new Response(JSON.stringify({ error: "Brand and Model are required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Generate unique ID
    const baseId = model.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = await db.prepare("SELECT id FROM phones WHERE id = ?").bind(baseId).first();
    let uniqueId = baseId;
    if (existing) {
      uniqueId = `${baseId}-${Date.now()}`;
    }

    const sellingPricesStr = JSON.stringify(sellingPrices);
    const repairsStr = JSON.stringify(repairs);

    await db.prepare(
      "INSERT INTO phones (id, brand, model, color, selling_prices, repairs) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(uniqueId, brand, model, color || "#06b6d4", sellingPricesStr, repairsStr)
    .run();

    const createdPhone = {
      id: uniqueId,
      brand,
      model,
      color: color || "#06b6d4",
      sellingPrices,
      repairs
    };

    return new Response(JSON.stringify(createdPhone), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
