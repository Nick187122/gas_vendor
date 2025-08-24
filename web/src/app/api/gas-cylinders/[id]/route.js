import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const [cylinder] = await sql`
      SELECT 
        gc.*,
        comp.name as company_name,
        comp.logo_url as company_logo
      FROM gas_cylinders gc
      LEFT JOIN gas_companies comp ON gc.company_id = comp.id
      WHERE gc.id = ${id}
    `;
    
    if (!cylinder) {
      return Response.json({ error: 'Gas cylinder not found' }, { status: 404 });
    }
    
    return Response.json({ cylinder });
  } catch (error) {
    console.error('Error fetching gas cylinder:', error);
    return Response.json({ error: 'Failed to fetch gas cylinder' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    const allowedFields = [
      'company_id', 'cylinder_type', 'size_kg', 'price', 
      'stock_quantity', 'description', 'image_url'
    ];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(updates[field]);
        paramCount++;
      }
    }
    
    if (updateFields.length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    updateFields.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());
    paramCount++;
    
    values.push(id); // for WHERE clause
    
    const query = `
      UPDATE gas_cylinders 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const [cylinder] = await sql(query, values);
    
    if (!cylinder) {
      return Response.json({ error: 'Gas cylinder not found' }, { status: 404 });
    }
    
    return Response.json({ cylinder });
  } catch (error) {
    console.error('Error updating gas cylinder:', error);
    return Response.json({ error: 'Failed to update gas cylinder' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const [cylinder] = await sql`
      DELETE FROM gas_cylinders 
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (!cylinder) {
      return Response.json({ error: 'Gas cylinder not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Gas cylinder deleted successfully' });
  } catch (error) {
    console.error('Error deleting gas cylinder:', error);
    return Response.json({ error: 'Failed to delete gas cylinder' }, { status: 500 });
  }
}