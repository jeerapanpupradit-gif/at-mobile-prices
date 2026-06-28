// Cloudflare Pages Function: PUT and DELETE /api/phones/[id]
export async function onRequestPut(context) {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "D1 Database binding 'DB' not found." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { id } = context.params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Phone ID param is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get existing record to support partial updates
    const existing = await db.prepare("SELECT * FROM phones WHERE id = ?").bind(id).first();
    if (!existing) {
      return new Response(JSON.stringify({ error: `Phone with ID '${id}' not found.` }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await context.request.json();
    const brand = body.brand !== undefined ? body.brand : existing.brand;
    const model = body.model !== undefined ? body.model : existing.model;
    const color = body.color !== undefined ? body.color : existing.color;
    const sellingPricesStr = body.sellingPrices !== undefined ? JSON.stringify(body.sellingPrices) : existing.selling_prices;
    const repairsStr = body.repairs !== undefined ? JSON.stringify(body.repairs) : existing.repairs;

    await db.prepare(
      "UPDATE phones SET brand = ?, model = ?, color = ?, selling_prices = ?, repairs = ? WHERE id = ?"
    )
    .bind(brand, model, color, sellingPricesStr, repairsStr, id)
    .run();

    const updatedPhone = {
      id,
      brand,
      model,
      color,
      sellingPrices: JSON.parse(sellingPricesStr),
      repairs: JSON.parse(repairsStr)
    };

    return new Response(JSON.stringify(updatedPhone), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestDelete(context) {
  try {
    const db = context.env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: "D1 Database binding 'DB' not found." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { id } = context.params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Phone ID param is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    await db.prepare("DELETE FROM phones WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true, message: `Phone '${id}' deleted.` }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
