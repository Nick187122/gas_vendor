import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const companies = await sql`
      SELECT * FROM gas_companies 
      ORDER BY name ASC
    `;
    
    return Response.json({ companies });
  } catch (error) {
    console.error('Error fetching gas companies:', error);
    return Response.json({ error: 'Failed to fetch gas companies' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, logo_url } = await request.json();
    
    if (!name) {
      return Response.json({ error: 'Company name is required' }, { status: 400 });
    }
    
    const [company] = await sql`
      INSERT INTO gas_companies (name, logo_url)
      VALUES (${name}, ${logo_url})
      RETURNING *
    `;
    
    return Response.json({ company });
  } catch (error) {
    console.error('Error creating gas company:', error);
    return Response.json({ error: 'Failed to create gas company' }, { status: 500 });
  }
}