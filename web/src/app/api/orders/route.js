import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const orders = await sql`
      SELECT 
        co.*,
        gc.cylinder_type,
        gc.size_kg,
        gc.price,
        comp.name as company_name
      FROM customer_orders co
      LEFT JOIN gas_cylinders gc ON co.cylinder_id = gc.id
      LEFT JOIN gas_companies comp ON gc.company_id = comp.id
      ORDER BY co.created_at DESC
    `;
    
    return Response.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { 
      customer_name,
      customer_phone,
      customer_address,
      latitude,
      longitude,
      cylinder_id,
      quantity,
      notes
    } = await request.json();
    
    if (!customer_name || !customer_phone || !customer_address || !cylinder_id || !quantity) {
      return Response.json({ 
        error: 'Customer name, phone, address, cylinder, and quantity are required' 
      }, { status: 400 });
    }
    
    // Get cylinder price to calculate total
    const [cylinder] = await sql`
      SELECT price FROM gas_cylinders WHERE id = ${cylinder_id}
    `;
    
    if (!cylinder) {
      return Response.json({ error: 'Invalid cylinder selected' }, { status: 400 });
    }
    
    const total_amount = cylinder.price * quantity;
    
    const [order] = await sql`
      INSERT INTO customer_orders (
        customer_name, customer_phone, customer_address,
        latitude, longitude, cylinder_id, quantity, 
        total_amount, notes
      )
      VALUES (
        ${customer_name}, ${customer_phone}, ${customer_address},
        ${latitude}, ${longitude}, ${cylinder_id}, ${quantity},
        ${total_amount}, ${notes}
      )
      RETURNING *
    `;
    
    return Response.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}