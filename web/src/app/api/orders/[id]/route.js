import sql from "@/app/api/utils/sql";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    if (!status) {
      return Response.json({ error: 'Status is required' }, { status: 400 });
    }
    
    const [order] = await sql`
      UPDATE customer_orders 
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return Response.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return Response.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const [order] = await sql`
      DELETE FROM customer_orders 
      WHERE id = ${id}
      RETURNING *
    `;
    
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return Response.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}