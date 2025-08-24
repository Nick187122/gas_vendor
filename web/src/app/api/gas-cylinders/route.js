import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const cylinders = await sql`
      SELECT 
        gc.*,
        comp.name as company_name,
        comp.logo_url as company_logo
      FROM gas_cylinders gc
      LEFT JOIN gas_companies comp ON gc.company_id = comp.id
      ORDER BY comp.name ASC, gc.cylinder_type ASC
    `;
    
    return Response.json({ cylinders });
  } catch (error) {
    console.error('Error fetching gas cylinders:', error);
    return Response.json({ error: 'Failed to fetch gas cylinders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { 
      company_id, 
      cylinder_type, 
      size_kg, 
      price, 
      stock_quantity, 
      description, 
      image_url 
    } = await request.json();
    
    if (!company_id || !cylinder_type || !size_kg || !price) {
      return Response.json({ 
        error: 'Company ID, cylinder type, size, and price are required' 
      }, { status: 400 });
    }
    
    const [cylinder] = await sql`
      INSERT INTO gas_cylinders (
        company_id, cylinder_type, size_kg, price, 
        stock_quantity, description, image_url, updated_at
      )
      VALUES (
        ${company_id}, ${cylinder_type}, ${size_kg}, ${price},
        ${stock_quantity || 0}, ${description}, ${image_url}, CURRENT_TIMESTAMP
      )
      RETURNING *
    `;
    
    return Response.json({ cylinder });
  } catch (error) {
    console.error('Error creating gas cylinder:', error);
    return Response.json({ error: 'Failed to create gas cylinder' }, { status: 500 });
  }
}